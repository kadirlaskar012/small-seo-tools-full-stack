#!/usr/bin/env python3
"""
Content-Preserving PDF Password Cracker
This approach prioritizes keeping ALL PDF content intact while removing passwords
"""

import sys
import json
import base64
import tempfile
import os
import time
from io import BytesIO

def preserve_content_crack(pdf_data):
    """Content-preserving PDF password removal"""
    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            pdf_bytes = base64.b64decode(pdf_data)
            tmp_file.write(pdf_bytes)
            pdf_path = tmp_file.name
        
        start_time = time.time()
        
        try:
            # Method 1: PyPDF2 with careful content preservation
            result = try_pypdf2_preserve(pdf_path)
            if result["success"]:
                result["total_time"] = time.time() - start_time
                return result
            
            # Method 2: pikepdf with minimal changes
            result = try_pikepdf_preserve(pdf_path)
            if result["success"]:
                result["total_time"] = time.time() - start_time
                return result
            
            # Method 3: PyMuPDF conservative approach
            result = try_pymupdf_preserve(pdf_path)
            if result["success"]:
                result["total_time"] = time.time() - start_time
                return result
            
            return {
                "success": False, 
                "message": "Could not unlock PDF while preserving content",
                "total_time": time.time() - start_time
            }
            
        finally:
            try:
                os.unlink(pdf_path)
            except:
                pass
                
    except Exception as e:
        return {"success": False, "error": f"Processing failed: {str(e)}"}

