#!/usr/bin/env python3
"""
CSV to JSON Converter Tool - Convert CSV data to JSON format
"""

import sys
import json
import time
import csv
import io

def parse_csv_content(csv_content):
    """Parse CSV content and convert to structured data"""
    try:
        # Use StringIO to treat string as file-like object
        csv_file = io.StringIO(csv_content.strip())
        
        # Detect dialect
        sample = csv_content[:1024]
        try:
            dialect = csv.Sniffer().sniff(sample, delimiters=',;\t')
        except csv.Error:
            dialect = csv.excel  # Default to excel dialect
        
        # Read CSV data
        reader = csv.DictReader(csv_file, dialect=dialect)
        rows = list(reader)
        
        if not rows:
            return None, "No data rows found in CSV"
        
        return rows, None
        
    except Exception as e:
        return None, f"CSV parsing error: {str(e)}"

def convert_csv_to_json(csv_content, prettify=True):
    """Convert CSV content to JSON format"""
    start_time = time.time()
    
    try:
        if not csv_content.strip():
            return {
                "success": False,
                "error": "No CSV content provided"
            }
        
        # Parse CSV
        rows, error = parse_csv_content(csv_content)
        if error:
            return {
                "success": False,
                "error": error
            }
        
        # Get statistics
        row_count = len(rows)
        columns = list(rows[0].keys()) if rows else []
        column_count = len(columns)
        
        # Convert to JSON
        json_data = rows
        
        # Create formatted JSON string
        if prettify:
            json_formatted = json.dumps(json_data, indent=2, ensure_ascii=False)
        else:
            json_formatted = json.dumps(json_data, ensure_ascii=False)
        
        # Calculate file sizes
        csv_size = len(csv_content.encode('utf-8'))
        json_size = len(json_formatted.encode('utf-8'))
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return {
            "success": True,
            "json": json_data,
            "json_formatted": json_formatted,
            "row_count": row_count,
            "column_count": column_count,
            "columns": columns,
            "file_size_csv": csv_size,
            "file_size_json": json_size,
            "processing_time": processing_time
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"CSV to JSON conversion error: {str(e)}"
        }

def main():
    """Main function for command line usage"""
    if len(sys.argv) < 2:
        print("Usage: python csv-to-json-converter.py '<csv_content>' [prettify]")
        sys.exit(1)
    
    csv_content = sys.argv[1]
    prettify = len(sys.argv) > 2 and sys.argv[2].lower() == 'true'
    
    if not csv_content.strip():
        print(json.dumps({"success": False, "error": "No CSV content provided"}))
        sys.exit(1)
    
    try:
        result = convert_csv_to_json(csv_content, prettify)
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()