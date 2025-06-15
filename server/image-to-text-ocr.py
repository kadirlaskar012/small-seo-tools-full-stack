#!/usr/bin/env python3
"""
Image to Text OCR Tool - Extract text from images using Tesseract OCR
"""

import os
import sys
import json
import time
import tempfile
from io import BytesIO
from PIL import Image
import pytesseract

def analyze_image_info(image):
    """Analyze image properties"""
    return {
        "format": image.format or "Unknown",
        "size": list(image.size),
        "mode": image.mode
    }

def count_words_and_chars(text):
    """Count words and characters in extracted text"""
    words = len(text.split()) if text.strip() else 0
    chars = len(text)
    return words, chars

def detect_language(text):
    """Simple language detection based on character patterns"""
    if not text.strip():
        return "unknown"
    
    # Simple heuristics
    ascii_count = sum(1 for c in text if ord(c) < 128)
    total_chars = len(text)
    
    if total_chars == 0:
        return "unknown"
    
    ascii_ratio = ascii_count / total_chars
    
    if ascii_ratio > 0.9:
        return "en"  # Likely English
    else:
        return "mixed"  # Mixed or non-English

def estimate_confidence(text, image_size):
    """Estimate OCR confidence based on text quality and image size"""
    if not text.strip():
        return 0
    
    # Base confidence
    confidence = 70
    
    # Adjust based on image size
    width, height = image_size
    pixel_count = width * height
    
    if pixel_count > 1000000:  # Large image
        confidence += 10
    elif pixel_count < 100000:  # Small image
        confidence -= 20
    
    # Adjust based on text characteristics
    word_count = len(text.split())
    if word_count > 10:
        confidence += 5
    
    # Check for common OCR artifacts
    if '?' in text or '|' in text or text.count(' ') / len(text) > 0.3:
        confidence -= 15
    
    return max(0, min(100, confidence))

def process_ocr(image_data):
    """Process OCR on image data"""
    start_time = time.time()
    
    try:
        # Open and process image
        image = Image.open(BytesIO(image_data))
        
        # Convert to RGB if necessary
        if image.mode in ('RGBA', 'LA', 'P'):
            image = image.convert('RGB')
        
        # Get image info
        image_info = analyze_image_info(image)
        
        # Perform OCR
        try:
            extracted_text = pytesseract.image_to_string(image, config='--psm 6')
        except Exception as ocr_error:
            return {
                "success": False,
                "error": f"OCR processing failed: {str(ocr_error)}"
            }
        
        # Analyze results
        word_count, char_count = count_words_and_chars(extracted_text)
        language = detect_language(extracted_text)
        confidence = estimate_confidence(extracted_text, image.size)
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return {
            "success": True,
            "text": extracted_text,
            "confidence": confidence,
            "word_count": word_count,
            "char_count": char_count,
            "language": language,
            "processing_time": processing_time,
            "image_info": image_info
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Image processing error: {str(e)}"
        }

def main():
    """Main function for command line usage"""
    if len(sys.argv) != 2:
        print("Usage: python image-to-text-ocr.py <image_file>")
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    if not os.path.exists(image_path):
        print(json.dumps({"success": False, "error": "Image file not found"}))
        sys.exit(1)
    
    try:
        with open(image_path, 'rb') as f:
            image_data = f.read()
        
        result = process_ocr(image_data)
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()