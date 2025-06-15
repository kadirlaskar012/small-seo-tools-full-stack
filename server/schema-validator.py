#!/usr/bin/env python3
"""
Schema Markup Tester - Extract and validate structured data from web pages
"""

import json
import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from typing import Dict, List, Any, Optional, Tuple
import time
from dataclasses import dataclass
from enum import Enum

class SchemaType(Enum):
    JSON_LD = "JSON-LD"
    MICRODATA = "Microdata"
    RDFA = "RDFa"

@dataclass
class SchemaItem:
    type: str
    schema_type: SchemaType
    content: Dict[str, Any]
    errors: List[str]
    warnings: List[str]
    line_number: Optional[int] = None

@dataclass
class ValidationResult:
    success: bool
    schemas_found: List[SchemaItem]
    total_schemas: int
    total_errors: int
    total_warnings: int
    page_title: str = ""
    url: str = ""
    processing_time: float = 0.0

class SchemaMarkupTester:
    def __init__(self, timeout: int = 10):
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })

    def validate_url(self, url: str) -> Tuple[bool, str]:
        """Validate and normalize URL"""
        if not url:
            return False, "URL is required"
        
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        
        try:
            parsed = urlparse(url)
            if not parsed.netloc:
                return False, "Invalid URL format"
            return True, url
        except Exception as e:
            return False, f"Invalid URL: {str(e)}"

    def fetch_page_content(self, url: str) -> Tuple[bool, str, str]:
        """Fetch HTML content from URL"""
        try:
            response = self.session.get(url, timeout=self.timeout, allow_redirects=True)
            response.raise_for_status()
            
            # Get page title
            soup = BeautifulSoup(response.text, 'html.parser')
            title_tag = soup.find('title')
            page_title = title_tag.get_text(strip=True) if title_tag else "Untitled"
            
            return True, response.text, page_title
        except requests.RequestException as e:
            return False, f"Failed to fetch page: {str(e)}", ""
        except Exception as e:
            return False, f"Error processing page: {str(e)}", ""

    def extract_json_ld(self, soup: BeautifulSoup) -> List[SchemaItem]:
        """Extract JSON-LD structured data"""
        schemas = []
        
        json_ld_scripts = soup.find_all('script', type='application/ld+json')
        
        for i, script in enumerate(json_ld_scripts):
            if not script.string:
                continue
                
            try:
                # Clean up the JSON content
                content = script.string.strip()
                if not content:
                    continue
                
                # Parse JSON
                data = json.loads(content)
                
                # Handle arrays of schemas
                if isinstance(data, list):
                    for j, item in enumerate(data):
                        schema_item = self._process_json_ld_item(item, f"JSON-LD Script {i+1}, Item {j+1}")
                        if schema_item:
                            schemas.append(schema_item)
                else:
                    schema_item = self._process_json_ld_item(data, f"JSON-LD Script {i+1}")
                    if schema_item:
                        schemas.append(schema_item)
                        
            except json.JSONDecodeError as e:
                errors = [f"Invalid JSON syntax: {str(e)}"]
                schemas.append(SchemaItem(
                    type="Invalid JSON-LD",
                    schema_type=SchemaType.JSON_LD,
                    content={"raw": script.string},
                    errors=errors,
                    warnings=[]
                ))
            except Exception as e:
                errors = [f"Error processing JSON-LD: {str(e)}"]
                schemas.append(SchemaItem(
                    type="Error",
                    schema_type=SchemaType.JSON_LD,
                    content={"raw": script.string},
                    errors=errors,
                    warnings=[]
                ))
        
        return schemas

    def _process_json_ld_item(self, data: Dict[str, Any], identifier: str) -> Optional[SchemaItem]:
        """Process individual JSON-LD item"""
        if not isinstance(data, dict):
            return None
        
        # Get schema type
        schema_type = data.get('@type', 'Unknown')
        if isinstance(schema_type, list):
            schema_type = ', '.join(schema_type)
        
        # Validate schema
        errors, warnings = self._validate_schema(data, schema_type)
        
        return SchemaItem(
            type=schema_type,
            schema_type=SchemaType.JSON_LD,
            content=data,
            errors=errors,
            warnings=warnings
        )

    def extract_microdata(self, soup: BeautifulSoup) -> List[SchemaItem]:
        """Extract Microdata structured data"""
        schemas = []
        
        # Find elements with itemscope
        microdata_elements = soup.find_all(attrs={'itemscope': True})
        
        for i, element in enumerate(microdata_elements):
            try:
                schema_data = self._extract_microdata_item(element)
                if schema_data:
                    item_type = element.get('itemtype', 'Unknown')
                    if item_type.startswith('http'):
                        # Extract schema name from URL
                        schema_type = item_type.split('/')[-1]
                    else:
                        schema_type = item_type
                    
                    errors, warnings = self._validate_microdata(schema_data, schema_type)
                    
                    schemas.append(SchemaItem(
                        type=schema_type,
                        schema_type=SchemaType.MICRODATA,
                        content=schema_data,
                        errors=errors,
                        warnings=warnings
                    ))
            except Exception as e:
                schemas.append(SchemaItem(
                    type="Error",
                    schema_type=SchemaType.MICRODATA,
                    content={"error": str(e)},
                    errors=[f"Error extracting microdata: {str(e)}"],
                    warnings=[]
                ))
        
        return schemas

    def _extract_microdata_item(self, element) -> Dict[str, Any]:
        """Extract microdata properties from element"""
        data = {}
        
        # Get itemtype
        if element.get('itemtype'):
            data['@type'] = element['itemtype']
        
        # Find all properties
        properties = element.find_all(attrs={'itemprop': True})
        
        for prop in properties:
            prop_name = prop.get('itemprop')
            if not prop_name:
                continue
                
            # Get property value
            if prop.name in ['meta']:
                value = prop.get('content', '')
            elif prop.name in ['a', 'link']:
                value = prop.get('href', '')
            elif prop.name in ['img']:
                value = prop.get('src', '')
            elif prop.name in ['time']:
                value = prop.get('datetime', prop.get_text(strip=True))
            else:
                value = prop.get_text(strip=True)
            
            # Handle nested items
            if prop.get('itemscope'):
                value = self._extract_microdata_item(prop)
            
            # Add to data
            if prop_name in data:
                if not isinstance(data[prop_name], list):
                    data[prop_name] = [data[prop_name]]
                data[prop_name].append(value)
            else:
                data[prop_name] = value
        
        return data

    def _validate_schema(self, data: Dict[str, Any], schema_type: str) -> Tuple[List[str], List[str]]:
        """Validate JSON-LD schema"""
        errors = []
        warnings = []
        
        # Basic validation rules
        if not data.get('@type'):
            warnings.append("Missing @type property")
        
        # Schema-specific validation
        if schema_type.lower() in ['article', 'blogposting', 'newsarticle']:
            if not data.get('headline'):
                errors.append("Missing required 'headline' property for Article schema")
            if not data.get('author'):
                warnings.append("Missing recommended 'author' property")
            if not data.get('datePublished'):
                warnings.append("Missing recommended 'datePublished' property")
                
        elif schema_type.lower() == 'product':
            if not data.get('name'):
                errors.append("Missing required 'name' property for Product schema")
            if not data.get('offers'):
                warnings.append("Missing recommended 'offers' property")
                
        elif schema_type.lower() == 'organization':
            if not data.get('name'):
                errors.append("Missing required 'name' property for Organization schema")
            if not data.get('url'):
                warnings.append("Missing recommended 'url' property")
                
        elif schema_type.lower() == 'person':
            if not data.get('name'):
                errors.append("Missing required 'name' property for Person schema")
                
        elif schema_type.lower() in ['event', 'musicEvent', 'sportsEvent']:
            if not data.get('name'):
                errors.append("Missing required 'name' property for Event schema")
            if not data.get('startDate'):
                errors.append("Missing required 'startDate' property for Event schema")
            if not data.get('location'):
                warnings.append("Missing recommended 'location' property")
        
        # Check for common issues
        if '@context' not in data:
            warnings.append("Missing @context property (recommended for JSON-LD)")
        
        return errors, warnings

    def _validate_microdata(self, data: Dict[str, Any], schema_type: str) -> Tuple[List[str], List[str]]:
        """Validate Microdata schema"""
        errors = []
        warnings = []
        
        # Similar validation as JSON-LD but adapted for microdata structure
        if schema_type.lower() in ['article', 'blogposting']:
            if not data.get('headline') and not data.get('name'):
                errors.append("Missing headline or name property")
                
        elif schema_type.lower() == 'product':
            if not data.get('name'):
                errors.append("Missing required 'name' property")
        
        return errors, warnings

    def process_html_content(self, html_content: str, url: str = "") -> ValidationResult:
        """Process HTML content and extract schemas"""
        start_time = time.time()
        
        try:
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Get page title if not provided
            page_title = ""
            if not url:
                title_tag = soup.find('title')
                page_title = title_tag.get_text(strip=True) if title_tag else "HTML Content"
            
            # Extract schemas
            all_schemas = []
            
            # Extract JSON-LD
            json_ld_schemas = self.extract_json_ld(soup)
            all_schemas.extend(json_ld_schemas)
            
            # Extract Microdata
            microdata_schemas = self.extract_microdata(soup)
            all_schemas.extend(microdata_schemas)
            
            # Calculate totals
            total_errors = sum(len(schema.errors) for schema in all_schemas)
            total_warnings = sum(len(schema.warnings) for schema in all_schemas)
            
            processing_time = time.time() - start_time
            
            return ValidationResult(
                success=True,
                schemas_found=all_schemas,
                total_schemas=len(all_schemas),
                total_errors=total_errors,
                total_warnings=total_warnings,
                page_title=page_title,
                url=url,
                processing_time=processing_time
            )
            
        except Exception as e:
            return ValidationResult(
                success=False,
                schemas_found=[],
                total_schemas=0,
                total_errors=1,
                total_warnings=0,
                page_title="Error",
                url=url,
                processing_time=time.time() - start_time
            )

    def validate_from_url(self, url: str) -> ValidationResult:
        """Validate schema markup from URL"""
        # Validate URL
        is_valid, processed_url = self.validate_url(url)
        if not is_valid:
            return ValidationResult(
                success=False,
                schemas_found=[],
                total_schemas=0,
                total_errors=1,
                total_warnings=0,
                page_title="Invalid URL",
                url=url,
                processing_time=0.0
            )
        
        # Fetch content
        success, content, page_title = self.fetch_page_content(processed_url)
        if not success:
            return ValidationResult(
                success=False,
                schemas_found=[],
                total_schemas=0,
                total_errors=1,
                total_warnings=0,
                page_title="Fetch Error",
                url=processed_url,
                processing_time=0.0
            )
        
        # Process content
        result = self.process_html_content(content, processed_url)
        result.page_title = page_title
        result.url = processed_url
        
        return result

    def generate_report(self, result: ValidationResult, format_type: str = 'text') -> str:
        """Generate validation report"""
        if format_type == 'json':
            # Convert to JSON-serializable format
            report_data = {
                'success': result.success,
                'url': result.url,
                'page_title': result.page_title,
                'total_schemas': result.total_schemas,
                'total_errors': result.total_errors,
                'total_warnings': result.total_warnings,
                'processing_time': result.processing_time,
                'schemas': []
            }
            
            for schema in result.schemas_found:
                schema_data = {
                    'type': schema.type,
                    'schema_type': schema.schema_type.value,
                    'content': schema.content,
                    'errors': schema.errors,
                    'warnings': schema.warnings
                }
                report_data['schemas'].append(schema_data)
            
            return json.dumps(report_data, indent=2)
        
        else:  # text format
            lines = []
            lines.append("=" * 60)
            lines.append("SCHEMA MARKUP VALIDATION REPORT")
            lines.append("=" * 60)
            lines.append(f"URL: {result.url}")
            lines.append(f"Page Title: {result.page_title}")
            lines.append(f"Processing Time: {result.processing_time:.2f}s")
            lines.append("")
            lines.append("SUMMARY:")
            lines.append(f"• Total Schemas Found: {result.total_schemas}")
            lines.append(f"• Total Errors: {result.total_errors}")
            lines.append(f"• Total Warnings: {result.total_warnings}")
            lines.append(f"• Validation Status: {'PASS' if result.total_errors == 0 else 'FAIL'}")
            lines.append("")
            
            if result.schemas_found:
                lines.append("SCHEMAS DETECTED:")
                lines.append("-" * 40)
                
                for i, schema in enumerate(result.schemas_found, 1):
                    lines.append(f"\n{i}. {schema.type} ({schema.schema_type.value})")
                    
                    if schema.errors:
                        lines.append("   ERRORS:")
                        for error in schema.errors:
                            lines.append(f"   ❌ {error}")
                    
                    if schema.warnings:
                        lines.append("   WARNINGS:")
                        for warning in schema.warnings:
                            lines.append(f"   ⚠️  {warning}")
                    
                    if not schema.errors and not schema.warnings:
                        lines.append("   ✅ Valid schema markup")
                    
                    # Show schema content (truncated)
                    lines.append("   CONTENT:")
                    content_str = json.dumps(schema.content, indent=4)
                    if len(content_str) > 500:
                        content_str = content_str[:500] + "..."
                    lines.append("   " + content_str.replace("\n", "\n   "))
            else:
                lines.append("No schema markup found on this page.")
            
            lines.append("\n" + "=" * 60)
            lines.append("Report generated by Schema Markup Tester")
            lines.append("=" * 60)
            
            return "\n".join(lines)


def test_schema_validator():
    """Test the schema validator"""
    tester = SchemaMarkupTester()
    
    # Test with a few URLs
    test_urls = [
        "https://schema.org/Recipe",
        "https://developers.google.com/search/docs/data-types/article",
        "https://jsonld.com/product/"
    ]
    
    for url in test_urls:
        print(f"Testing: {url}")
        result = tester.validate_from_url(url)
        print(f"Success: {result.success}")
        print(f"Schemas: {result.total_schemas}")
        print(f"Errors: {result.total_errors}")
        print(f"Warnings: {result.total_warnings}")
        print("-" * 40)


if __name__ == "__main__":
    test_schema_validator()