#!/usr/bin/env python3
"""
WebP to JPG Converter Tool - Convert WebP images to JPG format
"""

import os
import sys
import json
import time
import tempfile
from io import BytesIO
from PIL import Image

def process_webp_conversion(image_data, compression_level="medium", quality=85):
    """Process WebP to JPG conversion on image data"""
    start_time = time.time()
    
    try:
        quality = int(quality)
        if quality < 1 or quality > 100:
            return {
                "success": False,
                "error": "Quality must be between 1 and 100"
            }
        
        # Open and process image
        image = Image.open(BytesIO(image_data))
        original_format = image.format or "WebP"
        original_size = image.size
        original_file_size = len(image_data)
        
        # Convert to RGB for JPEG (remove alpha channel if present)
        if image.mode in ('RGBA', 'LA', 'P'):
            # Create white background for transparent areas
            background = Image.new('RGB', image.size, (255, 255, 255))
            if image.mode == 'P':
                image = image.convert('RGBA')
            background.paste(image, mask=image.split()[-1] if image.mode == 'RGBA' else None)
            image = background
        elif image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Save as JPG with specified quality
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp_file:
            image.save(tmp_file.name, 'JPEG', quality=quality, optimize=True)
            
            # Get file size
            output_file_size = os.path.getsize(tmp_file.name)
            
            # Create base64 data URL for output
            with open(tmp_file.name, 'rb') as f:
                import base64
                img_base64 = base64.b64encode(f.read()).decode()
                output_url = f"data:image/jpeg;base64,{img_base64}"
            
            # Clean up temp file
            os.unlink(tmp_file.name)
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return {
            "success": True,
            "output_url": output_url,
            "original_format": original_format,
            "output_format": "JPEG",
            "original_size": list(original_size),
            "output_size": list(image.size),
            "file_size_original": original_file_size,
            "file_size_output": output_file_size,
            "compression_quality": quality,
            "processing_time": processing_time
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"WebP to JPG conversion error: {str(e)}"
        }

def main():
    """Main function for command line usage"""
    if len(sys.argv) < 2:
        print("Usage: python webp-to-jpg-converter.py <image_file> [compression_level] [quality]")
        sys.exit(1)
    
    image_path = sys.argv[1]
    compression_level = sys.argv[2] if len(sys.argv) > 2 else "medium"
    quality = sys.argv[3] if len(sys.argv) > 3 else "85"
    
    if not os.path.exists(image_path):
        print(json.dumps({"success": False, "error": "Image file not found"}))
        sys.exit(1)
    
    try:
        with open(image_path, 'rb') as f:
            image_data = f.read()
        
        result = process_webp_conversion(image_data, compression_level, quality)
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()