#!/usr/bin/env python3
"""
Simple PDF Password Cracker - Focused on content preservation and reliability
This is a backup method that prioritizes keeping all PDF content intact
"""

import sys
import json
import base64
import tempfile
import os
from io import BytesIO

def simple_crack_pdf(pdf_data):
    """Simple and reliable PDF password cracking with content preservation"""
    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            pdf_bytes = base64.b64decode(pdf_data)
            tmp_file.write(pdf_bytes)
            pdf_path = tmp_file.name
        
        try:
            # Method 1: Try PyPDF2 first (most reliable for content preservation)
            result = try_pypdf2_simple(pdf_path, pdf_bytes)
            if result["success"]:
                return result
            
            # Method 2: Try pikepdf
            result = try_pikepdf_simple(pdf_path, pdf_bytes)
            if result["success"]:
                return result
            
            # Method 3: Try PyMuPDF
            result = try_pymupdf_simple(pdf_path, pdf_bytes)
            if result["success"]:
                return result
            
            return {"success": False, "message": "Could not crack PDF password"}
            
        finally:
            try:
                os.unlink(pdf_path)
            except:
                pass
                
    except Exception as e:
        return {"success": False, "error": f"Processing failed: {str(e)}"}

def try_pypdf2_simple(pdf_path, pdf_bytes):
    """Simple PyPDF2 approach with content preservation"""
    try:
        import PyPDF2
        
        with open(pdf_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            
            # Check if PDF is actually encrypted
            if not reader.is_encrypted:
                # Not encrypted, just clean it up
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
                    "pages_count": len(reader.pages),
                    "method": "PyPDF2 Clean"
                }
            
            # Try common passwords
            common_passwords = [
                "", "password", "123456", "admin", "user", "test", "demo",
                "123", "1234", "12345", "qwerty", "abc123", "password123",
                "admin123", "root", "guest", "123456789", "1234567890"
            ]
            
            for pwd in common_passwords:
                try:
                    if reader.decrypt(pwd):
                        # Success! Create clean output
                        writer = PyPDF2.PdfWriter()
                        for page in reader.pages:
                            writer.add_page(page)
                        
                        output_data = BytesIO()
                        writer.write(output_data)
                        output_bytes = output_data.getvalue()
                        
                        return {
                            "success": True,
                            "output_data": base64.b64encode(output_bytes).decode('utf-8'),
                            "message": f"Password cracked: '{pwd}'",
                            "password_used": pwd,
                            "pages_count": len(reader.pages),
                            "method": "PyPDF2 Simple"
                        }
                except Exception:
                    continue
            
            return {"success": False, "method": "PyPDF2"}
            
    except ImportError:
        return {"success": False, "error": "PyPDF2 not available"}
    except Exception as e:
        return {"success": False, "error": f"PyPDF2 failed: {str(e)}"}

def try_pikepdf_simple(pdf_path, pdf_bytes):
    """Simple pikepdf approach"""
    try:
        import pikepdf
        
        # Try to open without password
        try:
            pdf = pikepdf.open(pdf_path)
            
            # Create clean output
            output_path = pdf_path + "_pikepdf.pdf"
            pdf.save(output_path, linearize=True)
            pdf.close()
            
            with open(output_path, 'rb') as f:
                output_bytes = f.read()
            os.unlink(output_path)
            
            return {
                "success": True,
                "output_data": base64.b64encode(output_bytes).decode('utf-8'),
                "message": "PDF processed successfully",
                "pages_count": len(pdf.pages),
                "method": "pikepdf Simple"
            }
            
        except pikepdf.PasswordError:
            # Try common passwords
            common_passwords = [
                "", "password", "123456", "admin", "user", "test"
            ]
            
            for pwd in common_passwords:
                try:
                    pdf = pikepdf.open(pdf_path, password=pwd)
                    
                    output_path = pdf_path + "_pikepdf_cracked.pdf"
                    pdf.save(output_path, linearize=True)
                    
                    with open(output_path, 'rb') as f:
                        output_bytes = f.read()
                    os.unlink(output_path)
                    pdf.close()
                    
                    return {
                        "success": True,
                        "output_data": base64.b64encode(output_bytes).decode('utf-8'),
                        "message": f"Password cracked: '{pwd}'",
                        "password_used": pwd,
                        "pages_count": len(pdf.pages),
                        "method": "pikepdf Simple"
                    }
                except Exception:
                    continue
            
            return {"success": False, "method": "pikepdf"}
            
    except ImportError:
        return {"success": False, "error": "pikepdf not available"}
    except Exception as e:
        return {"success": False, "error": f"pikepdf failed: {str(e)}"}

def try_pymupdf_simple(pdf_path, pdf_bytes):
    """Simple PyMuPDF approach"""
    try:
        import fitz
        
        # Try to open without password
        try:
            doc = fitz.open(pdf_path)
            if not doc.needs_pass:
                output_path = pdf_path + "_mupdf.pdf"
                doc.save(output_path, garbage=4, deflate=True, clean=True)
                
                with open(output_path, 'rb') as f:
                    output_bytes = f.read()
                os.unlink(output_path)
                doc.close()
                
                return {
                    "success": True,
                    "output_data": base64.b64encode(output_bytes).decode('utf-8'),
                    "message": "PDF processed successfully",
                    "pages_count": doc.page_count,
                    "method": "PyMuPDF Simple"
                }
            doc.close()
        except Exception:
            pass
        
        # Try common passwords
        common_passwords = ["", "password", "123456", "admin", "user"]
        
        for pwd in common_passwords:
            try:
                doc = fitz.open(pdf_path)
                if doc.authenticate(pwd):
                    output_path = pdf_path + "_mupdf_cracked.pdf"
                    doc.save(output_path, garbage=4, deflate=True, clean=True)
                    
                    with open(output_path, 'rb') as f:
                        output_bytes = f.read()
                    os.unlink(output_path)
                    doc.close()
                    
                    return {
                        "success": True,
                        "output_data": base64.b64encode(output_bytes).decode('utf-8'),
                        "message": f"Password cracked: '{pwd}'",
                        "password_used": pwd,
                        "pages_count": doc.page_count,
                        "method": "PyMuPDF Simple"
                    }
                doc.close()
            except Exception:
                continue
        
        return {"success": False, "method": "PyMuPDF"}
        
    except ImportError:
        return {"success": False, "error": "PyMuPDF not available"}
    except Exception as e:
        return {"success": False, "error": f"PyMuPDF failed: {str(e)}"}

def main():
    """Main function for command line usage"""
    try:
        input_data = json.loads(sys.stdin.read())
        pdf_data = input_data.get('pdf_data')
        
        if not pdf_data:
            print(json.dumps({"success": False, "error": "No PDF data provided"}))
            return
        
        result = simple_crack_pdf(pdf_data)
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"success": False, "error": f"Main function failed: {str(e)}"}))

if __name__ == "__main__":
    main()