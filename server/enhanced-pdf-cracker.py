#!/usr/bin/env python3
"""
Enhanced PDF Password Cracker - Maximum strength approach
Combines all possible methods with extended dictionaries and advanced techniques
"""

import sys
import json
import base64
import tempfile
import os
import time
import logging
import string
import itertools
import hashlib
from typing import Dict, Any, Optional, List, Iterator

try:
    import pikepdf
    import PyPDF2
    import fitz  # PyMuPDF
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import letter
    import io
except ImportError as e:
    print(json.dumps({"success": False, "message": f"Missing dependency: {e}"}))
    sys.exit(1)

# Disable logging
logging.getLogger().setLevel(logging.CRITICAL)

class EnhancedPDFCracker:
    def __init__(self):
        self.max_time = 90  # Extended to 90 seconds
        self.start_time = time.time()
        self.passwords_tried = 0
        
    def _is_time_up(self) -> bool:
        """Check if we've exceeded the time limit"""
        return (time.time() - self.start_time) > self.max_time
        
    def _generate_comprehensive_passwords(self) -> Iterator[str]:
        """Generate the most comprehensive password list possible"""
        
        # Priority passwords - most common first
        priority_passwords = [
            "", "123456", "password", "123456789", "12345678", "12345", "1234567", "1234567890",
            "qwerty", "abc123", "111111", "dragon", "123123", "baseball", "iloveyou", "trustno1",
            "1234", "sunshine", "master", "123321", "letmein", "welcome", "monkey", "login",
            "admin", "princess", "qwertyuiop", "solo", "passw0rd", "starwars"
        ]
        
        # PDF specific passwords
        pdf_passwords = [
            "pdf", "document", "file", "secure", "protected", "private", "confidential",
            "restricted", "access", "enter", "key", "code", "unlock", "open", "free",
            "temp", "temporary", "draft", "copy", "backup", "archive", "sample", "example",
            "data", "info", "report", "download", "public", "shared", "common", "basic",
            "test", "demo", "guest", "user", "owner", "default", "secret"
        ]
        
        # Business/office passwords
        business_passwords = [
            "company", "business", "office", "work", "corporate", "internal", "official",
            "finance", "meeting", "board", "executive", "manager", "director", "ceo",
            "invoice", "contract", "proposal", "presentation", "confidential"
        ]
        
        # Yield priority passwords first
        for pwd in priority_passwords:
            if self._is_time_up():
                return
            yield pwd
            self.passwords_tried += 1
            
        for pwd in pdf_passwords:
            if self._is_time_up():
                return
            yield pwd
            self.passwords_tried += 1
            
        for pwd in business_passwords:
            if self._is_time_up():
                return
            yield pwd
            self.passwords_tried += 1
            
        # Date patterns - extensive
        current_year = 2024
        for year in range(current_year, current_year - 20, -1):
            if self._is_time_up():
                return
            # Full dates
            yield str(year)
            yield f"01/01/{year}"
            yield f"12/31/{year}"
            yield f"01012024"
            yield f"12312024"
            yield f"010124"
            yield f"123124"
            yield f"{year}0101"
            yield f"{year}1231"
            self.passwords_tried += 8
            
        # Number patterns - extensive range
        for i in range(10000):
            if self._is_time_up():
                return
            yield f"{i:04d}"
            if i < 1000:
                yield f"{i:03d}"
                yield f"{i:02d}"
                yield str(i)
            self.passwords_tried += 1
            
        # Common word + number combinations
        common_bases = priority_passwords[:15] + pdf_passwords[:10]
        for base in common_bases:
            if self._is_time_up():
                return
            for num in range(100):
                yield f"{base}{num}"
                yield f"{num}{base}"
                self.passwords_tried += 2
                
        # Letter combinations - systematic approach
        for length in range(1, 6):
            if self._is_time_up():
                return
            for combo in itertools.product(string.ascii_lowercase, repeat=length):
                if self._is_time_up():
                    return
                password = ''.join(combo)
                yield password
                yield password.upper()
                yield password.capitalize()
                self.passwords_tried += 3
                
        # Mixed character patterns
        for base in priority_passwords[:10]:
            if self._is_time_up():
                return
            for suffix in ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", ".", ","]:
                yield f"{base}{suffix}"
                yield f"{suffix}{base}"
                self.passwords_tried += 2
                
    def _test_password_fast(self, pdf_path: str, password: str) -> bool:
        """Fast password testing using pikepdf"""
        try:
            with pikepdf.open(pdf_path, password=password):
                return True
        except (pikepdf.PasswordError, pikepdf.PdfError):
            return False
        except Exception:
            return False
            
    def _crack_with_pikepdf(self, pdf_path: str) -> Optional[bytes]:
        """Enhanced pikepdf cracking with fast testing"""
        
        for password in self._generate_comprehensive_passwords():
            if self._is_time_up():
                break
                
            if self._test_password_fast(pdf_path, password):
                try:
                    with pikepdf.open(pdf_path, password=password) as pdf:
                        if len(pdf.pages) > 0:
                            output_path = pdf_path + "_pikepdf_unlocked.pdf"
                            pdf.save(output_path)
                            
                            with open(output_path, 'rb') as f:
                                unlocked_data = f.read()
                            
                            if os.path.exists(output_path):
                                os.unlink(output_path)
                            
                            if len(unlocked_data) > 500:
                                return unlocked_data
                                
                except Exception:
                    continue
                    
        return None
        
    def _crack_with_pypdf2(self, pdf_path: str) -> Optional[bytes]:
        """Enhanced PyPDF2 cracking"""
        
        for password in self._generate_comprehensive_passwords():
            if self._is_time_up():
                break
                
            try:
                with open(pdf_path, 'rb') as file:
                    reader = PyPDF2.PdfReader(file)
                    
                    if reader.decrypt(password):
                        writer = PyPDF2.PdfWriter()
                        
                        # Copy all pages
                        for page_num in range(len(reader.pages)):
                            try:
                                page = reader.pages[page_num]
                                writer.add_page(page)
                            except:
                                continue
                        
                        # Write to bytes
                        output_buffer = io.BytesIO()
                        writer.write(output_buffer)
                        unlocked_data = output_buffer.getvalue()
                        
                        if len(unlocked_data) > 500:
                            return unlocked_data
                            
            except Exception:
                continue
                
        return None
        
    def _crack_with_pymupdf(self, pdf_path: str) -> Optional[bytes]:
        """Enhanced PyMuPDF cracking"""
        
        for password in self._generate_comprehensive_passwords():
            if self._is_time_up():
                break
                
            try:
                doc = fitz.open(pdf_path)
                
                if doc.authenticate(password):
                    # Create new document
                    new_doc = fitz.open()
                    new_doc.insert_pdf(doc)
                    
                    # Save to bytes
                    output_path = pdf_path + "_mupdf_unlocked.pdf"
                    new_doc.save(output_path)
                    new_doc.close()
                    doc.close()
                    
                    with open(output_path, 'rb') as f:
                        unlocked_data = f.read()
                    
                    if os.path.exists(output_path):
                        os.unlink(output_path)
                    
                    if len(unlocked_data) > 500:
                        return unlocked_data
                        
                doc.close()
            except Exception:
                continue
                
        return None
        
    def _force_content_extraction(self, pdf_path: str) -> Optional[bytes]:
        """Force content extraction and rebuild"""
        
        # Try with known weak passwords first
        weak_passwords = ["", "123", "password", "admin", "user"]
        
        for password in weak_passwords:
            try:
                doc = fitz.open(pdf_path)
                if doc.authenticate(password):
                    
                    # Extract all content
                    pages_content = []
                    for page_num in range(doc.page_count):
                        try:
                            page = doc[page_num]
                            text = page.get_text()
                            pages_content.append({'text': text, 'page_num': page_num})
                        except:
                            pages_content.append({'text': '', 'page_num': page_num})
                    
                    doc.close()
                    
                    # Rebuild PDF
                    if pages_content:
                        return self._rebuild_pdf_simple(pages_content)
                        
                doc.close()
                
            except Exception:
                continue
                
        return None
        
    def _rebuild_pdf_simple(self, pages_content: List[Dict]) -> Optional[bytes]:
        """Simple PDF rebuild from text content"""
        
        try:
            buffer = io.BytesIO()
            c = canvas.Canvas(buffer, pagesize=letter)
            
            for page_data in pages_content:
                text = page_data.get('text', '').strip()
                
                if text:
                    # Split text into manageable lines
                    lines = text.split('\n')
                    y_position = 750
                    
                    for line in lines[:40]:  # Max 40 lines per page
                        if y_position > 50 and line.strip():
                            try:
                                # Clean the line for PDF compatibility
                                clean_line = ''.join(char if ord(char) < 128 else '?' for char in line[:75])
                                c.drawString(50, y_position, clean_line)
                                y_position -= 18
                            except:
                                continue
                        else:
                            break
                
                c.showPage()
            
            c.save()
            result = buffer.getvalue()
            return result if len(result) > 500 else None
            
        except Exception:
            return None
            
    def process_pdf(self, pdf_data: bytes) -> Dict[str, Any]:
        """Enhanced main processing function"""
        
        self.start_time = time.time()
        self.passwords_tried = 0
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            temp_file.write(pdf_data)
            pdf_path = temp_file.name
        
        try:
            # Quick check if PDF is already unlocked
            try:
                with pikepdf.open(pdf_path) as pdf:
                    return {
                        "success": True,
                        "message": "PDF is not password protected",
                        "output_data": base64.b64encode(pdf_data).decode(),
                        "method": "no_encryption",
                        "passwords_tried": 0
                    }
            except pikepdf.PasswordError:
                pass
            
            # Method 1: Enhanced pikepdf attack
            result = self._crack_with_pikepdf(pdf_path)
            if result:
                return {
                    "success": True,
                    "message": f"Password cracked using enhanced pikepdf method after {self.passwords_tried} attempts",
                    "output_data": base64.b64encode(result).decode(),
                    "method": "enhanced_pikepdf",
                    "passwords_tried": self.passwords_tried
                }
            
            # Reset password counter for next method
            self.passwords_tried = 0
            
            # Method 2: Enhanced PyPDF2 attack
            if not self._is_time_up():
                result = self._crack_with_pypdf2(pdf_path)
                if result:
                    return {
                        "success": True,
                        "message": f"Password cracked using enhanced PyPDF2 method after {self.passwords_tried} attempts",
                        "output_data": base64.b64encode(result).decode(),
                        "method": "enhanced_pypdf2",
                        "passwords_tried": self.passwords_tried
                    }
            
            # Method 3: Enhanced PyMuPDF attack
            if not self._is_time_up():
                result = self._crack_with_pymupdf(pdf_path)
                if result:
                    return {
                        "success": True,
                        "message": f"Password cracked using enhanced PyMuPDF method after {self.passwords_tried} attempts",
                        "output_data": base64.b64encode(result).decode(),
                        "method": "enhanced_pymupdf",
                        "passwords_tried": self.passwords_tried
                    }
            
            # Method 4: Force content extraction
            if not self._is_time_up():
                result = self._force_content_extraction(pdf_path)
                if result:
                    return {
                        "success": True,
                        "message": "PDF content extracted and rebuilt successfully",
                        "output_data": base64.b64encode(result).decode(),
                        "method": "force_extraction",
                        "passwords_tried": self.passwords_tried
                    }
            
            return {
                "success": False,
                "message": f"Unable to crack the password after trying {self.passwords_tried} combinations across all methods. The PDF uses very strong encryption or an unusual password pattern.",
                "passwords_tried": self.passwords_tried
            }
            
        except Exception as e:
            return {
                "success": False,
                "message": f"Error processing PDF: {str(e)}",
                "passwords_tried": self.passwords_tried
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
        
        # Process with enhanced PDF cracker
        cracker = EnhancedPDFCracker()
        result = cracker.process_pdf(pdf_data)
        
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({
            "success": False,
            "message": f"Error: {str(e)}",
            "passwords_tried": 0
        }))

if __name__ == "__main__":
    main()