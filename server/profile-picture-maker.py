#!/usr/bin/env python3
"""
Profile Picture Maker Tool - Advanced profile picture editing with styles, effects, and backgrounds
"""

import os
import sys
import json
import time
import base64
import tempfile
from io import BytesIO
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageOps
import numpy as np

def apply_abstract_style(image, style_variant=1):
    """Apply abstract artistic effects to the image"""
    try:
        if style_variant == 1:
            # Posterize effect
            image = ImageOps.posterize(image, 3)
            # Add slight blur
            image = image.filter(ImageFilter.GaussianBlur(radius=0.5))
        elif style_variant == 2:
            # High contrast with color quantization
            enhancer = ImageEnhance.Contrast(image)
            image = enhancer.enhance(2.0)
            image = image.quantize(colors=16)
            image = image.convert('RGB')
        elif style_variant == 3:
            # Edge enhance with color shifts
            image = image.filter(ImageFilter.EDGE_ENHANCE_MORE)
            enhancer = ImageEnhance.Color(image)
            image = enhancer.enhance(1.5)
        else:
            # Smooth with brightness boost
            image = image.filter(ImageFilter.SMOOTH_MORE)
            enhancer = ImageEnhance.Brightness(image)
            image = enhancer.enhance(1.2)
        
        return image
    except Exception as e:
        print(f"Abstract style error: {e}")
        return image

def apply_bw_style(image, style_variant=1):
    """Apply black and white effects with different variations"""
    try:
        if style_variant == 1:
            # Classic B&W
            image = ImageOps.grayscale(image)
            image = image.convert('RGB')
        elif style_variant == 2:
            # High contrast B&W
            image = ImageOps.grayscale(image)
            enhancer = ImageEnhance.Contrast(image)
            image = enhancer.enhance(2.5)
            image = image.convert('RGB')
        elif style_variant == 3:
            # Soft B&W with slight sepia
            image = ImageOps.grayscale(image)
            # Convert to sepia
            sepia_image = Image.new('RGB', image.size)
            sepia_pixels = []
            for pixel in image.getdata():
                gray = pixel if isinstance(pixel, int) else pixel[0]
                sepia_pixels.append((gray, int(gray * 0.8), int(gray * 0.6)))
            sepia_image.putdata(sepia_pixels)
            image = sepia_image
        else:
            # Dramatic B&W with vignette
            image = ImageOps.grayscale(image)
            enhancer = ImageEnhance.Contrast(image)
            image = enhancer.enhance(1.8)
            image = image.convert('RGB')
            
        return image
    except Exception as e:
        print(f"B&W style error: {e}")
        return image

