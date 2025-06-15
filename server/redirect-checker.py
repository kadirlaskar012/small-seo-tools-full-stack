import requests
import time
import json
from urllib.parse import urlparse, urljoin
from typing import List, Dict, Optional, Tuple
import re

class RedirectChainChecker:
    def __init__(self, timeout: int = 10, max_redirects: int = 15):
        self.timeout = timeout
        self.max_redirects = max_redirects
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        })

    def validate_url(self, url: str) -> Tuple[bool, str]:
        """Validate and normalize URL"""
        if not url:
            return False, "URL cannot be empty"
        
        # Add protocol if missing
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        
        # Basic URL validation
        try:
            parsed = urlparse(url)
            if not parsed.netloc:
                return False, "Invalid URL format"
            return True, url
        except Exception:
            return False, "Invalid URL format"

    def check_redirect_chain(self, url: str) -> Dict:
        """Check complete redirect chain for a URL"""
        is_valid, normalized_url = self.validate_url(url)
        if not is_valid:
            return {
                'success': False,
                'error': normalized_url,
                'chain': [],
                'summary': {}
            }

        chain = []
        current_url = normalized_url
        start_time = time.time()
        
        try:
            for step in range(self.max_redirects + 1):
                step_start = time.time()
                
                try:
                    response = self.session.get(
                        current_url,
                        allow_redirects=False,
                        timeout=self.timeout,
                        verify=True
                    )
                    
                    step_time = round((time.time() - step_start) * 1000, 2)
                    
                    # Parse domain info
                    parsed_url = urlparse(current_url)
                    domain = parsed_url.netloc
                    protocol = parsed_url.scheme
                    
                    step_info = {
                        'step': step + 1,
                        'url': current_url,
                        'status_code': response.status_code,
                        'status_text': response.reason or '',
                        'domain': domain,
                        'protocol': protocol,
                        'response_time': step_time,
                        'is_redirect': 300 <= response.status_code < 400,
                        'is_final': response.status_code == 200,
                        'is_error': response.status_code >= 400,
                        'headers': dict(response.headers)
                    }
                    
                    # Check for redirect
                    if 300 <= response.status_code < 400:
                        location = response.headers.get('location', '')
                        if not location:
                            step_info['error'] = 'Redirect without location header'
                            chain.append(step_info)
                            break
                        
                        # Handle relative URLs
                        next_url = urljoin(current_url, location)
                        step_info['redirect_to'] = next_url
                        
                        # Check for redirect loop
                        if next_url in [step['url'] for step in chain]:
                            step_info['error'] = 'Redirect loop detected'
                            chain.append(step_info)
                            break
                        
                        chain.append(step_info)
                        current_url = next_url
                        
                    else:
                        # Final response (200, 404, etc.)
                        if response.status_code == 200:
                            # Check for meta refresh redirects
                            try:
                                content = response.text[:10000]  # First 10KB only
                                meta_refresh = self._check_meta_refresh(content)
                                if meta_refresh:
                                    step_info['meta_refresh'] = meta_refresh
                            except:
                                pass
                        
                        chain.append(step_info)
                        break
                        
                except requests.exceptions.Timeout:
                    chain.append({
                        'step': step + 1,
                        'url': current_url,
                        'error': 'Request timeout',
                        'response_time': self.timeout * 1000
                    })
                    break
                except requests.exceptions.ConnectionError:
                    chain.append({
                        'step': step + 1,
                        'url': current_url,
                        'error': 'Connection failed',
                        'response_time': round((time.time() - step_start) * 1000, 2)
                    })
                    break
                except Exception as e:
                    chain.append({
                        'step': step + 1,
                        'url': current_url,
                        'error': f'Request failed: {str(e)}',
                        'response_time': round((time.time() - step_start) * 1000, 2)
                    })
                    break
            
            else:
                # Max redirects exceeded
                chain.append({
                    'step': len(chain) + 1,
                    'error': f'Too many redirects (>{self.max_redirects})',
                    'url': current_url
                })
            
            total_time = round((time.time() - start_time) * 1000, 2)
            summary = self._generate_summary(chain, total_time, normalized_url)
            
            return {
                'success': True,
                'chain': chain,
                'summary': summary,
                'original_url': normalized_url,
                'total_time': total_time
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Analysis failed: {str(e)}',
                'chain': [],
                'summary': {}
            }

    def _check_meta_refresh(self, content: str) -> Optional[str]:
        """Check for meta refresh redirects in HTML content"""
        try:
            meta_refresh_pattern = r'<meta[^>]*http-equiv=["\']refresh["\'][^>]*content=["\']([^"\']*)["\']'
            match = re.search(meta_refresh_pattern, content, re.IGNORECASE)
            if match:
                content_attr = match.group(1)
                url_match = re.search(r'url=([^;]+)', content_attr, re.IGNORECASE)
                if url_match:
                    return url_match.group(1).strip()
        except:
            pass
        return None

    def _generate_summary(self, chain: List[Dict], total_time: float, original_url: str) -> Dict:
        """Generate summary of redirect chain analysis"""
        if not chain:
            return {}
        
        final_step = chain[-1]
        redirect_count = len([step for step in chain if step.get('is_redirect', False)])
        
        # Determine status
        if any(step.get('error') for step in chain):
            status = 'error'
            status_text = 'Error in redirect chain'
        elif 'redirect loop' in str(chain).lower():
            status = 'loop'
            status_text = 'Redirect loop detected'
        elif redirect_count == 0:
            status = 'direct'
            status_text = 'Direct response (no redirects)'
        elif final_step.get('is_final'):
            status = 'success'
            status_text = 'Redirect chain completed successfully'
        else:
            status = 'incomplete'
            status_text = 'Redirect chain incomplete'
        
        # Check for protocol downgrades
        protocol_warning = False
        for i, step in enumerate(chain[:-1]):
            if step.get('protocol') == 'https' and chain[i+1].get('protocol') == 'http':
                protocol_warning = True
                break
        
        # Final URL
        final_url = final_step.get('url', '')
        final_status = final_step.get('status_code')
        
        return {
            'status': status,
            'status_text': status_text,
            'redirect_count': redirect_count,
            'total_steps': len(chain),
            'final_url': final_url,
            'final_status_code': final_status,
            'total_time': total_time,
            'protocol_warning': protocol_warning,
            'has_errors': any(step.get('error') for step in chain),
            'original_url': original_url,
            'url_changed': original_url.rstrip('/') != final_url.rstrip('/') if final_url else True
        }

    def generate_report(self, result: Dict, format_type: str = 'text') -> str:
        """Generate downloadable report"""
        if not result.get('success'):
            return f"Error: {result.get('error', 'Unknown error')}"
        
        if format_type == 'json':
            return json.dumps(result, indent=2)
        
        # Text format
        report = []
        report.append("=== REDIRECT CHAIN ANALYSIS REPORT ===")
        report.append(f"Original URL: {result['original_url']}")
        report.append(f"Analysis Time: {result['total_time']}ms")
        report.append("")
        
        summary = result['summary']
        report.append("=== SUMMARY ===")
        report.append(f"Status: {summary['status_text']}")
        report.append(f"Total Redirects: {summary['redirect_count']}")
        report.append(f"Final URL: {summary['final_url']}")
        report.append(f"Final Status: {summary['final_status_code']}")
        if summary['protocol_warning']:
            report.append("⚠️  WARNING: HTTPS to HTTP downgrade detected")
        report.append("")
        
        report.append("=== REDIRECT CHAIN ===")
        for step in result['chain']:
            step_num = step['step']
            url = step['url']
            status = step.get('status_code', 'N/A')
            time_ms = step.get('response_time', 0)
            
            if step.get('error'):
                report.append(f"Step {step_num}: ERROR - {step['error']}")
            else:
                redirect_to = step.get('redirect_to', '')
                arrow = f" → {redirect_to}" if redirect_to else ""
                report.append(f"Step {step_num}: {url} [{status}] ({time_ms}ms){arrow}")
        
        return "\n".join(report)


# Test function
def test_redirect_checker():
    checker = RedirectChainChecker()
    
    test_urls = [
        "google.com",
        "httpbin.org/redirect/3",
        "httpbin.org/status/404",
    ]
    
    for url in test_urls:
        print(f"\nTesting: {url}")
        result = checker.check_redirect_chain(url)
        print(f"Success: {result['success']}")
        if result['success']:
            print(f"Steps: {len(result['chain'])}")
            print(f"Final URL: {result['summary']['final_url']}")
        else:
            print(f"Error: {result['error']}")


if __name__ == "__main__":
    test_redirect_checker()