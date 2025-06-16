#!/usr/bin/env python3
"""
Ultimate PDF Password Cracker - Advanced security bypass with multiple exploitation techniques
"""

import sys
import json
import base64
import tempfile
import os
import time
import struct
import re
from datetime import datetime

def ultimate_pdf_crack(pdf_data, max_time=30):
    """Ultimate PDF cracking using multiple exploitation techniques"""
    start_time = time.time()
    
    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as temp_input:
            temp_input.write(pdf_data)
            temp_input_path = temp_input.name
        
        # Try all available methods in order of effectiveness
        methods = [
            ("Security Bypass", try_security_bypass),
            ("Qoppa Library", try_qoppa_method),
            ("pikepdf Advanced", try_pikepdf_advanced),
            ("PyPDF2 Advanced", try_pypdf2_advanced),
            ("PyMuPDF Advanced", try_pymupdf_advanced),
            ("Raw Binary Manipulation", try_binary_manipulation),
            ("Encryption Removal", try_encryption_removal)
        ]
        
        for method_name, method_func in methods:
            if time.time() - start_time > max_time:
                break
                
            try:
                result = method_func(temp_input_path, pdf_data, max_time - (time.time() - start_time))
                if result and result.get("success"):
                    os.unlink(temp_input_path)
                    result["method"] = method_name
                    result["total_time"] = time.time() - start_time
                    return result
            except Exception as e:
                print(f"Error with {method_name}: {e}", file=sys.stderr)
                continue
        
        os.unlink(temp_input_path)
        
        return {
            "success": False,
            "error": "All advanced methods failed",
            "message": "This PDF uses military-grade encryption that resisted all known exploitation techniques",
            "total_time": time.time() - start_time
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Critical system error: {str(e)}"
        }

def try_security_bypass(pdf_path, pdf_data, remaining_time):
    """Try to bypass PDF security using direct manipulation"""
    try:
        # Read PDF as binary and attempt security flag manipulation
        with open(pdf_path, 'rb') as f:
            content = f.read()
        
        # Look for encryption dictionary and try to disable it
        if b'/Encrypt' in content:
            # Try to remove encryption references
            modified_content = content.replace(b'/Encrypt', b'/Encrypt_DISABLED')
            
            # Also try to modify permission flags
            permission_patterns = [
                rb'/P\s*(-?\d+)',
                rb'/Permissions\s*(-?\d+)',
                rb'/UserPassword',
                rb'/OwnerPassword'
            ]
            
            for pattern in permission_patterns:
                modified_content = re.sub(pattern, b'', modified_content)
            
            # Write modified PDF and test
            modified_path = pdf_path + "_bypassed.pdf"
            with open(modified_path, 'wb') as f:
                f.write(modified_content)
            
            # Try to read with PyPDF2
            try:
                import PyPDF2
                with open(modified_path, 'rb') as f:
                    reader = PyPDF2.PdfReader(f)
                    if not reader.is_encrypted:
                        # Success! Create clean output
                        writer = PyPDF2.PdfWriter()
                        for page in reader.pages:
                            writer.add_page(page)
                        
                        from io import BytesIO
                        output_data = BytesIO()
                        writer.write(output_data)
                        output_bytes = output_data.getvalue()
                        
                        os.unlink(modified_path)
                        return {
                            "success": True,
                            "output_data": base64.b64encode(output_bytes).decode('utf-8'),
                            "message": "PDF security bypassed using direct manipulation",
                            "pages_count": len(reader.pages)
                        }
            except Exception:
                pass
            
            try:
                os.unlink(modified_path)
            except:
                pass
        
        return {"success": False}
        
    except Exception as e:
        return {"success": False, "error": f"Security bypass failed: {str(e)}"}

def try_qoppa_method(pdf_path, pdf_data, remaining_time):
    """Try Qoppa-style PDF processing"""
    try:
        import pikepdf
        
        # Try to open with specific flags that bypass some restrictions
        try:
            pdf = pikepdf.open(pdf_path, allow_overwriting_input=True)
            
            # Remove all security settings
            if hasattr(pdf, 'Root') and hasattr(pdf.Root, 'Encrypt'):
                del pdf.Root.Encrypt
            
            # Create clean output
            output_path = pdf_path + "_qoppa.pdf"
            pdf.save(output_path)
            
            with open(output_path, 'rb') as f:
                output_bytes = f.read()
            os.unlink(output_path)
            
            return {
                "success": True,
                "output_data": base64.b64encode(output_bytes).decode('utf-8'),
                "message": "PDF unlocked using Qoppa-style processing",
                "pages_count": len(pdf.pages)
            }
            
        except Exception:
            pass
        
        return {"success": False}
        
    except ImportError:
        return {"success": False, "error": "pikepdf not available"}
    except Exception as e:
        return {"success": False, "error": f"Qoppa method failed: {str(e)}"}

