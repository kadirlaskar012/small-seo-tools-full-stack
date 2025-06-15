#!/usr/bin/env python3
"""
HTML to Markdown Converter Tool - Convert HTML content to Markdown format
"""

import sys
import json
import time
import re
from html2text import HTML2Text
from markdownify import markdownify as md

def count_html_elements(html_content):
    """Count various HTML elements in the content"""
    # Remove comments and CDATA
    html_clean = re.sub(r'<!--.*?-->', '', html_content, flags=re.DOTALL)
    html_clean = re.sub(r'<!\[CDATA\[.*?\]\]>', '', html_clean, flags=re.DOTALL)
    
    # Count different types of elements
    elements = {
        'total': len(re.findall(r'<[^/!][^>]*>', html_clean)),
        'links': len(re.findall(r'<a\s+[^>]*href=', html_clean, re.IGNORECASE)),
        'images': len(re.findall(r'<img\s+[^>]*src=', html_clean, re.IGNORECASE)),
        'headings': len(re.findall(r'<h[1-6][^>]*>', html_clean, re.IGNORECASE)),
        'paragraphs': len(re.findall(r'<p[^>]*>', html_clean, re.IGNORECASE)),
        'lists': len(re.findall(r'<[uo]l[^>]*>', html_clean, re.IGNORECASE)),
        'tables': len(re.findall(r'<table[^>]*>', html_clean, re.IGNORECASE)),
        'forms': len(re.findall(r'<form[^>]*>', html_clean, re.IGNORECASE)),
        'divs': len(re.findall(r'<div[^>]*>', html_clean, re.IGNORECASE))
    }
    
    return elements

def count_markdown_elements(markdown_content):
    """Count various Markdown elements in the content"""
    lines = markdown_content.split('\n')
    
    elements = {
        'headers': len([line for line in lines if line.strip().startswith('#')]),
        'links': len(re.findall(r'\[([^\]]+)\]\(([^)]+)\)', markdown_content)),
        'images': len(re.findall(r'!\[([^\]]*)\]\(([^)]+)\)', markdown_content)),
        'code_blocks': len(re.findall(r'```[\s\S]*?```', markdown_content)),
        'lists': len([line for line in lines if re.match(r'^\s*[-*+]\s+', line.strip())]),
        'numbered_lists': len([line for line in lines if re.match(r'^\s*\d+\.\s+', line.strip())]),
        'blockquotes': len([line for line in lines if line.strip().startswith('>')]),
        'tables': len([line for line in lines if '|' in line and line.strip().startswith('|')])
    }
    
    return elements

def convert_html_to_markdown(html_content):
    """Convert HTML to Markdown using html2text"""
    start_time = time.time()
    
    try:
        # Configure html2text
        h = HTML2Text()
        h.ignore_links = False
        h.ignore_images = False
        h.ignore_emphasis = False
        h.body_width = 0  # Don't wrap lines
        h.unicode_snob = True
        h.escape_snob = True
        h.mark_code = True
        
        # Convert HTML to Markdown
        markdown_content = h.handle(html_content)
        
        # Clean up extra whitespace
        markdown_content = re.sub(r'\n{3,}', '\n\n', markdown_content)
        markdown_content = markdown_content.strip()
        
        # Count elements
        html_elements = count_html_elements(html_content)
        markdown_elements = count_markdown_elements(markdown_content)
        
        # Count words and characters
        word_count = len(markdown_content.split())
        char_count = len(markdown_content)
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return {
            "success": True,
            "markdown": markdown_content,
            "word_count": word_count,
            "char_count": char_count,
            "processing_time": processing_time,
            "html_elements_count": html_elements['total'],
            "markdown_elements": {
                "headers": markdown_elements['headers'],
                "links": markdown_elements['links'],
                "images": markdown_elements['images'],
                "code_blocks": markdown_elements['code_blocks'],
                "lists": markdown_elements['lists'] + markdown_elements['numbered_lists']
            }
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"HTML to Markdown conversion error: {str(e)}"
        }

def main():
    """Main function for command line usage"""
    if len(sys.argv) != 2:
        print("Usage: python html-to-markdown-converter.py '<html_content>'")
        sys.exit(1)
    
    html_content = sys.argv[1]
    
    if not html_content.strip():
        print(json.dumps({"success": False, "error": "No HTML content provided"}))
        sys.exit(1)
    
    try:
        result = convert_html_to_markdown(html_content)
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()