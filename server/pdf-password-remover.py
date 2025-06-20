#!/usr/bin/env python3
"""
PDF Password Remover Tool - Remove password protection from PDF files
Advanced functionality with multiple libraries for maximum compatibility
"""

import sys
import json
import os
import time
import tempfile
import shutil
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
import base64

# PDF processing libraries
try:
    import pikepdf
    PIKEPDF_AVAILABLE = True
except ImportError:
    PIKEPDF_AVAILABLE = False

try:
    import PyPDF2
    PYPDF2_AVAILABLE = True
except ImportError:
    PYPDF2_AVAILABLE = False

try:
    import fitz  # PyMuPDF
    PYMUPDF_AVAILABLE = True
except ImportError:
    PYMUPDF_AVAILABLE = False

try:
    import pdfplumber
    PDFPLUMBER_AVAILABLE = True
except ImportError:
    PDFPLUMBER_AVAILABLE = False


class PDFPasswordRemover:
    """Advanced PDF password removal with multiple backend support"""
    
    def __init__(self):
        self.temp_dir = tempfile.mkdtemp(prefix="pdf_unlock_")
        self.supported_methods = []
        
        if PIKEPDF_AVAILABLE:
            self.supported_methods.append("pikepdf")
        if PYPDF2_AVAILABLE:
            self.supported_methods.append("pypdf2")
        if PYMUPDF_AVAILABLE:
            self.supported_methods.append("pymupdf")
        if PDFPLUMBER_AVAILABLE:
            self.supported_methods.append("pdfplumber")
    
    def __del__(self):
        """Cleanup temporary directory"""
        if hasattr(self, 'temp_dir') and os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir, ignore_errors=True)
    
    def analyze_pdf_security(self, pdf_path: str) -> Dict[str, Any]:
        """Analyze PDF security settings and encryption"""
        security_info = {
            "is_encrypted": False,
            "has_user_password": False,
            "has_owner_password": False,
            "encryption_type": None,
            "permissions": [],
            "restricted_permissions": [],
            "pdf_version": None,
            "analysis_method": None
        }
        
        # Try pikepdf first (most reliable)
        if PIKEPDF_AVAILABLE:
            try:
                with pikepdf.open(pdf_path) as pdf:
                    security_info["analysis_method"] = "pikepdf"
                    security_info["is_encrypted"] = pdf.is_encrypted
                    
                    if hasattr(pdf, 'encryption'):
                        enc = pdf.encryption
                        if enc:
                            security_info["encryption_type"] = str(enc.encryption_type) if hasattr(enc, 'encryption_type') else "Unknown"
                    
                    # Check permissions
                    if hasattr(pdf, 'allow'):
                        allow = pdf.allow
                        permissions = []
                        restricted = []
                        
                        perm_checks = {
                            "print": getattr(allow, 'print', None),
                            "modify": getattr(allow, 'modify', None),
                            "extract": getattr(allow, 'extract', None),
                            "annotate": getattr(allow, 'annotate', None),
                            "form": getattr(allow, 'form', None),
                            "accessibility": getattr(allow, 'accessibility', None),
                            "assemble": getattr(allow, 'assemble', None),
                            "print_highres": getattr(allow, 'print_highres', None),
                        }
                        
                        for perm, allowed in perm_checks.items():
                            if allowed is not None:
                                if allowed:
                                    permissions.append(perm)
                                else:
                                    restricted.append(perm)
                        
                        security_info["permissions"] = permissions
                        security_info["restricted_permissions"] = restricted
                    
                    return security_info
                    
            except pikepdf.PasswordError:
                security_info["is_encrypted"] = True
                security_info["has_user_password"] = True
                security_info["analysis_method"] = "pikepdf"
            except Exception as e:
                pass
        
        # Fallback to PyPDF2
        if PYPDF2_AVAILABLE:
            try:
                with open(pdf_path, 'rb') as file:
                    reader = PyPDF2.PdfReader(file)
                    security_info["analysis_method"] = "pypdf2"
                    security_info["is_encrypted"] = reader.is_encrypted
                    
                    if hasattr(reader, 'metadata') and reader.metadata:
                        security_info["pdf_version"] = str(reader.metadata.get('/Producer', ''))
                    
                    return security_info
                    
            except Exception as e:
                pass
        
        # Final fallback to PyMuPDF
        if PYMUPDF_AVAILABLE:
            try:
                doc = fitz.open(pdf_path)
                security_info["analysis_method"] = "pymupdf"
                security_info["is_encrypted"] = doc.needs_pass
                security_info["pdf_version"] = doc.pdf_version()
                doc.close()
                return security_info
            except Exception as e:
                pass
        
        return security_info
    
    def try_common_passwords(self, input_path: str) -> Optional[str]:
        """Advanced password cracking with comprehensive dictionary and intelligent patterns"""
        passwords_to_try = []
        
        # Core common passwords
        base_passwords = [
            "", "123456", "password", "123456789", "12345678", "12345", "1234567", "1234",
            "admin", "qwerty", "abc123", "Password", "123", "1234567890", "000000", "111111",
            "welcome", "login", "test", "guest", "user", "default", "master", "secret",
            "letmein", "trustno1", "dragon", "monkey", "sunshine", "princess", "starwars",
            "freedom", "computer", "michael", "superman", "batman", "welcome1", "passw0rd"
        ]
        passwords_to_try.extend(base_passwords)
        
        # Advanced year patterns (1950-2030)
        for year in range(1950, 2031):
            passwords_to_try.extend([
                str(year), f"0{year}", f"{year}0", f"1{year}", f"{year}1",
                f"password{year}", f"admin{year}", f"test{year}"
            ])
        
        # Date patterns (MMDD, DDMM, MMDDYY, DDMMYY)
        for month in range(1, 13):
            for day in [1, 15, 28]:  # Common days
                mm, dd = f"{month:02d}", f"{day:02d}"
                passwords_to_try.extend([
                    f"{mm}{dd}", f"{dd}{mm}", f"{mm}/{dd}", f"{dd}/{mm}",
                    f"{mm}{dd}20", f"{mm}{dd}21", f"{mm}{dd}22", f"{mm}{dd}23", f"{mm}{dd}24"
                ])
        
        # Common name + number combinations
        names = ["john", "mary", "mike", "sarah", "david", "lisa", "chris", "anna", "james", "linda"]
        for name in names:
            for i in range(100):
                if i < 10:
                    passwords_to_try.extend([f"{name}{i}", f"{name.title()}{i}", f"{name}{i:02d}"])
                if i < 25:
                    passwords_to_try.extend([f"{name}{1980+i}", f"{name.title()}{1980+i}"])
        
        # Phone number patterns
        area_codes = ["123", "555", "000", "111", "999", "201", "212", "310", "415", "650", "800"]
        for area in area_codes:
            for num in ["1234", "5678", "9999", "0000", "1111", "2222"]:
                passwords_to_try.extend([f"{area}{num}", f"{area}-{num}", f"({area}){num}"])
        
        # Keyboard patterns and sequences
        keyboard_patterns = [
            "qwerty", "asdf", "zxcv", "1qaz", "2wsx", "3edc", "qaz123", "wsx234",
            "qwertyui", "asdfghjk", "zxcvbnm", "147258369", "159753", "741852963",
            "abcd1234", "1234qwer", "qwer1234", "asdf1234"
        ]
        for pattern in keyboard_patterns:
            passwords_to_try.extend([pattern, pattern.upper(), pattern.title()])
            for i in range(10):
                passwords_to_try.extend([f"{pattern}{i}", f"{i}{pattern}"])
        
        # Company/business patterns
        business_words = ["company", "corp", "inc", "ltd", "business", "office", "work", "team", "project"]
        for word in business_words:
            for year in range(2000, 2025):
                passwords_to_try.extend([f"{word}{year}", f"{word.title()}{year}"])
            for i in range(100):
                passwords_to_try.extend([f"{word}{i}", f"{word.title()}{i}"])
        
        # Advanced character substitutions
        substitution_passwords = []
        for base in ["password", "admin", "secret", "welcome"]:
            # Common character substitutions
            substituted = base.replace('a', '@').replace('e', '3').replace('i', '1').replace('o', '0').replace('s', '$')
            substitution_passwords.extend([substituted, substituted.title(), substituted.upper()])
            
            # Add symbols and numbers
            for symbol in ["!", "@", "#", "$", "%", "^", "&", "*"]:
                substitution_passwords.extend([f"{base}{symbol}", f"{symbol}{base}", f"{base}{symbol}123"])
        
        passwords_to_try.extend(substitution_passwords)
        
        # Social Security Number patterns (simplified)
        for area in range(100, 1000, 50):
            for group in range(10, 100, 10):
                for serial in range(1000, 10000, 500):
                    passwords_to_try.append(f"{area:03d}{group:02d}{serial:04d}")
        
        # Credit card-like patterns
        for prefix in ["4", "5", "6"]:
            for i in range(10):
                passwords_to_try.extend([
                    f"{prefix}{''.join([str(j) for j in range(10)] * 2)[:15]}",
                    f"{prefix}123456789012345{i}"
                ])
        
        # Remove duplicates and test passwords
        unique_passwords = list(dict.fromkeys(passwords_to_try))
        
        # Quick test of highest probability passwords first
        priority_passwords = [
            "", "123456", "password", "123456789", "12345678", "12345", "qwerty", 
            "abc123", "111111", "admin", "password1", "123", "1234", "12345"
        ]
        
        print("Testing highest probability passwords...")
        for pwd in priority_passwords:
            if self._test_password(input_path, pwd):
                print(f"SUCCESS: Found password immediately: '{pwd}'")
                return pwd
        
        # Test optimized password list (limited to 2000 for speed)
        print(f"Testing {min(len(unique_passwords), 2000)} optimized passwords...")
        
        for i, pwd in enumerate(unique_passwords[:2000]):
            if i % 200 == 0:
                print(f"Progress: {i}/{min(len(unique_passwords), 2000)} passwords tested...")
            
            if self._test_password(input_path, pwd):
                print(f"SUCCESS: Password found after {i+1} attempts: '{pwd}'")
                return pwd
        
        # Quick brute force for very short passwords only
        print("Attempting quick brute force for 1-4 character passwords...")
        return self._quick_brute_force(input_path)
    
    def _quick_brute_force(self, input_path: str) -> Optional[str]:
        """Fast brute force for very short passwords only (1-4 characters)"""
        import string
        import itertools
        
        # Character sets for quick brute force
        digits = string.digits
        lowercase = string.ascii_lowercase
        
        # Only try very short passwords to save time
        for length in range(1, 5):  # 1-4 characters only
            print(f"Quick brute force length {length}...")
            
            # Try digits first (fastest)
            attempts = 0
            for password_tuple in itertools.product(digits, repeat=length):
                password = ''.join(password_tuple)
                attempts += 1
                
                if self._test_password(input_path, password):
                    print(f"QUICK BRUTE FORCE SUCCESS: Found password '{password}'")
                    return password
                
                # Limit attempts to prevent timeout
                if attempts > 500:
                    break
            
            # Try lowercase if digits failed and length is 3 or less
            if length <= 3:
                attempts = 0
                for password_tuple in itertools.product(lowercase, repeat=length):
                    password = ''.join(password_tuple)
                    attempts += 1
                    
                    if self._test_password(input_path, password):
                        print(f"QUICK BRUTE FORCE SUCCESS: Found password '{password}'")
                        return password
                    
                    # Limit attempts to prevent timeout
                    if attempts > 200:
                        break
        
        print("Password cracking failed - unable to find password within time limit.")
        return None
    
    def _test_password(self, input_path: str, password: str) -> bool:
        """Test if a password works for opening the PDF"""
        try:
            if PIKEPDF_AVAILABLE:
                try:
                    pdf = pikepdf.open(input_path, password=password)
                    pdf.close()
                    return True
                except:
                    pass
            
            if PYPDF2_AVAILABLE:
                try:
                    with open(input_path, 'rb') as file:
                        reader = PyPDF2.PdfReader(file)
                        if reader.is_encrypted:
                            return reader.decrypt(password)
                        return True
                except:
                    pass
            
            if PYMUPDF_AVAILABLE:
                try:
                    doc = fitz.open(input_path)
                    if doc.needs_pass:
                        result = doc.authenticate(password)
                        doc.close()
                        return result
                    doc.close()
                    return True
                except:
                    pass
            
            return False
        except:
            return False

    def remove_password_pikepdf(self, input_path: str, output_path: str, password: Optional[str] = None) -> Dict[str, Any]:
        """Remove password using pikepdf (most reliable method)"""
        if not PIKEPDF_AVAILABLE:
            return {"success": False, "error": "pikepdf library not available"}
        
        try:
            pdf = None
            used_password = None
            
            # Try provided password first
            if password:
                try:
                    pdf = pikepdf.open(input_path, password=password)
                    used_password = password
                except pikepdf.PasswordError:
                    pass
            
            # If no password provided or provided password failed, try common passwords
            if pdf is None:
                found_password = self.try_common_passwords(input_path)
                if found_password is not None:
                    try:
                        pdf = pikepdf.open(input_path, password=found_password)
                        used_password = found_password
                    except pikepdf.PasswordError:
                        pass
            
            # Final attempt without password (owner-only protection)
            if pdf is None:
                try:
                    pdf = pikepdf.open(input_path)
                    used_password = "owner-only"
                except pikepdf.PasswordError:
                    return {"success": False, "error": "Unable to unlock PDF - password required and common passwords failed"}
            
            # Save without encryption
            pdf.save(output_path)
            pdf.close()
            
            return {
                "success": True,
                "method": "pikepdf",
                "message": f"Password protection removed successfully using {'provided password' if used_password == password else 'discovered password' if used_password and used_password != 'owner-only' else 'owner-only bypass'}",
                "password_method": used_password
            }
            
        except Exception as e:
            return {"success": False, "error": f"pikepdf processing failed: {str(e)}"}
    
    def remove_password_pypdf2(self, input_path: str, output_path: str, password: Optional[str] = None) -> Dict[str, Any]:
        """Remove password using PyPDF2 with enhanced password cracking"""
        if not PYPDF2_AVAILABLE:
            return {"success": False, "error": "PyPDF2 library not available"}
        
        try:
            with open(input_path, 'rb') as input_file:
                reader = PyPDF2.PdfReader(input_file)
                used_password = None
                
                if reader.is_encrypted:
                    # Try provided password first
                    if password and reader.decrypt(password):
                        used_password = password
                    else:
                        # Try common passwords
                        found_password = self.try_common_passwords(input_path)
                        if found_password is not None and reader.decrypt(found_password):
                            used_password = found_password
                        else:
                            return {"success": False, "error": "Unable to unlock PDF - password required and common passwords failed"}
                
                writer = PyPDF2.PdfWriter()
                
                # Copy all pages
                for page_num in range(len(reader.pages)):
                    writer.add_page(reader.pages[page_num])
                
                # Save without encryption
                with open(output_path, 'wb') as output_file:
                    writer.write(output_file)
                
                return {
                    "success": True,
                    "method": "pypdf2",
                    "message": f"Password protection removed successfully using {'provided password' if used_password == password else 'discovered password' if used_password else 'no password required'}",
                    "password_method": used_password
                }
                
        except Exception as e:
            return {"success": False, "error": f"PyPDF2 processing failed: {str(e)}"}
    
    def remove_password_pymupdf(self, input_path: str, output_path: str, password: Optional[str] = None) -> Dict[str, Any]:
        """Remove password using PyMuPDF with enhanced password cracking"""
        if not PYMUPDF_AVAILABLE:
            return {"success": False, "error": "PyMuPDF library not available"}
        
        try:
            doc = fitz.open(input_path)
            used_password = None
            
            if doc.needs_pass:
                # Try provided password first
                if password and doc.authenticate(password):
                    used_password = password
                else:
                    # Try common passwords
                    found_password = self.try_common_passwords(input_path)
                    if found_password is not None and doc.authenticate(found_password):
                        used_password = found_password
                    else:
                        doc.close()
                        return {"success": False, "error": "Unable to unlock PDF - password required and common passwords failed"}
            
            # Save without encryption
            doc.save(output_path, encryption=fitz.PDF_ENCRYPT_NONE)
            doc.close()
            
            return {
                "success": True,
                "method": "pymupdf",
                "message": f"Password protection removed successfully using {'provided password' if used_password == password else 'discovered password' if used_password else 'no password required'}",
                "password_method": used_password
            }
            
        except Exception as e:
            return {"success": False, "error": f"PyMuPDF processing failed: {str(e)}"}
    
    def get_pdf_info(self, pdf_path: str) -> Dict[str, Any]:
        """Get comprehensive PDF information"""
        info = {
            "pages_count": 0,
            "file_size": 0,
            "pdf_version": None,
            "title": None,
            "author": None,
            "creator": None,
            "producer": None,
            "creation_date": None,
            "modification_date": None
        }
        
        try:
            info["file_size"] = os.path.getsize(pdf_path)
        except:
            pass
        
        # Try pikepdf first
        if PIKEPDF_AVAILABLE:
            try:
                with pikepdf.open(pdf_path) as pdf:
                    info["pages_count"] = len(pdf.pages)
                    
                    if hasattr(pdf, 'docinfo') and pdf.docinfo:
                        docinfo = pdf.docinfo
                        info["title"] = str(docinfo.get('/Title', '')) if '/Title' in docinfo else None
                        info["author"] = str(docinfo.get('/Author', '')) if '/Author' in docinfo else None
                        info["creator"] = str(docinfo.get('/Creator', '')) if '/Creator' in docinfo else None
                        info["producer"] = str(docinfo.get('/Producer', '')) if '/Producer' in docinfo else None
                    
                    return info
            except:
                pass
        
        # Fallback to PyMuPDF
        if PYMUPDF_AVAILABLE:
            try:
                doc = fitz.open(pdf_path)
                info["pages_count"] = doc.page_count
                info["pdf_version"] = doc.pdf_version()
                
                metadata = doc.metadata
                if metadata:
                    info["title"] = metadata.get("title")
                    info["author"] = metadata.get("author")
                    info["creator"] = metadata.get("creator")
                    info["producer"] = metadata.get("producer")
                
                doc.close()
                return info
            except:
                pass
        
        # Final fallback to PyPDF2
        if PYPDF2_AVAILABLE:
            try:
                with open(pdf_path, 'rb') as file:
                    reader = PyPDF2.PdfReader(file)
                    info["pages_count"] = len(reader.pages)
                    
                    if hasattr(reader, 'metadata') and reader.metadata:
                        metadata = reader.metadata
                        info["title"] = metadata.get('/Title')
                        info["author"] = metadata.get('/Author')
                        info["creator"] = metadata.get('/Creator')
                        info["producer"] = metadata.get('/Producer')
                
                return info
            except:
                pass
        
        return info
    
    def process_pdf(self, input_data: bytes, password: Optional[str] = None) -> Dict[str, Any]:
        """Main processing function for PDF password removal"""
        start_time = time.time()
        
        # Save input data to temporary file
        input_path = os.path.join(self.temp_dir, "input.pdf")
        output_path = os.path.join(self.temp_dir, "output_unlocked.pdf")
        
        try:
            with open(input_path, 'wb') as f:
                f.write(input_data)
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to save input file: {str(e)}"
            }
        
        # Analyze PDF security
        security_info = self.analyze_pdf_security(input_path)
        
        # Get PDF information
        pdf_info = self.get_pdf_info(input_path)
        
        # Try different methods to remove password
        removal_methods = [
            ("pikepdf", self.remove_password_pikepdf),
            ("pypdf2", self.remove_password_pypdf2),
            ("pymupdf", self.remove_password_pymupdf)
        ]
        
        last_error = None
        for method_name, method_func in removal_methods:
            if method_name == "pikepdf" and not PIKEPDF_AVAILABLE:
                continue
            if method_name == "pypdf2" and not PYPDF2_AVAILABLE:
                continue
            if method_name == "pymupdf" and not PYMUPDF_AVAILABLE:
                continue
            
            result = method_func(input_path, output_path, password)
            if result["success"]:
                # Verify output file exists and is valid
                if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
                    # Read output file
                    with open(output_path, 'rb') as f:
                        output_data = f.read()
                    
                    # Encode output data for JSON response
                    output_base64 = base64.b64encode(output_data).decode('utf-8')
                    
                    # Get output file info
                    output_info = self.get_pdf_info(output_path)
                    
                    processing_time = round(time.time() - start_time, 2)
                    
                    # Determine what security features were removed
                    permissions_removed = []
                    if security_info.get("restricted_permissions"):
                        permissions_removed = security_info["restricted_permissions"]
                    
                    return {
                        "success": True,
                        "output_data": output_base64,
                        "file_size_original": pdf_info.get("file_size", 0),
                        "file_size_output": len(output_data),
                        "pages_count": output_info.get("pages_count", pdf_info.get("pages_count", 0)),
                        "processing_time": processing_time,
                        "method_used": result["method"],
                        "security_info": {
                            "was_password_protected": security_info.get("is_encrypted", False),
                            "had_user_password": security_info.get("has_user_password", False),
                            "had_owner_password": security_info.get("has_owner_password", False),
                            "permissions_removed": permissions_removed,
                            "encryption_type": security_info.get("encryption_type"),
                            "analysis_method": security_info.get("analysis_method")
                        },
                        "message": f"Password protection successfully removed using {result['method']}"
                    }
                else:
                    last_error = f"{method_name}: Output file not generated properly"
            else:
                last_error = f"{method_name}: {result['error']}"
        
        # All methods failed
        processing_time = round(time.time() - start_time, 2)
        return {
            "success": False,
            "error": last_error or "All password removal methods failed",
            "processing_time": processing_time,
            "security_info": {
                "was_password_protected": security_info.get("is_encrypted", False),
                "analysis_method": security_info.get("analysis_method")
            },
            "available_methods": self.supported_methods
        }