def apply_bordered_style(image, style_variant=1, border_size=10, border_color=(255, 255, 255)):
    """Apply bordered effects with different variations"""
    try:
        if style_variant == 1:
            # Simple solid border
            image = ImageOps.expand(image, border=border_size, fill=border_color)
        elif style_variant == 2:
            # Double border
            image = ImageOps.expand(image, border=border_size//2, fill=(0, 0, 0))
            image = ImageOps.expand(image, border=border_size//2, fill=border_color)
        elif style_variant == 3:
            # Rounded corner border
            image = ImageOps.expand(image, border=border_size, fill=border_color)
            # Create rounded corners
            mask = Image.new('L', image.size, 0)
            draw = ImageDraw.Draw(mask)
            draw.rounded_rectangle([0, 0, image.size[0], image.size[1]], radius=20, fill=255)
            
            output = Image.new('RGBA', image.size, (0, 0, 0, 0))
            output.paste(image, (0, 0))
            output.putalpha(mask)
            image = output
        else:
            # Shadow border
            shadow = Image.new('RGBA', (image.size[0] + border_size*2, image.size[1] + border_size*2), (0, 0, 0, 50))
            image = ImageOps.expand(image, border=border_size, fill=border_color)
            
        return image
    except Exception as e:
        print(f"Bordered style error: {e}")
        return image

def create_canvas_shape(image, canvas_type, target_size=(400, 400)):
    """Create different canvas shapes"""
    try:
        if canvas_type == 'square':
            # Square canvas
            size = min(target_size)
            image = image.resize((size, size), Image.Resampling.LANCZOS)
        elif canvas_type == '4:5':
            # 4:5 aspect ratio
            width = int(target_size[0])
            height = int(target_size[0] * 5/4)
            image = image.resize((width, height), Image.Resampling.LANCZOS)
        elif canvas_type == 'rounded':
            # Rounded rectangle
            size = min(target_size)
            image = image.resize((size, size), Image.Resampling.LANCZOS)
            
            mask = Image.new('L', (size, size), 0)
            draw = ImageDraw.Draw(mask)
            draw.rounded_rectangle([0, 0, size, size], radius=size//8, fill=255)
            
            output = Image.new('RGBA', (size, size), (0, 0, 0, 0))
            output.paste(image, (0, 0))
            output.putalpha(mask)
            image = output
        elif canvas_type == 'circle':
            # Circular canvas
            size = min(target_size)
            image = image.resize((size, size), Image.Resampling.LANCZOS)
            
            mask = Image.new('L', (size, size), 0)
            draw = ImageDraw.Draw(mask)
            draw.ellipse([0, 0, size, size], fill=255)
            
            output = Image.new('RGBA', (size, size), (0, 0, 0, 0))
            output.paste(image, (0, 0))
            output.putalpha(mask)
            image = output
        elif canvas_type == 'viber':
            # Viber-style rounded square with more pronounced corners
            size = min(target_size)
            image = image.resize((size, size), Image.Resampling.LANCZOS)
            
            mask = Image.new('L', (size, size), 0)
            draw = ImageDraw.Draw(mask)
            draw.rounded_rectangle([0, 0, size, size], radius=size//4, fill=255)
            
            output = Image.new('RGBA', (size, size), (0, 0, 0, 0))
            output.paste(image, (0, 0))
            output.putalpha(mask)
            image = output
        
        return image
    except Exception as e:
        print(f"Canvas shape error: {e}")
        return image

def apply_background(image, bg_type, bg_color=(255, 255, 255), gradient_colors=None, pattern_type=None):
    """Apply different background types"""
    try:
        if image.mode != 'RGBA':
            image = image.convert('RGBA')
            
        if bg_type == 'solid':
            background = Image.new('RGBA', image.size, bg_color + (255,))
        elif bg_type == 'gradient' and gradient_colors:
            # Create gradient background
            background = Image.new('RGBA', image.size, gradient_colors[0] + (255,))
            draw = ImageDraw.Draw(background)
            
            # Simple vertical gradient
            for y in range(image.size[1]):
                ratio = y / image.size[1]
                r = int(gradient_colors[0][0] * (1 - ratio) + gradient_colors[1][0] * ratio)
                g = int(gradient_colors[0][1] * (1 - ratio) + gradient_colors[1][1] * ratio)
                b = int(gradient_colors[0][2] * (1 - ratio) + gradient_colors[1][2] * ratio)
                draw.line([(0, y), (image.size[0], y)], fill=(r, g, b, 255))
        elif bg_type == 'pattern':
            # Create patterned background
            background = Image.new('RGBA', image.size, (240, 240, 240, 255))
            draw = ImageDraw.Draw(background)
            
            if pattern_type == 'dots':
                for x in range(0, image.size[0], 20):
                    for y in range(0, image.size[1], 20):
                        draw.ellipse([x-2, y-2, x+2, y+2], fill=(200, 200, 200, 255))
            elif pattern_type == 'lines':
                for x in range(0, image.size[0], 15):
                    draw.line([(x, 0), (x, image.size[1])], fill=(220, 220, 220, 255), width=1)
            else:
                # Default checker pattern
                for x in range(0, image.size[0], 30):
                    for y in range(0, image.size[1], 30):
                        if (x//30 + y//30) % 2:
                            draw.rectangle([x, y, x+30, y+30], fill=(230, 230, 230, 255))
        else:
            background = Image.new('RGBA', image.size, (255, 255, 255, 255))
        
        # Composite image over background
        result = Image.alpha_composite(background, image)
        return result.convert('RGB')
    except Exception as e:
        print(f"Background error: {e}")
        return image.convert('RGB')

def apply_adjustments(image, brightness=1.0, contrast=1.0, saturation=1.0, hue=0):
    """Apply photo adjustments"""
    try:
        if brightness != 1.0:
            enhancer = ImageEnhance.Brightness(image)
            image = enhancer.enhance(brightness)
            
        if contrast != 1.0:
            enhancer = ImageEnhance.Contrast(image)
            image = enhancer.enhance(contrast)
            
        if saturation != 1.0:
            enhancer = ImageEnhance.Color(image)
            image = enhancer.enhance(saturation)
            
        # Hue adjustment (simplified)
        if hue != 0:
            image = image.convert('HSV')
            np_image = np.array(image)
            np_image[:, :, 0] = (np_image[:, :, 0] + hue) % 180
            image = Image.fromarray(np_image, 'HSV').convert('RGB')
            
        return image
    except Exception as e:
        print(f"Adjustments error: {e}")
        return image

def transform_image(image, zoom=1.0, rotation=0, flip_h=False, flip_v=False, position_x=0, position_y=0):
    """Apply transformations to the image"""
    try:
        original_size = image.size
        
        # Apply zoom
        if zoom != 1.0:
            new_size = (int(original_size[0] * zoom), int(original_size[1] * zoom))
            image = image.resize(new_size, Image.Resampling.LANCZOS)
        
        # Apply rotation
        if rotation != 0:
            image = image.rotate(rotation, expand=True, fillcolor=(0, 0, 0, 0))
        
        # Apply flips
        if flip_h:
            image = image.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        if flip_v:
            image = image.transpose(Image.Transpose.FLIP_TOP_BOTTOM)
        
        # Apply position adjustment by creating a new canvas
        if position_x != 0 or position_y != 0:
            canvas = Image.new('RGBA', original_size, (0, 0, 0, 0))
            paste_x = (original_size[0] - image.size[0]) // 2 + position_x
            paste_y = (original_size[1] - image.size[1]) // 2 + position_y
            canvas.paste(image, (paste_x, paste_y))
            image = canvas
        
        return image
    except Exception as e:
        print(f"Transform error: {e}")
        return image

def process_profile_picture(image_data, options):
    """Main processing function for profile picture creation"""
    start_time = time.time()
    
    try:
        # Parse options
        style_type = options.get('style_type', 'none')
        style_variant = int(options.get('style_variant', 1))
        canvas_type = options.get('canvas_type', 'square')
        
        # Transform options
        zoom = float(options.get('zoom', 1.0))
        rotation = float(options.get('rotation', 0))
        flip_h = options.get('flip_h', False)
        flip_v = options.get('flip_v', False)
        position_x = int(options.get('position_x', 0))
        position_y = int(options.get('position_y', 0))
        
        # Background options
        bg_type = options.get('bg_type', 'solid')
        bg_color = tuple(options.get('bg_color', [255, 255, 255]))
        gradient_colors = options.get('gradient_colors')
        pattern_type = options.get('pattern_type')
        
        # Border options
        border_size = int(options.get('border_size', 0))
        border_color = tuple(options.get('border_color', [255, 255, 255]))
        
        # Adjustment options
        brightness = float(options.get('brightness', 1.0))
        contrast = float(options.get('contrast', 1.0))
        saturation = float(options.get('saturation', 1.0))
        hue = float(options.get('hue', 0))
        
        # Canvas size
        canvas_width = int(options.get('canvas_width', 400))
        canvas_height = int(options.get('canvas_height', 400))
        
        # Load and process image
        image = Image.open(BytesIO(image_data))
        if image.mode != 'RGBA':
            image = image.convert('RGBA')
        
        # Get original image info
        original_size = image.size
        original_format = image.format or "Unknown"
        
        # Apply transformations first
        image = transform_image(image, zoom, rotation, flip_h, flip_v, position_x, position_y)
        
        # Apply photo adjustments
        image = apply_adjustments(image, brightness, contrast, saturation, hue)
        
        # Apply style effects
        if style_type == 'abstract':
            image = apply_abstract_style(image, style_variant)
        elif style_type == 'bw':
            image = apply_bw_style(image, style_variant)
        elif style_type == 'bordered':
            image = apply_bordered_style(image, style_variant, border_size, border_color)
        
        # Create canvas shape
        image = create_canvas_shape(image, canvas_type, (canvas_width, canvas_height))
        
        # Apply background
        image = apply_background(image, bg_type, bg_color, gradient_colors, pattern_type)
        
        # Convert to base64 for output
        output_buffer = BytesIO()
        image.save(output_buffer, format='PNG', quality=95)
        output_buffer.seek(0)
        
        img_base64 = base64.b64encode(output_buffer.getvalue()).decode()
        output_url = f"data:image/png;base64,{img_base64}"
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return {
            "success": True,
            "output_url": output_url,
            "original_size": list(original_size),
            "output_size": list(image.size),
            "original_format": original_format,
            "output_format": "PNG",
            "processing_time": processing_time,
            "applied_effects": {
                "style": f"{style_type}_{style_variant}" if style_type != 'none' else 'none',
                "canvas": canvas_type,
                "background": bg_type,
                "adjustments": {
                    "brightness": brightness,
                    "contrast": contrast,
                    "saturation": saturation,
                    "hue": hue
                },
                "transforms": {
                    "zoom": zoom,
                    "rotation": rotation,
                    "flip_h": flip_h,
                    "flip_v": flip_v
                }
            }
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Profile picture processing error: {str(e)}"
        }

def generate_practice_sheet(image_data, options):
    """Generate A4 practice sheet with repeated profile pictures"""
    try:
        # A4 size in pixels (300 DPI)
        a4_width, a4_height = 2480, 3508
        
        # Process the profile picture first
        result = process_profile_picture(image_data, options)
        if not result['success']:
            return result
        
        # Decode the processed image
        base64_data = result['output_url'].split(',')[1]
        processed_image = Image.open(BytesIO(base64.b64decode(base64_data)))
        
        # Calculate grid layout
        profile_size = 200  # Size of each profile in the sheet
        margin = 50
        cols = (a4_width - 2 * margin) // (profile_size + margin)
        rows = (a4_height - 2 * margin) // (profile_size + margin)
        
        # Create A4 canvas
        a4_canvas = Image.new('RGB', (a4_width, a4_height), (255, 255, 255))
        
        # Resize profile picture
        profile_resized = processed_image.resize((profile_size, profile_size), Image.Resampling.LANCZOS)
        
        # Place profiles in grid
        for row in range(rows):
            for col in range(cols):
                x = margin + col * (profile_size + margin)
                y = margin + row * (profile_size + margin)
                a4_canvas.paste(profile_resized, (x, y))
        
        # Convert to base64
        output_buffer = BytesIO()
        a4_canvas.save(output_buffer, format='PDF', quality=95)
        output_buffer.seek(0)
        
        pdf_base64 = base64.b64encode(output_buffer.getvalue()).decode()
        
        return {
            "success": True,
            "practice_sheet_url": f"data:application/pdf;base64,{pdf_base64}",
            "grid_layout": f"{rows}x{cols}",
            "total_profiles": rows * cols
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Practice sheet generation error: {str(e)}"
        }

def main():
    """Main function for command line usage"""
    if len(sys.argv) < 3:
        print("Usage: python profile-picture-maker.py <image_file> '<options_json>'")
        sys.exit(1)
    
    image_path = sys.argv[1]
    options_json = sys.argv[2]
    
    if not os.path.exists(image_path):
        print(json.dumps({"success": False, "error": "Image file not found"}))
        sys.exit(1)
    
    try:
        options = json.loads(options_json)
        
        with open(image_path, 'rb') as f:
            image_data = f.read()
        
        if options.get('generate_practice_sheet'):
            result = generate_practice_sheet(image_data, options)
        else:
            result = process_profile_picture(image_data, options)
            
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()