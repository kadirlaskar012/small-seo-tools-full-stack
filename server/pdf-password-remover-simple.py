#!/usr/bin/env python3
"""
Simple PDF Password Remover - Fast and reliable password cracking
"""

import sys
import json
import base64
import tempfile
import os
from datetime import datetime

def try_password_removal(pdf_data, password_hint=""):
    """Simple password removal using PyPDF2"""
    try:
        import PyPDF2
        from io import BytesIO
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as temp_input:
            temp_input.write(pdf_data)
            temp_input_path = temp_input.name
        
        # Common passwords to try
        passwords = [
            "", "123456", "password", "123456789", "12345678", "12345", 
            "qwerty", "abc123", "111111", "admin", "password1", "123", 
            "1234", "12345", "document", "pdf", "file", "secret", "private"
        ]
        
        # Add current year patterns
        current_year = datetime.now().year
        for year in [current_year, current_year-1, current_year-2]:
            passwords.extend([
                f"password{year}", f"{year}", f"admin{year}", 
                f"document{year}", f"pdf{year}"
            ])
        
        # Add user hint if provided
        if password_hint:
            passwords.insert(0, password_hint)
        
        # Try to open PDF
        with open(temp_input_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            
            # Check if PDF is encrypted
            if not reader.is_encrypted:
                # PDF is not password protected
                writer = PyPDF2.PdfWriter()
                for page in reader.pages:
                    writer.add_page(page)
                
                output_data = BytesIO()
                writer.write(output_data)
                output_bytes = output_data.getvalue()
                
                os.unlink(temp_input_path)
                
                return {
                    "success": True,
                    "output_data": base64.b64encode(output_bytes).decode('utf-8'),
                    "message": "PDF was not password protected",
                    "method": "direct_copy"
                }
            
            # Try passwords
            for pwd in passwords:
                try:
                    if reader.decrypt(pwd):
                        # Success! Create unlocked PDF
                        writer = PyPDF2.PdfWriter()
                        for page in reader.pages:
                            writer.add_page(page)
                        
                        output_data = BytesIO()
                        writer.write(output_data)
                        output_bytes = output_data.getvalue()
                        
                        os.unlink(temp_input_path)
                        
                        return {
                            "success": True,
                            "output_data": base64.b64encode(output_bytes).decode('utf-8'),
                            "message": f"Password found: '{pwd}'" if pwd else "No password required",
                            "method": "PyPDF2",
                            "password_used": pwd
                        }
                except Exception:
                    continue
        
        os.unlink(temp_input_path)
        
        return {
            "success": False,
            "error": "Unable to crack password with common patterns",
            "message": "This PDF uses a strong password that requires manual entry"
        }
        
    except ImportError:
        return {
            "success": False,
            "error": "PyPDF2 library not available"
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Processing error: {str(e)}"
        }

def main():
    try:
        # Read JSON input from stdin
        input_data = sys.stdin.read()
        data = json.loads(input_data)
        
        pdf_base64 = data.get('pdf_data', '')
        password = data.get('password', '')
        
        if not pdf_base64:
            print(json.dumps({
                "success": False,
                "error": "No PDF data provided"
            }))
            return
        
        # Decode PDF data
        pdf_bytes = base64.b64decode(pdf_base64)
        
        # Process PDF
        result = try_password_removal(pdf_bytes, password)
        print(json.dumps(result))
        
    except json.JSONDecodeError:
        print(json.dumps({
            "success": False,
            "error": "Invalid JSON input"
        }))
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": f"Unexpected error: {str(e)}"
        }))

if __name__ == "__main__":
    main()