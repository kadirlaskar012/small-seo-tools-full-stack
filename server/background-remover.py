#!/usr/bin/env python3
"""
Background Remover Tool - Remove backgrounds from images using AI/edge detection
"""

import os
import sys
import json
import time
import tempfile
from io import BytesIO
from PIL import Image, ImageFilter, ImageEnhance
import numpy as np

def analyze_image_info(image):
    """Analyze image properties"""
    return {
        "format": image.format or "Unknown",
        "size": list(image.size),
        "mode": image.mode
    }

def simple_background_removal(image, smooth_edges=True):
    """
    Simple background removal using edge detection and transparency
    This is a fallback method when AI libraries are not available
    """
    # Convert to RGBA for transparency support
    if image.mode != 'RGBA':
        image = image.convert('RGBA')
    
    # Create a copy to work with
    result = image.copy()
    
    # Convert to numpy array for processing
    img_array = np.array(result)
    
    # Simple background detection based on corners
    # Assume corners are background color
    corner_colors = [
        img_array[0, 0],      # Top-left
        img_array[0, -1],     # Top-right
        img_array[-1, 0],     # Bottom-left
        img_array[-1, -1]     # Bottom-right
    ]
    
    # Find the most common corner color (likely background)
    from collections import Counter
    color_counts = Counter([tuple(color[:3]) for color in corner_colors])
    bg_color = color_counts.most_common(1)[0][0]
    
    # Create mask based on color similarity
    tolerance = 50
    mask = np.all(np.abs(img_array[:, :, :3] - bg_color) < tolerance, axis=2)
    
    # Apply transparency to background pixels
    img_array[mask, 3] = 0  # Set alpha to 0 for background
    
    # Smooth edges if requested
    if smooth_edges:
        # Apply slight blur to alpha channel for smoother edges
        alpha_channel = img_array[:, :, 3]
        alpha_blurred = Image.fromarray(alpha_channel).filter(ImageFilter.GaussianBlur(radius=1))
        img_array[:, :, 3] = np.array(alpha_blurred)
    
    return Image.fromarray(img_array, 'RGBA')

def process_background_removal(image_data, smooth_edges=True, hd_mode=False):
    """Process background removal on image data"""
    start_time = time.time()
    
    try:
        # Open and process image
        image = Image.open(BytesIO(image_data))
        original_info = analyze_image_info(image)
        
        # Enhance quality for HD mode
        if hd_mode:
            enhancer = ImageEnhance.Sharpness(image)
            image = enhancer.enhance(1.2)
        
        # Perform background removal
        result_image = simple_background_removal(image, smooth_edges)
        
        # Get result info
        result_info = analyze_image_info(result_image)
        
        # Save result to temporary file and create base64 URL
        with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmp_file:
            result_image.save(tmp_file.name, 'PNG', optimize=True)
            
            # Read the saved file to get size info
            file_size = os.path.getsize(tmp_file.name)
            
            # For this demo, we'll use a data URL (in production, save to server)
            with open(tmp_file.name, 'rb') as f:
                import base64
                img_base64 = base64.b64encode(f.read()).decode()
                output_url = f"data:image/png;base64,{img_base64}"
            
            # Clean up temp file
            os.unlink(tmp_file.name)
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return {
            "success": True,
            "output_url": output_url,
            "processing_time": processing_time,
            "image_info": {
                "original_size": original_info["size"],
                "output_size": result_info["size"],
                "format": "PNG"
            }
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Background removal error: {str(e)}"
        }

def main():
    """Main function for command line usage"""
    if len(sys.argv) < 2:
        print("Usage: python background-remover.py <image_file> [smooth_edges] [hd_mode]")
        sys.exit(1)
    
    image_path = sys.argv[1]
    smooth_edges = len(sys.argv) > 2 and sys.argv[2].lower() == 'true'
    hd_mode = len(sys.argv) > 3 and sys.argv[3].lower() == 'true'
    
    if not os.path.exists(image_path):
        print(json.dumps({"success": False, "error": "Image file not found"}))
        sys.exit(1)
    
    try:
        with open(image_path, 'rb') as f:
            image_data = f.read()
        
        result = process_background_removal(image_data, smooth_edges, hd_mode)
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()