def try_pypdf2_preserve(pdf_path):
    """PyPDF2 with maximum content preservation"""
    try:
        import PyPDF2
        
        with open(pdf_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            
            # Check if encrypted
            if not reader.is_encrypted:
                # Not encrypted - just create clean copy
                writer = PyPDF2.PdfWriter()
                
                # Copy pages exactly as they are
                for i, page in enumerate(reader.pages):
                    writer.add_page(page)
                
                # Preserve metadata
                if hasattr(reader, 'metadata') and reader.metadata:
                    writer.add_metadata(reader.metadata)
                
                output_data = BytesIO()
                writer.write(output_data)
                
                return {
                    "success": True,
                    "output_data": base64.b64encode(output_data.getvalue()).decode('utf-8'),
                    "message": "PDF processed (was not encrypted)",
                    "pages_count": len(reader.pages),
                    "method": "PyPDF2 Content Preserve"
                }
            
            # Try comprehensive password cracking with content preservation
            passwords = [
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
                "Test", "TEST", "Demo", "DEMO", "Root", "ROOT", "Guest", "GUEST"
            ]
            
            for pwd in passwords:
                try:
                    # Create a fresh reader for each attempt
                    with open(pdf_path, 'rb') as f2:
                        test_reader = PyPDF2.PdfReader(f2)
                        
                        if test_reader.decrypt(pwd):
                            # Password worked! Now carefully preserve content
                            writer = PyPDF2.PdfWriter()
                            
                            # Copy each page with all content
                            for page_num in range(len(test_reader.pages)):
                                page = test_reader.pages[page_num]
                                writer.add_page(page)
                            
                            # Copy metadata
                            if hasattr(test_reader, 'metadata') and test_reader.metadata:
                                writer.add_metadata(test_reader.metadata)
                            
                            output_data = BytesIO()
                            writer.write(output_data)
                            
                            return {
                                "success": True,
                                "output_data": base64.b64encode(output_data.getvalue()).decode('utf-8'),
                                "message": f"Password removed: '{pwd}'",
                                "password_used": pwd,
                                "pages_count": len(test_reader.pages),
                                "method": "PyPDF2 Content Preserve"
                            }
                            
                except Exception:
                    continue
            
            return {"success": False, "method": "PyPDF2"}
            
    except ImportError:
        return {"success": False, "error": "PyPDF2 not available"}
    except Exception as e:
        return {"success": False, "error": f"PyPDF2 preserve failed: {str(e)}"}

def try_pikepdf_preserve(pdf_path):
    """pikepdf with content preservation focus"""
    try:
        import pikepdf
        
        # Try opening without password
        try:
            with pikepdf.open(pdf_path) as pdf:
                # Create clean copy preserving everything
                output_path = pdf_path + "_pikepdf_clean.pdf"
                pdf.save(output_path, preserve_pdfa=True, object_stream_mode=pikepdf.ObjectStreamMode.preserve)
                
                with open(output_path, 'rb') as f:
                    output_bytes = f.read()
                os.unlink(output_path)
                
                return {
                    "success": True,
                    "output_data": base64.b64encode(output_bytes).decode('utf-8'),
                    "message": "PDF processed (was not encrypted)",
                    "pages_count": len(pdf.pages),
                    "method": "pikepdf Content Preserve"
                }
                
        except pikepdf.PasswordError:
            # Try comprehensive passwords
            passwords = [
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
                "Test", "TEST", "Demo", "DEMO", "Root", "ROOT", "Guest", "GUEST"
            ]
            
            for pwd in passwords:
                try:
                    with pikepdf.open(pdf_path, password=pwd) as pdf:
                        # Save with content preservation
                        output_path = pdf_path + "_pikepdf_unlocked.pdf"
                        pdf.save(output_path, preserve_pdfa=True, object_stream_mode=pikepdf.ObjectStreamMode.preserve)
                        
                        with open(output_path, 'rb') as f:
                            output_bytes = f.read()
                        os.unlink(output_path)
                        
                        return {
                            "success": True,
                            "output_data": base64.b64encode(output_bytes).decode('utf-8'),
                            "message": f"Password removed: '{pwd}'",
                            "password_used": pwd,
                            "pages_count": len(pdf.pages),
                            "method": "pikepdf Content Preserve"
                        }
                        
                except Exception:
                    continue
            
            return {"success": False, "method": "pikepdf"}
            
    except ImportError:
        return {"success": False, "error": "pikepdf not available"}
    except Exception as e:
        return {"success": False, "error": f"pikepdf preserve failed: {str(e)}"}

def try_pymupdf_preserve(pdf_path):
    """PyMuPDF with conservative content preservation"""
    try:
        import fitz
        
        # Try opening without password
        try:
            doc = fitz.open(pdf_path)
            if not doc.needs_pass:
                # Create clean copy with maximum preservation
                output_path = pdf_path + "_mupdf_clean.pdf"
                doc.save(output_path, 
                        garbage=0,  # Don't remove anything
                        deflate=False,  # Don't compress
                        clean=False,  # Don't clean
                        incremental=False,
                        linear=False)
                
                with open(output_path, 'rb') as f:
                    output_bytes = f.read()
                os.unlink(output_path)
                doc.close()
                
                return {
                    "success": True,
                    "output_data": base64.b64encode(output_bytes).decode('utf-8'),
                    "message": "PDF processed (was not encrypted)",
                    "pages_count": doc.page_count,
                    "method": "PyMuPDF Content Preserve"
                }
            doc.close()
        except Exception:
            pass
        
        # Try comprehensive password cracking
        passwords = [
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
            "Test", "TEST", "Demo", "DEMO", "Root", "ROOT", "Guest", "GUEST"
        ]
        
        for pwd in passwords:
            try:
                doc = fitz.open(pdf_path)
                if doc.authenticate(pwd):
                    # Save with conservative settings
                    output_path = pdf_path + "_mupdf_unlocked.pdf"
                    doc.save(output_path, 
                            garbage=0,  # Don't remove anything
                            deflate=False,  # Don't compress
                            clean=False,  # Don't clean
                            incremental=False,
                            linear=False)
                    
                    with open(output_path, 'rb') as f:
                        output_bytes = f.read()
                    os.unlink(output_path)
                    doc.close()
                    
                    return {
                        "success": True,
                        "output_data": base64.b64encode(output_bytes).decode('utf-8'),
                        "message": f"Password removed: '{pwd}'",
                        "password_used": pwd,
                        "pages_count": doc.page_count,
                        "method": "PyMuPDF Content Preserve"
                    }
                doc.close()
            except Exception:
                continue
        
        return {"success": False, "method": "PyMuPDF"}
        
    except ImportError:
        return {"success": False, "error": "PyMuPDF not available"}
    except Exception as e:
        return {"success": False, "error": f"PyMuPDF preserve failed: {str(e)}"}

def main():
    """Main function for command line usage"""
    try:
        input_data = json.loads(sys.stdin.read())
        pdf_data = input_data.get('pdf_data')
        
        if not pdf_data:
            print(json.dumps({"success": False, "error": "No PDF data provided"}))
            return
        
        result = preserve_content_crack(pdf_data)
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"success": False, "error": f"Main function failed: {str(e)}"}))

if __name__ == "__main__":
    main()