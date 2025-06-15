#!/usr/bin/env python3
"""
Image DPI Converter Tool - Change image DPI resolution
"""

import os
import sys
import json
import time
import tempfile
from io import BytesIO
from PIL import Image

def get_image_dpi(image):
    """Get DPI information from image"""
    dpi = image.info.get('dpi')
    if dpi:
        return int(dpi[0])  # Return X DPI
    return None

def set_image_dpi(image, target_dpi):
    """Set DPI for image without changing pixel dimensions"""
    # Create a copy of the image
    result = image.copy()
    
    # Set DPI in image info
    result.info['dpi'] = (target_dpi, target_dpi)
    
    return result

def process_dpi_conversion(image_data, target_dpi):
    """Process DPI conversion on image data"""
    start_time = time.time()
    
    try:
        target_dpi = int(target_dpi)
        if target_dpi <= 0 or target_dpi > 2400:
            return {
                "success": False,
                "error": "DPI must be between 1 and 2400"
            }
        
        # Open and process image
        image = Image.open(BytesIO(image_data))
        original_dpi = get_image_dpi(image)
        original_size = image.size
        original_format = image.format or "JPEG"
        
        # Convert DPI
        result_image = set_image_dpi(image, target_dpi)
        
        # Save result to get file size comparison
        output_format = "JPEG" if original_format.upper() in ["JPEG", "JPG"] else "PNG"
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{output_format.lower()}') as tmp_file:
            if output_format == "JPEG":
                # Convert to RGB for JPEG
                if result_image.mode in ('RGBA', 'LA', 'P'):
                    result_image = result_image.convert('RGB')
                result_image.save(tmp_file.name, output_format, dpi=(target_dpi, target_dpi), quality=95)
            else:
                result_image.save(tmp_file.name, output_format, dpi=(target_dpi, target_dpi))
            
            # Get file sizes
            original_file_size = len(image_data)
            new_file_size = os.path.getsize(tmp_file.name)
            
            # Create base64 data URL for output
            with open(tmp_file.name, 'rb') as f:
                import base64
                img_base64 = base64.b64encode(f.read()).decode()
                output_url = f"data:image/{output_format.lower()};base64,{img_base64}"
            
            # Clean up temp file
            os.unlink(tmp_file.name)
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return {
            "success": True,
            "output_url": output_url,
            "original_dpi": original_dpi,
            "new_dpi": target_dpi,
            "original_size": list(original_size),
            "new_size": list(result_image.size),
            "file_size_original": original_file_size,
            "file_size_new": new_file_size,
            "format": output_format,
            "processing_time": processing_time
        }
        
    except ValueError:
        return {
            "success": False,
            "error": "Invalid DPI value. Please enter a number."
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"DPI conversion error: {str(e)}"
        }

def main():
    """Main function for command line usage"""
    if len(sys.argv) != 3:
        print("Usage: python image-dpi-converter.py <image_file> <target_dpi>")
        sys.exit(1)
    
    image_path = sys.argv[1]
    target_dpi = sys.argv[2]
    
    if not os.path.exists(image_path):
        print(json.dumps({"success": False, "error": "Image file not found"}))
        sys.exit(1)
    
    try:
        with open(image_path, 'rb') as f:
            image_data = f.read()
        
        result = process_dpi_conversion(image_data, target_dpi)
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()