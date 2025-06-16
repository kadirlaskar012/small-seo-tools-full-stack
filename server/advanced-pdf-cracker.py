#!/usr/bin/env python3
"""
Advanced PDF Password Cracker - Multi-library approach with aggressive techniques
"""

import sys
import json
import base64
import tempfile
import os
import time
import itertools
import string
from datetime import datetime

def aggressive_password_crack(pdf_data, max_time=30):
    """Aggressive password cracking using multiple techniques and libraries"""
    start_time = time.time()
    
    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as temp_input:
            temp_input.write(pdf_data)
            temp_input_path = temp_input.name
        
        # Try multiple libraries in order of effectiveness
        libraries = [
            ("PyPDF2", crack_with_pypdf2),
            ("pikepdf", crack_with_pikepdf),
            ("pymupdf", crack_with_pymupdf)
        ]
        
        for lib_name, crack_func in libraries:
            if time.time() - start_time > max_time:
                break
                
            try:
                result = crack_func(temp_input_path, max_time - (time.time() - start_time))
                if result and result["success"]:
                    os.unlink(temp_input_path)
                    result["method"] = lib_name
                    result["total_time"] = time.time() - start_time
                    return result
            except Exception as e:
                print(f"Error with {lib_name}: {e}", file=sys.stderr)
                continue
        
        os.unlink(temp_input_path)
        
        return {
            "success": False,
            "error": "Password cracking failed with all methods",
            "message": "This PDF uses strong encryption that resisted all cracking attempts",
            "total_time": time.time() - start_time
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Critical error: {str(e)}"
        }

def crack_with_pypdf2(pdf_path, remaining_time):
    """Crack using PyPDF2 with comprehensive dictionary and brute force"""
    try:
        import PyPDF2
        from io import BytesIO
        
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            
            if not reader.is_encrypted:
                # Not encrypted, copy directly
                writer = PyPDF2.PdfWriter()
                for page in reader.pages:
                    writer.add_page(page)
                
                output_data = BytesIO()
                writer.write(output_data)
                output_bytes = output_data.getvalue()
                
                return {
                    "success": True,
                    "output_data": base64.b64encode(output_bytes).decode('utf-8'),
                    "message": "PDF was not password protected",
                    "pages_count": len(reader.pages)
                }
            
            # Generate comprehensive password list
            passwords = generate_comprehensive_passwords()
            
            start_time = time.time()
            tested_count = 0
            
            for pwd in passwords:
                if time.time() - start_time > remaining_time:
                    break
                    
                tested_count += 1
                try:
                    if reader.decrypt(pwd):
                        # Success! Create unlocked PDF
                        writer = PyPDF2.PdfWriter()
                        for page in reader.pages:
                            writer.add_page(page)
                        
                        output_data = BytesIO()
                        writer.write(output_data)
                        output_bytes = output_data.getvalue()
                        
                        return {
                            "success": True,
                            "output_data": base64.b64encode(output_bytes).decode('utf-8'),
                            "message": f"Password cracked: '{pwd}' (tested {tested_count} passwords)",
                            "password_used": pwd,
                            "pages_count": len(reader.pages),
                            "processing_time": time.time() - start_time
                        }
                except Exception:
                    continue
                    
            return {"success": False, "tested_passwords": tested_count}
            
    except ImportError:
        return {"success": False, "error": "PyPDF2 not available"}
    except Exception as e:
        return {"success": False, "error": f"PyPDF2 error: {str(e)}"}

def crack_with_pikepdf(pdf_path, remaining_time):
    """Crack using pikepdf with advanced techniques"""
    try:
        import pikepdf
        
        # Try to open without password first
        try:
            pdf = pikepdf.open(pdf_path)
            
            # Create unlocked version
            output_path = pdf_path + "_unlocked.pdf"
            pdf.save(output_path)
            
            with open(output_path, 'rb') as f:
                output_bytes = f.read()
            os.unlink(output_path)
            
            return {
                "success": True,
                "output_data": base64.b64encode(output_bytes).decode('utf-8'),
                "message": "PDF was not password protected",
                "pages_count": len(pdf.pages)
            }
        except pikepdf.PasswordError:
            pass  # Continue with password cracking
        
        passwords = generate_comprehensive_passwords()
        start_time = time.time()
        tested_count = 0
        
        for pwd in passwords:
            if time.time() - start_time > remaining_time:
                break
                
            tested_count += 1
            try:
                pdf = pikepdf.open(pdf_path, password=pwd)
                
                # Success! Create unlocked PDF
                output_path = pdf_path + "_unlocked.pdf"
                pdf.save(output_path)
                
                with open(output_path, 'rb') as f:
                    output_bytes = f.read()
                os.unlink(output_path)
                
                return {
                    "success": True,
                    "output_data": base64.b64encode(output_bytes).decode('utf-8'),
                    "message": f"Password cracked with pikepdf: '{pwd}' (tested {tested_count} passwords)",
                    "password_used": pwd,
                    "pages_count": len(pdf.pages),
                    "processing_time": time.time() - start_time
                }
            except pikepdf.PasswordError:
                continue
            except Exception:
                continue
                
        return {"success": False, "tested_passwords": tested_count}
        
    except ImportError:
        return {"success": False, "error": "pikepdf not available"}
    except Exception as e:
        return {"success": False, "error": f"pikepdf error: {str(e)}"}

