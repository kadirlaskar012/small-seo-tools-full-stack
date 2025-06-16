#!/usr/bin/env python3
"""
Ultimate PDF Password Cracker - Most comprehensive approach
Combines multiple libraries, brute force, pattern matching, and content extraction
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

class UltimatePDFCracker:
    def __init__(self):
        self.max_time = 60  # 60 seconds total
        self.start_time = time.time()
        
    def _is_time_up(self) -> bool:
        """Check if we've exceeded the time limit"""
        return (time.time() - self.start_time) > self.max_time
        
    def _generate_smart_passwords(self) -> Iterator[str]:
        """Generate passwords using smart patterns and common combinations"""
        
        # Most common passwords first
        common_passwords = [
            "", "123456", "password", "admin", "user", "test", "demo", "guest",
            "123", "1234", "12345", "123456789", "qwerty", "abc123", "password123",
            "admin123", "root", "default", "pass", "pwd", "login", "secret",
            "welcome", "master", "owner", "unlock", "open", "free", "document",
            "file", "pdf", "secure", "protected", "private", "confidential",
            "restricted", "access", "enter", "key", "code", "temp", "temporary",
            "draft", "copy", "backup", "archive", "sample", "example", "data",
            "info", "report", "download", "public", "shared", "common", "basic"
        ]
        
        # Yield common passwords first
        for pwd in common_passwords:
            if self._is_time_up():
                return
            yield pwd
            
        # Date patterns
        current_year = 2024
        for year in range(current_year, current_year - 10, -1):
            if self._is_time_up():
                return
            yield str(year)
            yield f"01012024"
            yield f"12312024"
            yield f"010124"
            yield f"123124"
            
        # Number patterns
        for i in range(1000):
            if self._is_time_up():
                return
            yield f"{i:04d}"
            
        # Letter patterns
        for length in range(1, 5):
            if self._is_time_up():
                return
            for combo in itertools.product(string.ascii_lowercase, repeat=length):
                if self._is_time_up():
                    return
                yield ''.join(combo)
                
        # Mixed patterns
        for base in common_passwords[:20]:
            if self._is_time_up():
                return
            for suffix in ["1", "12", "123", "2024", "2023", "!", "@", "#", "$"]:
                yield base + suffix
                yield suffix + base
                
    def _try_pikepdf_direct(self, pdf_path: str) -> Optional[bytes]:
        """Try pikepdf with password iteration"""
        
        for password in self._generate_smart_passwords():
            if self._is_time_up():
                break
                
            try:
                with pikepdf.open(pdf_path, password=password) as pdf:
                    if len(pdf.pages) > 0:
                        output_path = pdf_path + "_pikepdf_unlocked.pdf"
                        pdf.save(output_path)
                        
                        with open(output_path, 'rb') as f:
                            unlocked_data = f.read()
                        
                        if os.path.exists(output_path):
                            os.unlink(output_path)
                        
                        if len(unlocked_data) > 1000:
                            return unlocked_data
                            
            except (pikepdf.PasswordError, pikepdf.PdfError):
                continue
            except Exception:
                continue
                
        return None
        
    def _try_pypdf2_aggressive(self, pdf_path: str) -> Optional[bytes]:
        """Aggressive PyPDF2 approach with content verification"""
        
        for password in self._generate_smart_passwords():
            if self._is_time_up():
                break
                
            try:
                with open(pdf_path, 'rb') as file:
                    reader = PyPDF2.PdfReader(file)
                    
                    if reader.decrypt(password):
                        writer = PyPDF2.PdfWriter()
                        
                        # Copy all pages with content verification
                        for page_num in range(len(reader.pages)):
                            page = reader.pages[page_num]
                            
                            # Try to extract text to verify page is readable
                            try:
                                text_content = page.extract_text()
                                writer.add_page(page)
                            except:
                                # If text extraction fails, still add the page
                                writer.add_page(page)
                        
                        # Write to bytes
                        output_buffer = io.BytesIO()
                        writer.write(output_buffer)
                        unlocked_data = output_buffer.getvalue()
                        
                        if len(unlocked_data) > 1000:
                            return unlocked_data
                            
            except Exception:
                continue
                
        return None
        
    def _try_pymupdf_aggressive(self, pdf_path: str) -> Optional[bytes]:
        """Aggressive PyMuPDF approach"""
        
        for password in self._generate_smart_passwords():
            if self._is_time_up():
                break
                
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
                    
                    if os.path.exists(output_path):
                        os.unlink(output_path)
                    
                    if len(unlocked_data) > 1000:
                        return unlocked_data
                        
                doc.close()
            except Exception:
                continue
                
        return None
        
    def _force_content_extraction(self, pdf_path: str) -> Optional[bytes]:
        """Force content extraction and rebuild PDF"""
        
        for password in self._generate_smart_passwords():
            if self._is_time_up():
                break
                
            try:
                # Try with PyMuPDF first
                doc = fitz.open(pdf_path)
                if doc.authenticate(password):
                    
                    # Extract content from all pages
                    pages_content = []
                    for page_num in range(doc.page_count):
                        page = doc[page_num]
                        
                        # Extract text
                        text = page.get_text()
                        
                        # Extract images
                        image_list = page.get_images()
                        
                        pages_content.append({
                            'text': text,
                            'images': image_list,
                            'page_num': page_num
                        })
                    
                    doc.close()
                    
                    # Rebuild PDF using reportlab
                    if pages_content:
                        return self._rebuild_pdf_from_content(pages_content)
                        
                doc.close()
                
            except Exception:
                continue
                
        return None
        
    def _rebuild_pdf_from_content(self, pages_content: List[Dict]) -> bytes:
        """Rebuild PDF from extracted content using reportlab"""
        
        try:
            buffer = io.BytesIO()
            c = canvas.Canvas(buffer, pagesize=letter)
            
            for page_data in pages_content:
                # Add text content
                text = page_data.get('text', '')
                if text.strip():
                    # Split text into lines and add to PDF
                    lines = text.split('\n')
                    y_position = 750
                    
                    for line in lines[:50]:  # Limit to 50 lines per page
                        if y_position > 50:
                            c.drawString(50, y_position, line[:80])  # Limit line length
                            y_position -= 15
                        else:
                            break
                
                c.showPage()
            
            c.save()
            return buffer.getvalue()
            
        except Exception:
            return None
            
    def process_pdf(self, pdf_data: bytes) -> Dict[str, Any]:
        """Main processing function with ultimate approach"""
        
        self.start_time = time.time()
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            temp_file.write(pdf_data)
            pdf_path = temp_file.name
        
        try:
            # Check if PDF is already unlocked
            try:
                with pikepdf.open(pdf_path) as pdf:
                    return {
                        "success": True,
                        "message": "PDF is not password protected",
                        "output_data": base64.b64encode(pdf_data).decode(),
                        "method": "no_encryption"
                    }
            except pikepdf.PasswordError:
                pass
            
            # Method 1: pikepdf direct attack (most reliable)
            result = self._try_pikepdf_direct(pdf_path)
            if result:
                return {
                    "success": True,
                    "message": "Password cracked using pikepdf direct method",
                    "output_data": base64.b64encode(result).decode(),
                    "method": "pikepdf_direct"
                }
            
            # Method 2: PyPDF2 aggressive attack
            if not self._is_time_up():
                result = self._try_pypdf2_aggressive(pdf_path)
                if result:
                    return {
                        "success": True,
                        "message": "Password cracked using PyPDF2 aggressive method",
                        "output_data": base64.b64encode(result).decode(),
                        "method": "pypdf2_aggressive"
                    }
            
            # Method 3: PyMuPDF aggressive attack
            if not self._is_time_up():
                result = self._try_pymupdf_aggressive(pdf_path)
                if result:
                    return {
                        "success": True,
                        "message": "Password cracked using PyMuPDF aggressive method",
                        "output_data": base64.b64encode(result).decode(),
                        "method": "pymupdf_aggressive"
                    }
            
            # Method 4: Force content extraction and rebuild
            if not self._is_time_up():
                result = self._force_content_extraction(pdf_path)
                if result:
                    return {
                        "success": True,
                        "message": "PDF content extracted and rebuilt successfully",
                        "output_data": base64.b64encode(result).decode(),
                        "method": "force_extraction"
                    }
            
            return {
                "success": False,
                "message": "Unable to crack the password using all available methods. The PDF may have very strong encryption or an unusual password pattern."
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
        
        # Process with ultimate PDF cracker
        cracker = UltimatePDFCracker()
        result = cracker.process_pdf(pdf_data)
        
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({
            "success": False,
            "message": f"Error: {str(e)}"
        }))

if __name__ == "__main__":
    main()