#!/usr/bin/env python3
"""
Advanced PDF Password Processor using pikepdf
pikepdf is the most powerful Python PDF library with excellent encryption handling
"""

import sys
import json
import base64
import tempfile
import os
import time
import logging
from typing import Dict, Any, Optional, List

try:
    import pikepdf
    import PyPDF2
    import fitz  # PyMuPDF as fallback
except ImportError as e:
    print(json.dumps({"success": False, "message": f"Missing dependency: {e}"}))
    sys.exit(1)

# Disable logging to avoid noise
logging.getLogger().setLevel(logging.CRITICAL)

class PikePDFProcessor:
    def __init__(self):
        self.comprehensive_passwords = self._generate_comprehensive_passwords()
        
    def _generate_comprehensive_passwords(self) -> List[str]:
        """Generate the most comprehensive password list possible"""
        
        # Base common passwords
        base_passwords = [
            "", "123456", "password", "admin", "user", "test", "demo", "guest",
            "123", "1234", "12345", "123456789", "qwerty", "abc123", "password123",
            "admin123", "root", "default", "pass", "pwd", "login", "secret",
            "welcome", "master", "owner", "unlock", "open", "free", "document",
            "file", "pdf", "secure", "protected", "private", "confidential",
            "restricted", "access", "enter", "key", "code", "temp", "temporary",
            "draft", "copy", "backup", "archive"
        ]
        
        # Numbers and dates
        number_passwords = [
            "0000", "1111", "2222", "3333", "4444", "5555", "6666", "7777", "8888", "9999",
            "0123", "1230", "2021", "2022", "2023", "2024", "2025",
            "01012024", "12312024", "01012023", "12312023"
        ]
        
        # Company/business related
        business_passwords = [
            "company", "business", "office", "work", "corporate", "internal",
            "official", "report", "finance", "data", "confidential", "private",
            "meeting", "board", "executive", "manager", "director", "ceo"
        ]
        
        # Combine all base passwords
        all_passwords = base_passwords + number_passwords + business_passwords
        
        # Generate variations
        variations = []
        for pwd in all_passwords[:30]:  # Top 30 passwords for variations
            if pwd:
                variations.extend([
                    pwd.upper(),
                    pwd.lower(),
                    pwd.capitalize(),
                    pwd + "1",
                    pwd + "12",
                    pwd + "123",
                    pwd + "2024",
                    pwd + "2023",
                    "1" + pwd,
                    pwd + "!",
                    pwd + "@",
                    pwd + "#",
                    pwd + "$",
                    pwd + ".",
                    pwd + "_"
                ])
        
        # Remove duplicates and return
        return list(dict.fromkeys(all_passwords + variations))

    def try_pikepdf_direct(self, pdf_path: str) -> Optional[bytes]:
        """Direct password cracking with pikepdf - most reliable method"""
        
        for password in self.comprehensive_passwords:
            try:
                # Try to open with pikepdf
                with pikepdf.open(pdf_path, password=password) as pdf:
                    # Verify we can access the content
                    if len(pdf.pages) > 0:
                        # Create a new unencrypted PDF
                        output_path = pdf_path + "_unlocked.pdf"
                        pdf.save(output_path)
                        
                        # Read the unlocked PDF
                        with open(output_path, 'rb') as f:
                            unlocked_data = f.read()
                        
                        # Clean up
                        if os.path.exists(output_path):
                            os.unlink(output_path)
                        
                        # Verify the unlocked PDF is valid and has content
                        if len(unlocked_data) > 1000:
                            return unlocked_data
                            
            except (pikepdf.PasswordError, pikepdf.PdfError):
                continue
            except Exception:
                continue
                
        return None

    def try_pikepdf_force_decrypt(self, pdf_path: str) -> Optional[bytes]:
        """Force decryption by copying content to new PDF"""
        
        for password in self.comprehensive_passwords:
            try:
                with pikepdf.open(pdf_path, password=password) as src_pdf:
                    # Create new PDF
                    new_pdf = pikepdf.new()
                    
                    # Copy all pages
                    for page in src_pdf.pages:
                        new_pdf.pages.append(page)
                    
                    # Copy metadata if available
                    try:
                        if src_pdf.docinfo:
                            new_pdf.docinfo = src_pdf.docinfo
                    except:
                        pass
                    
                    # Save to bytes
                    output_path = pdf_path + "_force_unlocked.pdf"
                    new_pdf.save(output_path)
                    
                    with open(output_path, 'rb') as f:
                        unlocked_data = f.read()
                    
                    # Clean up
                    if os.path.exists(output_path):
                        os.unlink(output_path)
                    
                    if len(unlocked_data) > 1000:
                        return unlocked_data
                        
            except Exception:
                continue
                
        return None

    def try_pypdf2_fallback(self, pdf_path: str) -> Optional[bytes]:
        """PyPDF2 fallback method"""
        
        for password in self.comprehensive_passwords:
            try:
                with open(pdf_path, 'rb') as file:
                    reader = PyPDF2.PdfReader(file)
                    
                    if reader.decrypt(password):
                        # Create writer and copy pages
                        writer = PyPDF2.PdfWriter()
                        
                        for page_num in range(len(reader.pages)):
                            page = reader.pages[page_num]
                            writer.add_page(page)
                        
                        # Write to bytes
                        from io import BytesIO
                        output_buffer = BytesIO()
                        writer.write(output_buffer)
                        unlocked_data = output_buffer.getvalue()
                        
                        if len(unlocked_data) > 1000:
                            return unlocked_data
                            
            except Exception:
                continue
                
        return None

    def try_pymupdf_fallback(self, pdf_path: str) -> Optional[bytes]:
        """PyMuPDF fallback method"""
        
        for password in self.comprehensive_passwords:
            try:
                doc = fitz.open(pdf_path)
                
                if doc.authenticate(password):
                    # Create new document
                    new_doc = fitz.open()
                    
                    # Copy all pages
                    new_doc.insert_pdf(doc)
                    
                    # Save to bytes
                    output_path = pdf_path + "_mupdf_unlocked.pdf"
                    new_doc.save(output_path)
                    new_doc.close()
                    doc.close()
                    
                    with open(output_path, 'rb') as f:
                        unlocked_data = f.read()
                    
                    # Clean up
                    if os.path.exists(output_path):
                        os.unlink(output_path)
                    
                    if len(unlocked_data) > 1000:
                        return unlocked_data
                        
                doc.close()
            except Exception:
                continue
                
        return None

    def analyze_pdf_encryption(self, pdf_path: str) -> Dict[str, Any]:
        """Analyze PDF encryption details"""
        analysis = {
            "is_encrypted": False,
            "encryption_method": "unknown",
            "security_handler": "unknown",
            "permissions": {},
            "can_try_crack": True
        }
        
        try:
            # Check with pikepdf first
            with pikepdf.open(pdf_path) as pdf:
                analysis["is_encrypted"] = False
                analysis["can_try_crack"] = False
                return analysis
        except pikepdf.PasswordError:
            analysis["is_encrypted"] = True
        except Exception:
            pass
        
        try:
            # Get more details if encrypted
            doc = fitz.open(pdf_path)
            if doc.needs_pass:
                analysis["is_encrypted"] = True
                analysis["encryption_method"] = "PDF encryption"
            doc.close()
        except Exception:
            pass
            
        return analysis

    def process_pdf(self, pdf_data: bytes) -> Dict[str, Any]:
        """Main processing function with comprehensive approach"""
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            temp_file.write(pdf_data)
            pdf_path = temp_file.name
        
        try:
            # Step 1: Analyze encryption
            analysis = self.analyze_pdf_encryption(pdf_path)
            
            if not analysis["is_encrypted"]:
                return {
                    "success": True,
                    "message": "PDF is not password protected",
                    "output_data": base64.b64encode(pdf_data).decode(),
                    "method": "no_encryption"
                }
            
            # Step 2: Try pikepdf direct method (most reliable)
            result = self.try_pikepdf_direct(pdf_path)
            if result:
                return {
                    "success": True,
                    "message": "Password successfully cracked using pikepdf direct method",
                    "output_data": base64.b64encode(result).decode(),
                    "method": "pikepdf_direct"
                }
            
            # Step 3: Try pikepdf force decryption
            result = self.try_pikepdf_force_decrypt(pdf_path)
            if result:
                return {
                    "success": True,
                    "message": "PDF unlocked using pikepdf force decryption",
                    "output_data": base64.b64encode(result).decode(),
                    "method": "pikepdf_force"
                }
            
            # Step 4: Try PyPDF2 fallback
            result = self.try_pypdf2_fallback(pdf_path)
            if result:
                return {
                    "success": True,
                    "message": "PDF unlocked using PyPDF2 fallback method",
                    "output_data": base64.b64encode(result).decode(),
                    "method": "pypdf2_fallback"
                }
            
            # Step 5: Try PyMuPDF fallback
            result = self.try_pymupdf_fallback(pdf_path)
            if result:
                return {
                    "success": True,
                    "message": "PDF unlocked using PyMuPDF fallback method",
                    "output_data": base64.b64encode(result).decode(),
                    "method": "pymupdf_fallback"
                }
            
            return {
                "success": False,
                "message": "Unable to crack the password using comprehensive methods. The PDF may have a very strong password or use advanced encryption."
            }
            
        except Exception as e:
            return {
                "success": False,
                "message": f"Error processing PDF: {str(e)}"
            }
        finally:
            # Clean up temp file
            try:
                if os.path.exists(pdf_path):
                    os.unlink(pdf_path)
            except:
                pass

def main():
    """Main function for command line usage"""
    try:
        # Read input from stdin
        input_data = sys.stdin.read()
        data = json.loads(input_data)
        pdf_data = base64.b64decode(data['pdf_data'])
        
        # Process with pikepdf processor
        processor = PikePDFProcessor()
        result = processor.process_pdf(pdf_data)
        
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({
            "success": False,
            "message": f"Error: {str(e)}"
        }))

if __name__ == "__main__":
    main()