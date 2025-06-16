#!/usr/bin/env python3
"""
Smart PDF Password Cracker - Intelligently balances password cracking with content preservation
"""

import sys
import json
import base64
import tempfile
import os
import time
from typing import Dict, Any, Optional, Tuple

try:
    import PyPDF2
    import pikepdf
    import fitz  # PyMuPDF
except ImportError as e:
    print(json.dumps({"success": False, "message": f"Missing dependency: {e}"}))
    sys.exit(1)

class SmartPDFCracker:
    def __init__(self):
        self.temp_dir = tempfile.mkdtemp()
        
    def __del__(self):
        """Cleanup temporary directory"""
        try:
            import shutil
            if hasattr(self, 'temp_dir') and os.path.exists(self.temp_dir):
                shutil.rmtree(self.temp_dir)
        except:
            pass

    def analyze_pdf_encryption(self, pdf_path: str) -> Dict[str, Any]:
        """Analyze PDF encryption strength and choose optimal approach"""
        analysis = {
            "encryption_type": "unknown",
            "security_level": "unknown",
            "recommended_method": "conservative",
            "is_protected": False
        }
        
        # Check with pikepdf first (most reliable for encryption detection)
        try:
            with pikepdf.open(pdf_path) as pdf:
                analysis["is_protected"] = False
                analysis["security_level"] = "none"
                analysis["recommended_method"] = "direct"
                return analysis
        except pikepdf.PasswordError:
            analysis["is_protected"] = True
        except Exception:
            pass
            
        # Check encryption strength with PyMuPDF
        try:
            doc = fitz.open(pdf_path)
            if doc.needs_pass:
                analysis["is_protected"] = True
                
                # Get security info
                if hasattr(doc, 'metadata'):
                    metadata = doc.metadata
                    if 'encryption' in str(metadata).lower():
                        analysis["encryption_type"] = "standard"
                    
                # Check document complexity for method selection
                try:
                    page_count = len(doc)
                    if page_count > 50:
                        analysis["security_level"] = "high"
                        analysis["recommended_method"] = "aggressive"
                    elif page_count > 10:
                        analysis["security_level"] = "medium"
                        analysis["recommended_method"] = "balanced"
                    else:
                        analysis["security_level"] = "low"
                        analysis["recommended_method"] = "conservative"
                except:
                    analysis["recommended_method"] = "conservative"
            doc.close()
        except Exception:
            pass
            
        return analysis

    def get_comprehensive_passwords(self) -> list:
        """Get comprehensive password list optimized for success rate"""
        return [
            "", "123456", "password", "admin", "user", "test", "demo",
            "123", "1234", "12345", "123456789", "qwerty", "abc123", "password123",
            "admin123", "root", "guest", "default", "pass", "pwd", "login",
            "secret", "welcome", "master", "owner", "unlock", "open", "free",
            "document", "file", "pdf", "secure", "protected", "private",
            "confidential", "restricted", "access", "enter", "key", "code",
            "temp", "temporary", "draft", "copy", "backup", "archive",
            "sample", "example", "template", "original", "final", "version",
            "public", "shared", "common", "simple", "easy", "quick", "fast",
            "new", "old", "current", "latest", "updated", "modified", "revised",
            "a", "1", "12", "abc", "aaa", "111", "000", "999", "password1",
            "Password", "PASSWORD", "Admin", "ADMIN", "User", "USER",
            "Test", "TEST", "Demo", "DEMO", "Root", "ROOT", "Guest", "GUEST",
            "123abc", "abc123", "admin1", "user1", "test1", "demo1",
            "password12", "admin12", "user12", "test12", "demo12"
        ]

    def conservative_crack(self, pdf_path: str) -> Optional[Tuple[str, bytes]]:
        """Conservative method prioritizing content preservation"""
        passwords = self.get_comprehensive_passwords()
        
        # Method 1: PyPDF2 with minimal processing
        for pwd in passwords:
            try:
                with open(pdf_path, 'rb') as file:
                    reader = PyPDF2.PdfReader(file)
                    if reader.decrypt(pwd):
                        # Create writer and copy content carefully
                        writer = PyPDF2.PdfWriter()
                        for page in reader.pages:
                            writer.add_page(page)
                        
                        # Write to bytes
                        output_path = os.path.join(self.temp_dir, f"conservative_{int(time.time())}.pdf")
                        with open(output_path, 'wb') as output_file:
                            writer.write(output_file)
                        
                        # Read back and verify
                        with open(output_path, 'rb') as verify_file:
                            content = verify_file.read()
                            if len(content) > 1000:  # Reasonable size check
                                return pwd, content
            except Exception:
                continue
                
        return None

    def balanced_crack(self, pdf_path: str) -> Optional[Tuple[str, bytes]]:
        """Balanced method with moderate content preservation"""
        passwords = self.get_comprehensive_passwords()
        
        # Method 1: pikepdf with careful handling
        for pwd in passwords:
            try:
                with pikepdf.open(pdf_path, password=pwd) as pdf:
                    output_path = os.path.join(self.temp_dir, f"balanced_{int(time.time())}.pdf")
                    pdf.save(output_path)
                    
                    # Verify content
                    with open(output_path, 'rb') as verify_file:
                        content = verify_file.read()
                        if len(content) > 1000:
                            return pwd, content
            except Exception:
                continue
                
        # Method 2: PyMuPDF with content verification
        for pwd in passwords:
            try:
                doc = fitz.open(pdf_path)
                if doc.authenticate(pwd):
                    output_path = os.path.join(self.temp_dir, f"balanced_fitz_{int(time.time())}.pdf")
                    doc.save(output_path)
                    doc.close()
                    
                    # Verify content
                    with open(output_path, 'rb') as verify_file:
                        content = verify_file.read()
                        if len(content) > 1000:
                            return pwd, content
                doc.close()
            except Exception:
                continue
                
        return None

    def aggressive_crack(self, pdf_path: str) -> Optional[Tuple[str, bytes]]:
        """Aggressive method for strong passwords with content checks"""
        passwords = self.get_comprehensive_passwords()
        
        # Extended password list for aggressive mode
        extended_passwords = passwords + [
            # Common patterns
            "12345678", "87654321", "qwertyui", "asdfghjk",
            "zxcvbnm", "poiuytre", "lkjhgfds", "mnbvcxz",
            # Dates and years
            "2023", "2024", "2025", "2022", "2021", "2020",
            "01012023", "01012024", "12312023", "12312024",
            # Common words
            "letmein", "welcome1", "changeme", "iloveyou",
            "sunshine", "princess", "football", "baseball",
            "trustno1", "dragon", "monkey", "mustang"
        ]
        
        # Method 1: All libraries with verification
        for pwd in extended_passwords:
            # Try pikepdf first
            try:
                with pikepdf.open(pdf_path, password=pwd) as pdf:
                    output_path = os.path.join(self.temp_dir, f"aggressive_{int(time.time())}.pdf")
                    pdf.save(output_path)
                    
                    # Verify content integrity
                    with open(output_path, 'rb') as verify_file:
                        content = verify_file.read()
                        if len(content) > 1000:
                            # Double-check by trying to read it
                            try:
                                test_doc = fitz.open(output_path)
                                if len(test_doc) > 0:
                                    test_doc.close()
                                    return pwd, content
                                test_doc.close()
                            except:
                                pass
            except Exception:
                pass
                
            # Try PyMuPDF
            try:
                doc = fitz.open(pdf_path)
                if doc.authenticate(pwd):
                    output_path = os.path.join(self.temp_dir, f"aggressive_fitz_{int(time.time())}.pdf")
                    doc.save(output_path)
                    doc.close()
                    
                    # Verify content
                    with open(output_path, 'rb') as verify_file:
                        content = verify_file.read()
                        if len(content) > 1000:
                            return pwd, content
                doc.close()
            except Exception:
                continue
                
        return None

    def smart_crack(self, pdf_data: bytes) -> Dict[str, Any]:
        """Smart cracking with adaptive approach"""
        try:
            # Save to temporary file
            pdf_path = os.path.join(self.temp_dir, f"input_{int(time.time())}.pdf")
            with open(pdf_path, 'wb') as f:
                f.write(pdf_data)
            
            # Analyze encryption
            analysis = self.analyze_pdf_encryption(pdf_path)
            
            if not analysis["is_protected"]:
                # Not password protected
                return {
                    "success": True,
                    "message": "PDF is not password protected",
                    "output_data": base64.b64encode(pdf_data).decode(),
                    "method": "direct",
                    "password_found": "none"
                }
            
            # Choose method based on analysis
            method = analysis["recommended_method"]
            result = None
            
            if method == "conservative":
                print("Using conservative method for content preservation...", file=sys.stderr)
                result = self.conservative_crack(pdf_path)
            elif method == "balanced":
                print("Using balanced method...", file=sys.stderr)
                result = self.balanced_crack(pdf_path)
            elif method == "aggressive":
                print("Using aggressive method for strong encryption...", file=sys.stderr)
                result = self.aggressive_crack(pdf_path)
            
            # If primary method fails, try fallback
            if not result:
                print(f"Primary method ({method}) failed, trying fallbacks...", file=sys.stderr)
                
                # Try other methods as fallback
                if method != "conservative":
                    result = self.conservative_crack(pdf_path)
                if not result and method != "balanced":
                    result = self.balanced_crack(pdf_path)
                if not result and method != "aggressive":
                    result = self.aggressive_crack(pdf_path)
            
            if result:
                password_found, content = result
                return {
                    "success": True,
                    "message": f"Password successfully cracked using {method} method",
                    "output_data": base64.b64encode(content).decode(),
                    "method": method,
                    "password_found": password_found if password_found else "empty",
                    "analysis": analysis
                }
            else:
                return {
                    "success": False,
                    "message": "Unable to crack the password. The PDF may have a very strong or complex password.",
                    "method": method,
                    "analysis": analysis
                }
                
        except Exception as e:
            return {
                "success": False,
                "message": f"Error processing PDF: {str(e)}",
                "method": "error"
            }

def main():
    """Main function for command line usage"""
    try:
        # Read input from stdin
        input_data = sys.stdin.read()
        data = json.loads(input_data)
        pdf_data = base64.b64decode(data['pdf_data'])
        
        # Process with smart cracker
        cracker = SmartPDFCracker()
        result = cracker.smart_crack(pdf_data)
        
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({
            "success": False,
            "message": f"Error: {str(e)}"
        }))

if __name__ == "__main__":
    main()