def crack_with_pymupdf(pdf_path, remaining_time):
    """Crack using PyMuPDF with advanced techniques"""
    try:
        import fitz  # PyMuPDF
        
        # Try to open without password first
        try:
            doc = fitz.open(pdf_path)
            if not doc.needs_pass:
                # Create unlocked version
                output_path = pdf_path + "_unlocked.pdf"
                doc.save(output_path)
                
                with open(output_path, 'rb') as f:
                    output_bytes = f.read()
                os.unlink(output_path)
                
                return {
                    "success": True,
                    "output_data": base64.b64encode(output_bytes).decode('utf-8'),
                    "message": "PDF was not password protected",
                    "pages_count": doc.page_count
                }
            doc.close()
        except Exception:
            pass
        
        passwords = generate_comprehensive_passwords()
        start_time = time.time()
        tested_count = 0
        
        for pwd in passwords:
            if time.time() - start_time > remaining_time:
                break
                
            tested_count += 1
            try:
                doc = fitz.open(pdf_path)
                if doc.authenticate(pwd):
                    # Success! Create unlocked PDF
                    output_path = pdf_path + "_unlocked.pdf"
                    doc.save(output_path)
                    
                    with open(output_path, 'rb') as f:
                        output_bytes = f.read()
                    os.unlink(output_path)
                    doc.close()
                    
                    return {
                        "success": True,
                        "output_data": base64.b64encode(output_bytes).decode('utf-8'),
                        "message": f"Password cracked with PyMuPDF: '{pwd}' (tested {tested_count} passwords)",
                        "password_used": pwd,
                        "pages_count": doc.page_count,
                        "processing_time": time.time() - start_time
                    }
                doc.close()
            except Exception:
                continue
                
        return {"success": False, "tested_passwords": tested_count}
        
    except ImportError:
        return {"success": False, "error": "PyMuPDF not available"}
    except Exception as e:
        return {"success": False, "error": f"PyMuPDF error: {str(e)}"}

def generate_comprehensive_passwords():
    """Generate the most comprehensive password list possible"""
    passwords = [""]  # Empty password first
    
    # Ultra-high priority passwords
    ultra_high = [
        "123456", "password", "123456789", "12345678", "12345", "qwerty", 
        "abc123", "111111", "admin", "password1", "1234567890", "123123",
        "000000", "iloveyou", "1234", "password123", "123", "admin123",
        "document", "pdf", "secret", "private", "test", "demo", "user",
        "guest", "root", "main", "file", "data"
    ]
    passwords.extend(ultra_high)
    
    # Current year patterns (high priority)
    current_year = datetime.now().year
    for year in range(current_year - 5, current_year + 1):
        passwords.extend([
            str(year), f"password{year}", f"admin{year}", f"document{year}",
            f"pdf{year}", f"test{year}", f"demo{year}", f"user{year}"
        ])
    
    # Common variations of top passwords
    base_words = ["password", "admin", "document", "pdf", "secret", "private"]
    for word in base_words:
        # Case variations
        passwords.extend([word.lower(), word.upper(), word.capitalize()])
        
        # Number combinations
        for num in ['1', '12', '123', '1234', '01', '001', '2024', '2023', '!', '@', '#']:
            passwords.extend([f"{word}{num}", f"{num}{word}", f"{word.capitalize()}{num}"])
        
        # Leet speak
        leet = word.replace('a', '@').replace('e', '3').replace('i', '1').replace('o', '0').replace('s', '$')
        passwords.append(leet)
    
    # Brute force patterns (optimized for speed)
    # Single characters
    for i in range(10):
        passwords.append(str(i))
    for c in 'abcdefghijklmnopqrstuvwxyz':
        passwords.extend([c, c.upper()])
    
    # 2-character patterns
    for i in range(100):
        passwords.append(f"{i:02d}")
    
    # 3-character patterns (selective)
    common_3char = [
        '000', '001', '002', '111', '123', '222', '333', '444', '555',
        '666', '777', '888', '999', 'abc', 'xyz', 'qwe', 'asd', 'zxc'
    ]
    passwords.extend(common_3char)
    
    # 4-character patterns (highly selective)
    common_4char = [
        '0000', '0001', '0123', '1111', '1234', '2222', '3333', '4444',
        '5555', '6666', '7777', '8888', '9999', 'abcd', 'qwer', 'asdf'
    ]
    passwords.extend(common_4char)
    
    # Document-specific passwords
    doc_specific = [
        "confidential", "protected", "secure", "locked", "hidden", "restricted",
        "internal", "draft", "final", "copy", "backup", "archive", "report",
        "contract", "agreement", "invoice", "receipt", "statement", "proposal"
    ]
    passwords.extend(doc_specific)
    
    # Names with variations
    names = ["john", "jane", "mike", "mary", "admin", "user", "test", "demo"]
    for name in names:
        passwords.extend([
            name, name.capitalize(), name.upper(),
            f"{name}1", f"{name}123", f"{name}2024"
        ])
    
    # Remove duplicates while preserving order
    seen = set()
    unique_passwords = []
    for pwd in passwords:
        if pwd not in seen:
            seen.add(pwd)
            unique_passwords.append(pwd)
    
    # Limit for performance (prioritize most likely passwords)
    return unique_passwords[:5000]

def main():
    try:
        # Read JSON input from stdin
        input_data = sys.stdin.read()
        data = json.loads(input_data)
        
        pdf_base64 = data.get('pdf_data', '')
        
        if not pdf_base64:
            print(json.dumps({
                "success": False,
                "error": "No PDF data provided"
            }))
            return
        
        # Decode PDF data
        pdf_bytes = base64.b64decode(pdf_base64)
        
        # Process PDF with aggressive cracking
        result = aggressive_password_crack(pdf_bytes, max_time=30)
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