def main():
    """Main function for command line usage"""
    try:
        # Check if we're receiving JSON input from stdin
        if not sys.stdin.isatty():
            # Read from stdin (API call)
            input_data = sys.stdin.read()
            try:
                data = json.loads(input_data)
                pdf_base64 = data.get('pdf_data', '')
                password = data.get('password', '')
                
                if not pdf_base64:
                    print(json.dumps({
                        "success": False,
                        "error": "No PDF data provided"
                    }))
                    return
                
                # Decode base64 PDF data
                pdf_bytes = base64.b64decode(pdf_base64)
                
                remover = PDFPasswordRemover()
                result = remover.process_pdf(pdf_bytes, password if password else None)
                print(json.dumps(result))
                return
                
            except json.JSONDecodeError:
                print(json.dumps({
                    "success": False,
                    "error": "Invalid JSON input"
                }))
                return
            except Exception as e:
                import traceback
                print(json.dumps({
                    "success": False,
                    "error": f"Processing failed: {str(e)}",
                    "traceback": traceback.format_exc()
                }))
                return
        
        # Command line usage
        if len(sys.argv) < 2:
            print(json.dumps({
                "success": False,
                "error": "Usage: python pdf-password-remover.py <input_file> [password]"
            }))
            return
        
        input_file = sys.argv[1]
        password = sys.argv[2] if len(sys.argv) > 2 else None
        
        if not os.path.exists(input_file):
            print(json.dumps({
                "success": False,
                "error": f"Input file not found: {input_file}"
            }))
            return
        
        try:
            with open(input_file, 'rb') as f:
                input_data = f.read()
            
            remover = PDFPasswordRemover()
            result = remover.process_pdf(input_data, password)
            
            if result["success"] and "output_data" in result:
                # Save output file
                output_file = input_file.replace('.pdf', '_unlocked.pdf')
                output_data = base64.b64decode(result["output_data"])
                
                with open(output_file, 'wb') as f:
                    f.write(output_data)
                
                result["output_file"] = output_file
                del result["output_data"]  # Remove base64 data from output
            
            print(json.dumps(result, indent=2))
            
        except Exception as e:
            print(json.dumps({
                "success": False,
                "error": f"Processing failed: {str(e)}"
            }))
            
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": f"Main execution failed: {str(e)}"
        }))


if __name__ == "__main__":
    main()