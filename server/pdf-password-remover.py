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
        """Try common passwords and patterns with advanced brute force"""
        # Basic common passwords
        common_passwords = [
            "", "123456", "password", "123456789", "12345678", "12345", "1234567", "1234",
            "admin", "qwerty", "abc123", "Password", "123", "1234567890", "000000", "111111",
            "123123", "654321", "666666", "121212", "123321", "7777777", "101010", "999999",
            "qwertyuiop", "asdfghjkl", "zxcvbnm", "welcome", "monkey", "dragon", "master",
            "sunshine", "princess", "letmein", "trustno1", "starwars", "superman", "batman",
            "freedom", "computer", "michael", "login", "test", "guest", "user", "default"
        ]
        
        # Try basic passwords first
        for pwd in common_passwords:
            if self._test_password(input_path, pwd):
                return pwd
        
        # Advanced password patterns
        advanced_patterns = []
        
        # Date patterns (years, birth years, etc.)
        current_year = 2024
        for year in range(1950, current_year + 1):
            advanced_patterns.extend([
                str(year), f"01{year}", f"{year}01", f"1{year}", f"{year}1",
                f"12{year}", f"{year}12", f"31{year}", f"{year}31"
            ])
        
        # Common name + number combinations
        common_names = [
            "john", "mary", "michael", "sarah", "david", "lisa", "chris", "anna",
            "james", "jennifer", "robert", "linda", "william", "elizabeth", "richard",
            "maria", "charles", "susan", "joseph", "jessica", "thomas", "karen",
            "daniel", "nancy", "matthew", "betty", "anthony", "helen", "mark", "sandra"
        ]
        
        for name in common_names:
            for year in range(1950, 2025):
                advanced_patterns.extend([f"{name}{year}", f"{name.title()}{year}"])
            for num in range(0, 100):
                advanced_patterns.extend([f"{name}{num:02d}", f"{name.title()}{num:02d}"])
        
        # Company/organization patterns
        company_patterns = [
            "company", "corp", "inc", "ltd", "llc", "business", "office", "work",
            "team", "group", "department", "division", "branch", "project", "file",
            "document", "report", "data", "info", "secure", "private", "confidential"
        ]
        
        for word in company_patterns:
            for year in range(2000, 2025):
                advanced_patterns.extend([f"{word}{year}", f"{word.title()}{year}"])
            for num in range(1, 100):
                advanced_patterns.extend([f"{word}{num}", f"{word.title()}{num}"])
        
        # Extended numeric patterns
        for i in range(100, 100000, 111):  # Common patterns like 111, 222, etc.
            advanced_patterns.append(str(i))
        
        # Keyboard patterns
        keyboard_patterns = [
            "qwerty", "asdf", "zxcv", "1qaz", "2wsx", "3edc", "qaz123", "wsx234",
            "qwertyui", "asdfghjk", "zxcvbnm", "147258369", "159753", "741852963"
        ]
        
        for pattern in keyboard_patterns:
            advanced_patterns.extend([pattern, pattern.upper(), pattern.title()])
            for i in range(10):
                advanced_patterns.extend([f"{pattern}{i}", f"{i}{pattern}"])
        
        # Simple variations of common words with symbols
        base_words = ["password", "admin", "user", "test", "guest", "login", "secret", "key"]
        symbols = ["!", "@", "#", "$", "%", "^", "&", "*"]
        
        for word in base_words:
            # Add variations with symbols
            for symbol in symbols:
                advanced_patterns.extend([f"{word}{symbol}", f"{symbol}{word}"])
            # Add variations with numbers
            for i in range(100):
                advanced_patterns.extend([
                    f"{word}{i}", f"{word}0{i}", f"{i}{word}", f"{word}{i:02d}",
                    f"{word.title()}{i}", f"{word.upper()}{i}"
                ])
        
        # Phone number patterns (expanded)
        area_codes = ["123", "555", "000", "111", "999", "201", "212", "310", "415", "650"]
        for area in area_codes:
            for exchange in ["123", "456", "789", "000", "111", "555"]:
                for number in ["1234", "5678", "9999", "0000", "1111"]:
                    advanced_patterns.extend([
                        f"{area}{exchange}{number}",
                        f"{area}-{exchange}-{number}",
                        f"({area}){exchange}{number}"
                    ])
        
        # Birthday patterns (MMDD, DDMM, MMDDYY, DDMMYY)
        for month in range(1, 13):
            for day in range(1, 32):
                if day <= 28 or (month in [1,3,5,7,8,10,12] and day <= 31) or (month in [4,6,9,11] and day <= 30):
                    mm = f"{month:02d}"
                    dd = f"{day:02d}"
                    advanced_patterns.extend([
                        f"{mm}{dd}", f"{dd}{mm}",
                        f"{mm}/{dd}", f"{dd}/{mm}",
                        f"{mm}-{dd}", f"{dd}-{mm}"
                    ])
                    # Add year combinations
                    for year in range(50, 25, -1):  # 1950-2024 as 2-digit
                        advanced_patterns.extend([
                            f"{mm}{dd}{year:02d}", f"{dd}{mm}{year:02d}",
                            f"{mm}/{dd}/{year:02d}", f"{dd}/{mm}/{year:02d}"
                        ])
        
        # Social Security Number patterns (XXX-XX-XXXX)
        for area in range(1, 1000, 111):
            for group in range(1, 100, 11):
                for serial in range(1, 10000, 1111):
                    advanced_patterns.append(f"{area:03d}{group:02d}{serial:04d}")
        
        # License plate patterns
        for letter1 in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
            for letter2 in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
                for num in range(100, 1000, 111):
                    advanced_patterns.extend([
                        f"{letter1}{letter2}{num}",
                        f"{letter1}{letter2}-{num}",
                        f"{num}{letter1}{letter2}"
                    ])
        
        # Try advanced patterns in batches to avoid timeouts
        batch_size = 1000
        total_batches = len(advanced_patterns) // batch_size + 1
        
        for batch_num in range(total_batches):
            start_idx = batch_num * batch_size
            end_idx = min((batch_num + 1) * batch_size, len(advanced_patterns))
            batch = advanced_patterns[start_idx:end_idx]
            
            for pwd in batch:
                if self._test_password(input_path, pwd):
                    return pwd
        
        # Word combinations
        word_list = ["the", "and", "for", "are", "but", "not", "you", "all", "can", "had", "her", "was", "one", "our", "out", "day", "get", "has", "him", "his", "how", "its", "may", "new", "now", "old", "see", "two", "way", "who", "boy", "did", "man", "men", "put", "say", "she", "too", "use"]
        
        for word1 in word_list[:20]:  # Limit to prevent timeout
            for word2 in word_list[:20]:
                if word1 != word2:
                    combinations = [
                        f"{word1}{word2}", f"{word1.title()}{word2}",
                        f"{word1}{word2.title()}", f"{word1.title()}{word2.title()}",
                        f"{word1}_{word2}", f"{word1}-{word2}"
                    ]
                    for combo in combinations:
                        if self._test_password(input_path, combo):
                            return combo
                        # Add numbers to combinations
                        for num in range(10):
                            test_passwords = [f"{combo}{num}", f"{num}{combo}"]
                            for test_pwd in test_passwords:
                                if self._test_password(input_path, test_pwd):
                                    return test_pwd
        
        # Try advanced patterns (limited to prevent timeout)
        for i, pwd in enumerate(advanced_patterns[:5000]):  # Limit to 5000 attempts
            if self._test_password(input_path, pwd):
                return pwd
        
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
                print(json.dumps({
                    "success": False,
                    "error": f"Processing failed: {str(e)}"
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