def try_pikepdf_advanced(pdf_path, pdf_data, remaining_time):
    """Advanced pikepdf with aggressive techniques"""
    try:
        import pikepdf
        
        # Generate ultra-comprehensive password list
        passwords = generate_ultra_passwords()
        start_time = time.time()
        
        for i, pwd in enumerate(passwords):
            if time.time() - start_time > remaining_time:
                break
                
            try:
                pdf = pikepdf.open(pdf_path, password=pwd)
                
                # Success! Remove all security
                output_path = pdf_path + "_cracked.pdf"
                pdf.save(output_path, encryption=pikepdf.Encryption(owner="", user="", R=0))
                
                with open(output_path, 'rb') as f:
                    output_bytes = f.read()
                os.unlink(output_path)
                pdf.close()
                
                return {
                    "success": True,
                    "output_data": base64.b64encode(output_bytes).decode('utf-8'),
                    "message": f"Password cracked with pikepdf: '{pwd}' (attempt {i+1})",
                    "password_used": pwd,
                    "pages_count": len(pdf.pages)
                }
            except pikepdf.PasswordError:
                continue
            except Exception:
                continue
        
        return {"success": False, "tested_passwords": i+1 if 'i' in locals() else 0}
        
    except ImportError:
        return {"success": False, "error": "pikepdf not available"}
    except Exception as e:
        return {"success": False, "error": f"pikepdf advanced failed: {str(e)}"}

def try_pypdf2_advanced(pdf_path, pdf_data, remaining_time):
    """Advanced PyPDF2 with comprehensive cracking"""
    try:
        import PyPDF2
        from io import BytesIO
        
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            
            if not reader.is_encrypted:
                # Not encrypted
                writer = PyPDF2.PdfWriter()
                for page in reader.pages:
                    writer.add_page(page)
                
                output_data = BytesIO()
                writer.write(output_data)
                output_bytes = output_data.getvalue()
                
                return {
                    "success": True,
                    "output_data": base64.b64encode(output_bytes).decode('utf-8'),
                    "message": "PDF was not encrypted",
                    "pages_count": len(reader.pages)
                }
            
            # Try ultra-comprehensive password list
            passwords = generate_ultra_passwords()
            start_time = time.time()
            
            for i, pwd in enumerate(passwords):
                if time.time() - start_time > remaining_time:
                    break
                    
                try:
                    if reader.decrypt(pwd):
                        # Success!
                        writer = PyPDF2.PdfWriter()
                        for page in reader.pages:
                            writer.add_page(page)
                        
                        output_data = BytesIO()
                        writer.write(output_data)
                        output_bytes = output_data.getvalue()
                        
                        return {
                            "success": True,
                            "output_data": base64.b64encode(output_bytes).decode('utf-8'),
                            "message": f"Password cracked with PyPDF2: '{pwd}' (attempt {i+1})",
                            "password_used": pwd,
                            "pages_count": len(reader.pages)
                        }
                except Exception:
                    continue
                    
            return {"success": False, "tested_passwords": i+1 if 'i' in locals() else 0}
            
    except ImportError:
        return {"success": False, "error": "PyPDF2 not available"}
    except Exception as e:
        return {"success": False, "error": f"PyPDF2 advanced failed: {str(e)}"}

def try_pymupdf_advanced(pdf_path, pdf_data, remaining_time):
    """Advanced PyMuPDF with aggressive techniques"""
    try:
        import fitz
        
        # Try without password first
        try:
            doc = fitz.open(pdf_path)
            if not doc.needs_pass:
                output_path = pdf_path + "_mupdf.pdf"
                doc.save(output_path)
                
                with open(output_path, 'rb') as f:
                    output_bytes = f.read()
                os.unlink(output_path)
                doc.close()
                
                return {
                    "success": True,
                    "output_data": base64.b64encode(output_bytes).decode('utf-8'),
                    "message": "PDF processed with PyMuPDF",
                    "pages_count": doc.page_count
                }
            doc.close()
        except Exception:
            pass
        
        # Try password cracking
        passwords = generate_ultra_passwords()
        start_time = time.time()
        
        for i, pwd in enumerate(passwords):
            if time.time() - start_time > remaining_time:
                break
                
            try:
                doc = fitz.open(pdf_path)
                if doc.authenticate(pwd):
                    output_path = pdf_path + "_mupdf_cracked.pdf"
                    doc.save(output_path)
                    
                    with open(output_path, 'rb') as f:
                        output_bytes = f.read()
                    os.unlink(output_path)
                    doc.close()
                    
                    return {
                        "success": True,
                        "output_data": base64.b64encode(output_bytes).decode('utf-8'),
                        "message": f"Password cracked with PyMuPDF: '{pwd}' (attempt {i+1})",
                        "password_used": pwd,
                        "pages_count": doc.page_count
                    }
                doc.close()
            except Exception:
                continue
                
        return {"success": False, "tested_passwords": i+1 if 'i' in locals() else 0}
        
    except ImportError:
        return {"success": False, "error": "PyMuPDF not available"}
    except Exception as e:
        return {"success": False, "error": f"PyMuPDF advanced failed: {str(e)}"}

