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
        
        # Comprehensive password dictionary - 2000+ common passwords
        passwords = [""]  # Try empty password first
        
        # Top 100 most common passwords
        common_passwords = [
            "123456", "password", "123456789", "12345678", "12345", "qwerty", 
            "abc123", "111111", "1234567", "password1", "admin", "1234567890",
            "123123", "000000", "iloveyou", "1234", "1q2w3e4r5t", "qwertyuiop",
            "123", "monkey", "dragon", "654321", "mustang", "letmein", "baseball",
            "shadow", "master", "666666", "qwertyui", "123321", "1qaz2wsx",
            "password123", "1q2w3e", "aa123456", "soccer", "princess", "charlie",
            "access", "121212", "flower", "555555", "loveme", "hello", "red123",
            "starwars", "klaster", "112233", "george", "computer", "michelle",
            "jessica", "pepper", "1111", "zxcvbnm", "555666", "11111111",
            "131313", "freedom", "777777", "pass", "maggie", "159753", "aaaaaa",
            "ginger", "princess1", "joshua", "cheese", "amanda", "summer",
            "love", "ashley", "6969", "nicole", "chelsea", "biteme", "matthew",
            "access14", "yankees", "987654321", "dallas", "austin", "thunder",
            "taylor", "matrix", "william", "corvette", "hello123", "martin",
            "zxcvbn", "trustno1", "killer", "welcome", "jordan", "aaaaaa",
            "123qwe", "football", "monkey1", "liverpool", "buster", "daniel",
            "banana", "robert", "tiger", "beauty", "pokemon", "sophie",
            "melissa", "gateway", "mickey", "angel", "junior", "nathan",
            "11223344", "654321", "love123", "purple"
        ]
        passwords.extend(common_passwords)
        
        # Document-specific passwords
        doc_passwords = [
            "document", "pdf", "file", "secret", "private", "confidential",
            "protected", "secure", "locked", "hidden", "restricted", "internal",
            "draft", "final", "copy", "backup", "archive", "report", "data",
            "info", "contract", "agreement", "invoice", "receipt", "statement",
            "proposal", "presentation", "manual", "guide", "handbook", "policy"
        ]
        passwords.extend(doc_passwords)
        
        # Years and dates (last 30 years)
        current_year = datetime.now().year
        for year in range(current_year - 30, current_year + 1):
            passwords.extend([str(year), f"password{year}", f"admin{year}"])
        
        # Common number patterns
        number_patterns = [
            "000000", "111111", "222222", "333333", "444444", "555555",
            "666666", "777777", "888888", "999999", "010203", "112233",
            "123123", "321321", "456789", "987654", "147258", "852741",
            "159357", "753159", "147852", "258963", "369258", "741852"
        ]
        passwords.extend(number_patterns)
        
        # Common phrases and words
        common_words = [
            "welcome", "hello", "test", "demo", "sample", "example", "default",
            "guest", "user", "public", "temp", "temporary", "backup", "main",
            "home", "office", "work", "personal", "family", "business",
            "company", "corporation", "organization", "department", "team",
            "project", "client", "customer", "vendor", "supplier", "partner"
        ]
        passwords.extend(common_words)
        
        # Keyboard patterns
        keyboard_patterns = [
            "qwerty", "qwertyui", "qwertyuiop", "asdf", "asdfgh", "asdfghjk",
            "asdfghjkl", "zxcv", "zxcvb", "zxcvbn", "zxcvbnm", "1qaz2wsx",
            "1q2w3e", "1q2w3e4r", "1q2w3e4r5t", "qwe123", "asd123", "zxc123",
            "qaz123", "wsx123", "edc123", "rfv123", "tgb123", "yhn123",
            "ujm123", "ik,123", "ol.123", "p;/123"
        ]
        passwords.extend(keyboard_patterns)
        
        # Name variations
        names = [
            "john", "jane", "mike", "mary", "david", "sarah", "chris", "lisa",
            "james", "anna", "robert", "emily", "michael", "jessica", "william",
            "ashley", "richard", "amanda", "thomas", "melissa", "charles",
            "stephanie", "daniel", "nicole", "matthew", "elizabeth", "anthony",
            "helen", "mark", "michelle", "donald", "kimberly", "steven",
            "donna", "paul", "carol", "andrew", "ruth", "joshua", "sharon"
        ]
        for name in names:
            passwords.extend([
                name, name.capitalize(), name.upper(),
                f"{name}123", f"{name}1", f"{name}2021", f"{name}2022",
                f"{name}2023", f"{name}2024", f"{name}01", f"{name}12"
            ])
        
        # Color and animal patterns
        colors_animals = [
            "red", "blue", "green", "yellow", "black", "white", "orange",
            "purple", "pink", "brown", "gray", "silver", "gold", "cat",
            "dog", "bird", "fish", "lion", "tiger", "bear", "wolf", "fox",
            "rabbit", "mouse", "horse", "cow", "pig", "duck", "chicken"
        ]
        for word in colors_animals:
            passwords.extend([
                word, word.capitalize(), f"{word}123", f"{word}1",
                f"{word}{current_year}", f"{word}2023", f"{word}password"
            ])
        
        # Company and organization names
        orgs = [
            "company", "corp", "inc", "ltd", "llc", "group", "systems",
            "solutions", "services", "consulting", "technologies", "enterprise",
            "global", "international", "national", "local", "regional"
        ]
        passwords.extend(orgs)
        
        # Month and day patterns
        months = [
            "january", "february", "march", "april", "may", "june",
            "july", "august", "september", "october", "november", "december",
            "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"
        ]
        days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
                "mon", "tue", "wed", "thu", "fri", "sat", "sun"]
        passwords.extend(months + days)
        
        # Special character combinations
        special_combos = [
            "!@#$", "1234!", "password!", "admin!", "qwerty!", "123456!",
            "password#", "admin#", "test123!", "welcome1!", "hello123!",
            "pass123", "admin123", "user123", "guest123", "demo123"
        ]
        passwords.extend(special_combos)
        
        # Add user hint if provided
        if password_hint:
            passwords.insert(0, password_hint)
        
        # Generate case variations and substitutions for top passwords
        enhanced_passwords = []
        top_base_passwords = [
            "password", "123456", "admin", "document", "pdf", "secret", 
            "private", "qwerty", "abc123", "welcome", "hello", "test"
        ]
        
        for base_pwd in top_base_passwords:
            # Case variations
            enhanced_passwords.extend([
                base_pwd.lower(),
                base_pwd.upper(), 
                base_pwd.capitalize(),
                base_pwd.swapcase()
            ])
            
            # Common substitutions (leet speak)
            substituted = base_pwd.replace('a', '@').replace('e', '3').replace('i', '1').replace('o', '0').replace('s', '$')
            enhanced_passwords.append(substituted)
            
            # Number combinations
            for num in ['1', '12', '123', '1234', '01', '2024', '2023', '!']:
                enhanced_passwords.extend([
                    f"{base_pwd}{num}",
                    f"{num}{base_pwd}",
                    f"{base_pwd.capitalize()}{num}"
                ])
        
        # Insert enhanced passwords at the beginning for priority testing
        passwords = enhanced_passwords + passwords
        
        # Remove duplicates while preserving order
        seen = set()
        unique_passwords = []
        for pwd in passwords:
            if pwd not in seen:
                seen.add(pwd)
                unique_passwords.append(pwd)
        passwords = unique_passwords
        
        # Add short brute force patterns (1-4 characters for speed)
        brute_force_patterns = []
        
        # Single digits and letters
        for i in range(10):
            brute_force_patterns.append(str(i))
        for c in 'abcdefghijklmnopqrstuvwxyz':
            brute_force_patterns.extend([c, c.upper()])
        
        # 2-character combinations (most common)
        common_2char = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '99', 'aa', 'ab', 'bb', 'cc', 'dd', 'ee', 'ff', 'gg', 'hh', 'ii', 'jj', 'kk', 'll', 'mm', 'nn', 'oo', 'pp', 'qq', 'rr', 'ss', 'tt', 'uu', 'vv', 'ww', 'xx', 'yy', 'zz', 'AA', 'BB', 'CC', 'DD', 'EE', 'FF', 'GG', 'HH', 'II', 'JJ', 'KK', 'LL', 'MM', 'NN', 'OO', 'PP', 'QQ', 'RR', 'SS', 'TT', 'UU', 'VV', 'WW', 'XX', 'YY', 'ZZ']
        brute_force_patterns.extend(common_2char)
        
        # 3-character combinations (high-probability)
        common_3char = ['000', '001', '002', '111', '123', '222', '333', '444', '555', '666', '777', '888', '999', 'abc', 'xyz', 'qwe', 'asd', 'zxc', 'pwd', 'key', 'doc', 'pdf', 'new', 'old', 'tmp', 'test', 'demo', 'user', 'pass', 'login', 'auth', 'root', 'home', 'data', 'file', 'code', 'work', 'main', 'core', 'base', 'info', 'help', 'save', 'open', 'edit', 'view', 'read', 'copy', 'move', 'done']
        brute_force_patterns.extend(common_3char)
        
        # 4-character combinations (selective)
        common_4char = ['0000', '0001', '0123', '1111', '1234', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', 'abcd', 'qwer', 'asdf', 'zxcv', 'pass', 'word', 'user', 'admin', 'root', 'test', 'demo', 'main', 'home', 'work', 'file', 'data', 'info', 'help', 'save', 'open', 'edit', 'view', 'read', 'copy', 'move', 'done', 'quit', 'exit', 'back', 'next', 'prev', 'stop', 'start', 'play', 'pause']
        brute_force_patterns.extend(common_4char)
        
        # Add brute force patterns to the beginning for quick testing
        passwords = brute_force_patterns + passwords
        
        # Remove duplicates again
        seen = set()
        unique_passwords = []
        for pwd in passwords:
            if pwd not in seen:
                seen.add(pwd)
                unique_passwords.append(pwd)
        passwords = unique_passwords
        
        # Limit to reasonable size for 30-second timeout
        passwords = passwords[:3000]  # Test up to 3000 passwords
        
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