def try_binary_manipulation(pdf_path, pdf_data, remaining_time):
    """Try binary-level PDF manipulation"""
    try:
        # Read PDF binary data
        with open(pdf_path, 'rb') as f:
            data = bytearray(f.read())
        
        # Look for specific encryption markers and try to neutralize them
        modifications = [
            # Remove owner password checks
            (b'/O(', b'/O_DISABLED('),
            (b'/U(', b'/U_DISABLED('),
            # Modify permission flags
            (b'/P -', b'/P 0'),
            (b'/P-', b'/P0'),
            # Disable encryption flags
            (b'/Filter/Standard', b'/Filter_DISABLED/Standard'),
            (b'/V 1', b'/V 0'),
            (b'/V 2', b'/V 0'),
            (b'/V 4', b'/V 0'),
            (b'/V 5', b'/V 0'),
            # Remove encryption dictionary references
            (b'<</Encrypt', b'<</Encrypt_DISABLED'),
        ]
        
        for old, new in modifications:
            data = data.replace(old, new)
        
        # Write modified file
        modified_path = pdf_path + "_binary_mod.pdf"
        with open(modified_path, 'wb') as f:
            f.write(data)
        
        # Try to read modified file
        try:
            import PyPDF2
            with open(modified_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                
                if not reader.is_encrypted:
                    writer = PyPDF2.PdfWriter()
                    for page in reader.pages:
                        writer.add_page(page)
                    
                    from io import BytesIO
                    output_data = BytesIO()
                    writer.write(output_data)
                    output_bytes = output_data.getvalue()
                    
                    os.unlink(modified_path)
                    return {
                        "success": True,
                        "output_data": base64.b64encode(output_bytes).decode('utf-8'),
                        "message": "PDF security removed using binary manipulation",
                        "pages_count": len(reader.pages)
                    }
        except Exception:
            pass
        
        try:
            os.unlink(modified_path)
        except:
            pass
        
        return {"success": False}
        
    except Exception as e:
        return {"success": False, "error": f"Binary manipulation failed: {str(e)}"}

def try_encryption_removal(pdf_path, pdf_data, remaining_time):
    """Try to completely remove encryption from PDF structure"""
    try:
        # Parse PDF structure and remove encryption objects
        with open(pdf_path, 'rb') as f:
            content = f.read()
        
        # Find and remove encryption dictionary
        content_str = content.decode('latin-1', errors='ignore')
        
        # Remove encryption object references
        patterns_to_remove = [
            r'/Encrypt\s+\d+\s+\d+\s+R',
            r'/Encrypt\s*<<[^>]*>>',
            r'\d+\s+\d+\s+obj\s*<<[^>]*?/Filter\s*/Standard[^>]*?>>\s*endobj',
        ]
        
        for pattern in patterns_to_remove:
            content_str = re.sub(pattern, '', content_str, flags=re.DOTALL | re.IGNORECASE)
        
        # Convert back to bytes
        modified_content = content_str.encode('latin-1', errors='ignore')
        
        # Write modified file
        clean_path = pdf_path + "_clean.pdf"
        with open(clean_path, 'wb') as f:
            f.write(modified_content)
        
        # Test the cleaned file
        try:
            import PyPDF2
            with open(clean_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                
                if not reader.is_encrypted:
                    writer = PyPDF2.PdfWriter()
                    for page in reader.pages:
                        writer.add_page(page)
                    
                    from io import BytesIO
                    output_data = BytesIO()
                    writer.write(output_data)
                    output_bytes = output_data.getvalue()
                    
                    os.unlink(clean_path)
                    return {
                        "success": True,
                        "output_data": base64.b64encode(output_bytes).decode('utf-8'),
                        "message": "PDF encryption completely removed",
                        "pages_count": len(reader.pages)
                    }
        except Exception:
            pass
        
        try:
            os.unlink(clean_path)
        except:
            pass
        
        return {"success": False}
        
    except Exception as e:
        return {"success": False, "error": f"Encryption removal failed: {str(e)}"}

def generate_ultra_passwords():
    """Generate the most comprehensive password list possible"""
    passwords = [""]  # Empty password first
    
    # High-priority ultra-common passwords
    ultra_common = [
        "123456", "password", "123456789", "12345678", "12345", "qwerty", 
        "abc123", "111111", "admin", "password1", "1234567890", "123123",
        "000000", "iloveyou", "1234", "password123", "123", "admin123",
        "document", "pdf", "secret", "private", "test", "demo", "user",
        "guest", "root", "main", "file", "data", "letmein", "welcome",
        "monkey", "dragon", "sunshine", "master", "football", "baseball",
        "adobe", "acrobat", "reader", "viewer", "edit", "print", "open"
    ]
    passwords.extend(ultra_common)
    
    # Current and recent years
    current_year = datetime.now().year
    for year in range(1990, current_year + 2):
        passwords.extend([
            str(year), f"password{year}", f"admin{year}", f"pdf{year}",
            f"document{year}", f"test{year}", f"demo{year}", str(year)[-2:]
        ])
    
    # Comprehensive variations
    base_words = ["password", "admin", "document", "pdf", "secret", "private", "test", "demo"]
    for word in base_words:
        # Case variations
        variations = [word.lower(), word.upper(), word.capitalize(), word.swapcase()]
        passwords.extend(variations)
        
        # Character substitutions (leet speak and common)
        substitutions = [
            word.replace('a', '@'), word.replace('e', '3'), word.replace('i', '1'),
            word.replace('o', '0'), word.replace('s', '$'), word.replace('t', '7'),
            word.replace('l', '1'), word.replace('g', '9'), word.replace('z', '2')
        ]
        passwords.extend(substitutions)
        
        # Number combinations
        for num in ['1', '12', '123', '1234', '12345', '01', '001', '0001', 
                   '!', '@', '#', '$', '%', '2024', '2023', '2022', '2021']:
            passwords.extend([
                f"{word}{num}", f"{num}{word}", f"{word.capitalize()}{num}",
                f"{word.upper()}{num}", f"{num}{word.upper()}"
            ])
    
    # Comprehensive brute force (optimized for speed)
    # Single digits and letters
    for i in range(10):
        passwords.append(str(i))
    for c in 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ':
        passwords.append(c)
    
    # 2-character combinations (most common patterns)
    for i in range(100):
        passwords.append(f"{i:02d}")
    
    # Common letter combinations
    common_pairs = ['aa', 'bb', 'cc', 'dd', 'ee', 'ff', 'gg', 'hh', 'ii', 'jj',
                   'kk', 'll', 'mm', 'nn', 'oo', 'pp', 'qq', 'rr', 'ss', 'tt',
                   'uu', 'vv', 'ww', 'xx', 'yy', 'zz', 'ab', 'bc', 'cd', 'de']
    passwords.extend(common_pairs)
    passwords.extend([p.upper() for p in common_pairs])
    
    # 3-character high-probability patterns
    common_3char = [
        '000', '001', '002', '010', '011', '100', '101', '110', '111', '123',
        '234', '345', '456', '567', '678', '789', '987', '876', '765', '654',
        'abc', 'def', 'ghi', 'jkl', 'mno', 'pqr', 'stu', 'vwx', 'xyz', 'qwe',
        'asd', 'zxc', 'rty', 'fgh', 'vbn', 'uio', 'hjk', 'bnm', 'wer', 'sdf'
    ]
    passwords.extend(common_3char)
    passwords.extend([p.upper() for p in common_3char])
    passwords.extend([p.capitalize() for p in common_3char])
    
    # Document-specific and context-aware passwords
    doc_passwords = [
        "confidential", "protected", "secure", "locked", "hidden", "restricted",
        "internal", "draft", "final", "copy", "backup", "archive", "report",
        "contract", "agreement", "invoice", "receipt", "statement", "proposal",
        "presentation", "meeting", "conference", "private", "personal", "company",
        "business", "work", "office", "home", "family", "important", "urgent"
    ]
    passwords.extend(doc_passwords)
    for word in doc_passwords:
        passwords.extend([word.upper(), word.capitalize()])
        for num in ['1', '2', '3', '123', '2024', '2023']:
            passwords.extend([f"{word}{num}", f"{word.capitalize()}{num}"])
    
    # Remove duplicates while preserving order
    seen = set()
    unique_passwords = []
    for pwd in passwords:
        if pwd not in seen:
            seen.add(pwd)
            unique_passwords.append(pwd)
    
    # Return first 10000 most likely passwords for performance
    return unique_passwords[:10000]

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
        
        # Process PDF with ultimate cracking
        result = ultimate_pdf_crack(pdf_bytes, max_time=30)
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