export const TOOL_CATEGORIES = [
  {
    id: 1,
    name: "SEO Tools",
    slug: "seo-tools",
    description: "Essential SEO analysis and optimization tools",
    icon: "🔍",
    color: "blue"
  },
  {
    id: 2,
    name: "Text Tools",
    slug: "text-tools", 
    description: "Text analysis, manipulation and formatting tools",
    icon: "📝",
    color: "green"
  },
  {
    id: 3,
    name: "PDF Tools",
    slug: "pdf-tools",
    description: "PDF manipulation and conversion utilities",
    icon: "📄",
    color: "red"
  },
  {
    id: 4,
    name: "Image Tools",
    slug: "image-tools",
    description: "Image editing, compression and conversion tools",
    icon: "🖼️",
    color: "purple"
  },
  {
    id: 5,
    name: "Converter Tools",
    slug: "converter-tools",
    description: "Format conversion and data transformation tools",
    icon: "🔄",
    color: "orange"
  },
  {
    id: 6,
    name: "Code Tools",
    slug: "code-tools",
    description: "Development and programming utilities",
    icon: "💻",
    color: "indigo"
  },
  {
    id: 7,
    name: "Website Tools",
    slug: "website-tools",
    description: "Website analysis and testing tools",
    icon: "🌐",
    color: "cyan"
  },
  {
    id: 8,
    name: "Writing & Grammar Tools",
    slug: "writing-grammar-tools",
    description: "Writing assistance and grammar checking tools",
    icon: "✍️",
    color: "pink"
  },
  {
    id: 9,
    name: "AI Tools",
    slug: "ai-tools",
    description: "Artificial intelligence powered utilities",
    icon: "🤖",
    color: "violet"
  },
  {
    id: 10,
    name: "Math & Calculation Tools",
    slug: "math-calculation-tools",
    description: "Mathematical calculators and computation tools",
    icon: "🧮",
    color: "yellow"
  }
];

export const TOOLS_DATA = {
  // SEO Tools (30+ tools)
  "seo-tools": [
    { title: "SEO Score Checker", slug: "seo-score-checker", description: "Analyze your website's SEO performance with detailed scoring" },
    { title: "Meta Tags Analyzer", slug: "meta-tags-analyzer", description: "Check and analyze meta tags for SEO optimization" },
    { title: "Keyword Density Checker", slug: "keyword-density-checker", description: "Analyze keyword density in your content" },
    { title: "Backlink Checker", slug: "backlink-checker", description: "Check backlinks pointing to any website" },
    { title: "Page Speed Test", slug: "page-speed-test", description: "Test website loading speed and performance" },
    { title: "Robots.txt Generator", slug: "robots-txt-generator", description: "Generate robots.txt file for your website" },
    { title: "Sitemap Generator", slug: "sitemap-generator", description: "Create XML sitemap for your website" },
    { title: "Google Index Checker", slug: "google-index-checker", description: "Check if pages are indexed by Google" },
    { title: "Social Media Preview", slug: "social-media-preview", description: "Preview how your content appears on social platforms" },
    { title: "Schema Markup Generator", slug: "schema-markup-generator", description: "Generate structured data markup" },
    { title: "Canonical URL Checker", slug: "canonical-url-checker", description: "Check canonical URLs for duplicate content issues" },
    { title: "Mobile Friendly Test", slug: "mobile-friendly-test", description: "Test if your website is mobile-friendly" },
    { title: "SSL Certificate Checker", slug: "ssl-certificate-checker", description: "Check SSL certificate status and validity" },
    { title: "Website Authority Checker", slug: "website-authority-checker", description: "Check domain and page authority scores" },
    { title: "SERP Position Checker", slug: "serp-position-checker", description: "Check search engine ranking positions" },
    { title: "Local SEO Checker", slug: "local-seo-checker", description: "Analyze local SEO performance" },
    { title: "Core Web Vitals Checker", slug: "core-web-vitals-checker", description: "Check Core Web Vitals metrics" },
    { title: "Heading Tags Analyzer", slug: "heading-tags-analyzer", description: "Analyze H1, H2, H3 heading structure" },
    { title: "Image Alt Text Checker", slug: "image-alt-text-checker", description: "Check alt text for images on any page" },
    { title: "Internal Link Analyzer", slug: "internal-link-analyzer", description: "Analyze internal linking structure" },
    { title: "Competitor Analysis Tool", slug: "competitor-analysis-tool", description: "Compare SEO metrics with competitors" },
    { title: "Keyword Research Tool", slug: "keyword-research-tool", description: "Research keywords and search volumes" },
    { title: "SERP Simulator", slug: "serp-simulator", description: "Preview how your page appears in search results" },
    { title: "Website Crawler", slug: "website-crawler", description: "Crawl and analyze website structure" },
    { title: "Redirect Checker", slug: "redirect-checker", description: "Check HTTP redirects and chains" },
    { title: "Broken Link Checker", slug: "broken-link-checker", description: "Find broken links on any website" },
    { title: "XML Sitemap Validator", slug: "xml-sitemap-validator", description: "Validate XML sitemap format and structure" },
    { title: "Google Analytics Code Checker", slug: "google-analytics-checker", description: "Verify Google Analytics installation" },
    { title: "Bing Index Checker", slug: "bing-index-checker", description: "Check if pages are indexed by Bing" },
    { title: "SEO Content Analyzer", slug: "seo-content-analyzer", description: "Analyze content for SEO optimization" },
    { title: "Link Building Opportunities", slug: "link-building-opportunities", description: "Find potential link building opportunities" },
    { title: "Technical SEO Audit", slug: "technical-seo-audit", description: "Comprehensive technical SEO analysis" }
  ],

  // Text Tools (30+ tools)
  "text-tools": [
    { title: "Word Counter", slug: "word-counter", description: "Count words, characters, paragraphs, and reading time" },
    { title: "Character Counter", slug: "character-counter", description: "Count characters with and without spaces" },
    { title: "Text Case Converter", slug: "text-case-converter", description: "Convert text to uppercase, lowercase, title case" },
    { title: "Text Difference Checker", slug: "text-difference-checker", description: "Compare two texts and highlight differences" },
    { title: "Remove Duplicate Lines", slug: "remove-duplicate-lines", description: "Remove duplicate lines from text" },
    { title: "Text Sorter", slug: "text-sorter", description: "Sort lines of text alphabetically or numerically" },
    { title: "Text Reverser", slug: "text-reverser", description: "Reverse text, words, or lines" },
    { title: "Lorem Ipsum Generator", slug: "lorem-ipsum-generator", description: "Generate placeholder Lorem Ipsum text" },
    { title: "Text to ASCII Art", slug: "text-to-ascii-art", description: "Convert text to ASCII art" },
    { title: "Text Encoder/Decoder", slug: "text-encoder-decoder", description: "Encode and decode text in various formats" },
    { title: "Whitespace Remover", slug: "whitespace-remover", description: "Remove extra whitespace from text" },
    { title: "Text Splitter", slug: "text-splitter", description: "Split text by delimiter or length" },
    { title: "Text Merger", slug: "text-merger", description: "Merge multiple texts with custom separators" },
    { title: "Line Counter", slug: "line-counter", description: "Count number of lines in text" },
    { title: "Text Formatter", slug: "text-formatter", description: "Format and beautify text content" },
    { title: "Find and Replace", slug: "find-and-replace", description: "Find and replace text with regex support" },
    { title: "Text Statistics", slug: "text-statistics", description: "Detailed text analysis and statistics" },
    { title: "Palindrome Checker", slug: "palindrome-checker", description: "Check if text is a palindrome" },
    { title: "Text Randomizer", slug: "text-randomizer", description: "Randomize text order and shuffle words" },
    { title: "Text Extractor", slug: "text-extractor", description: "Extract text from various file formats" },
    { title: "Text Compressor", slug: "text-compressor", description: "Compress text size while maintaining readability" },
    { title: "Invisible Character Detector", slug: "invisible-character-detector", description: "Detect invisible and hidden characters" },
    { title: "Text to Slug Generator", slug: "text-to-slug-generator", description: "Convert text to URL-friendly slugs" },
    { title: "Text Frequency Counter", slug: "text-frequency-counter", description: "Count word and character frequency" },
    { title: "Text Validator", slug: "text-validator", description: "Validate text format and structure" },
    { title: "Text Template Generator", slug: "text-template-generator", description: "Generate text from templates" },
    { title: "Sentence Counter", slug: "sentence-counter", description: "Count sentences in text" },
    { title: "Paragraph Counter", slug: "paragraph-counter", description: "Count paragraphs in text" },
    { title: "Text Highlighter", slug: "text-highlighter", description: "Highlight specific words or phrases" },
    { title: "Text Cleaner", slug: "text-cleaner", description: "Clean and normalize text content" },
    { title: "Text Analyzer", slug: "text-analyzer", description: "Comprehensive text analysis tool" },
    { title: "Reading Level Calculator", slug: "reading-level-calculator", description: "Calculate text reading level and difficulty" }
  ],

  // PDF Tools (30+ tools)
  "pdf-tools": [
    { title: "PDF to Word Converter", slug: "pdf-to-word-converter", description: "Convert PDF files to Word documents" },
    { title: "Word to PDF Converter", slug: "word-to-pdf-converter", description: "Convert Word documents to PDF" },
    { title: "PDF Merger", slug: "pdf-merger", description: "Merge multiple PDF files into one" },
    { title: "PDF Splitter", slug: "pdf-splitter", description: "Split PDF into multiple files" },
    { title: "PDF Compressor", slug: "pdf-compressor", description: "Reduce PDF file size" },
    { title: "PDF to Image Converter", slug: "pdf-to-image-converter", description: "Convert PDF pages to images" },
    { title: "Image to PDF Converter", slug: "image-to-pdf-converter", description: "Convert images to PDF" },
    { title: "PDF Password Remover", slug: "pdf-password-remover", description: "Remove password protection from PDF" },
    { title: "PDF Password Protector", slug: "pdf-password-protector", description: "Add password protection to PDF" },
    { title: "PDF Text Extractor", slug: "pdf-text-extractor", description: "Extract text content from PDF" },
    { title: "PDF Metadata Editor", slug: "pdf-metadata-editor", description: "Edit PDF metadata and properties" },
    { title: "PDF Page Rotator", slug: "pdf-page-rotator", description: "Rotate PDF pages" },
    { title: "PDF Page Remover", slug: "pdf-page-remover", description: "Remove specific pages from PDF" },
    { title: "PDF Watermark Adder", slug: "pdf-watermark-adder", description: "Add watermarks to PDF" },
    { title: "PDF Signature Tool", slug: "pdf-signature-tool", description: "Add digital signatures to PDF" },
    { title: "PDF Form Filler", slug: "pdf-form-filler", description: "Fill PDF forms electronically" },
    { title: "PDF Optimizer", slug: "pdf-optimizer", description: "Optimize PDF for web or print" },
    { title: "PDF to Excel Converter", slug: "pdf-to-excel-converter", description: "Convert PDF tables to Excel" },
    { title: "Excel to PDF Converter", slug: "excel-to-pdf-converter", description: "Convert Excel files to PDF" },
    { title: "PDF to PowerPoint Converter", slug: "pdf-to-powerpoint-converter", description: "Convert PDF to PowerPoint" },
    { title: "PowerPoint to PDF Converter", slug: "powerpoint-to-pdf-converter", description: "Convert PowerPoint to PDF" },
    { title: "PDF to HTML Converter", slug: "pdf-to-html-converter", description: "Convert PDF to HTML" },
    { title: "HTML to PDF Converter", slug: "html-to-pdf-converter", description: "Convert HTML to PDF" },
    { title: "PDF Page Counter", slug: "pdf-page-counter", description: "Count pages in PDF files" },
    { title: "PDF Bookmark Editor", slug: "pdf-bookmark-editor", description: "Add and edit PDF bookmarks" },
    { title: "PDF Annotation Tool", slug: "pdf-annotation-tool", description: "Add annotations to PDF" },
    { title: "PDF Version Converter", slug: "pdf-version-converter", description: "Convert PDF to different versions" },
    { title: "PDF Repair Tool", slug: "pdf-repair-tool", description: "Repair corrupted PDF files" },
    { title: "PDF Validator", slug: "pdf-validator", description: "Validate PDF file integrity" },
    { title: "PDF Search Tool", slug: "pdf-search-tool", description: "Search text within PDF files" },
    { title: "PDF Compare Tool", slug: "pdf-compare-tool", description: "Compare two PDF files" },
    { title: "PDF OCR Tool", slug: "pdf-ocr-tool", description: "Extract text from scanned PDF using OCR" }
  ],

  // Continue with other categories...
  "image-tools": [
    { title: "Image Compressor", slug: "image-compressor", description: "Compress images without quality loss" },
    { title: "Image Resizer", slug: "image-resizer", description: "Resize images to specific dimensions" },
    { title: "Image Format Converter", slug: "image-format-converter", description: "Convert between image formats" },
    { title: "Image Cropper", slug: "image-cropper", description: "Crop images to desired size" },
    { title: "Background Remover", slug: "background-remover", description: "Remove background from images" },
    { title: "Image Watermark Tool", slug: "image-watermark-tool", description: "Add watermarks to images" },
    { title: "Image Filter Tool", slug: "image-filter-tool", description: "Apply filters and effects to images" },
    { title: "Image Brightness Adjuster", slug: "image-brightness-adjuster", description: "Adjust image brightness and contrast" },
    { title: "Image Rotation Tool", slug: "image-rotation-tool", description: "Rotate images by any angle" },
    { title: "Image Border Tool", slug: "image-border-tool", description: "Add borders to images" },
    { title: "Image Blur Tool", slug: "image-blur-tool", description: "Apply blur effects to images" },
    { title: "Image Sharpen Tool", slug: "image-sharpen-tool", description: "Sharpen blurry images" },
    { title: "Color Palette Extractor", slug: "color-palette-extractor", description: "Extract color palettes from images" },
    { title: "Image Metadata Remover", slug: "image-metadata-remover", description: "Remove EXIF data from images" },
    { title: "Image Color Changer", slug: "image-color-changer", description: "Change colors in images" },
    { title: "Image Negative Tool", slug: "image-negative-tool", description: "Create negative version of images" },
    { title: "Image Vintage Effect", slug: "image-vintage-effect", description: "Apply vintage effects to images" },
    { title: "Image Cartoon Effect", slug: "image-cartoon-effect", description: "Convert images to cartoon style" },
    { title: "Image Pixel Art Creator", slug: "image-pixel-art-creator", description: "Convert images to pixel art" },
    { title: "Image Mosaic Creator", slug: "image-mosaic-creator", description: "Create mosaic effects" },
    { title: "Image Collage Maker", slug: "image-collage-maker", description: "Create photo collages" },
    { title: "Image Histogram Analyzer", slug: "image-histogram-analyzer", description: "Analyze image histograms" },
    { title: "Image Duplicate Finder", slug: "image-duplicate-finder", description: "Find duplicate images" },
    { title: "Image Face Detector", slug: "image-face-detector", description: "Detect faces in images" },
    { title: "Image Text Extractor", slug: "image-text-extractor", description: "Extract text from images using OCR" },
    { title: "QR Code Generator", slug: "qr-code-generator", description: "Generate QR codes" },
    { title: "Barcode Generator", slug: "barcode-generator", description: "Generate various barcode formats" },
    { title: "Image Placeholder Generator", slug: "image-placeholder-generator", description: "Generate placeholder images" },
    { title: "Avatar Generator", slug: "avatar-generator", description: "Generate user avatars" },
    { title: "Favicon Generator", slug: "favicon-generator", description: "Create favicons from images" },
    { title: "Image Grid Maker", slug: "image-grid-maker", description: "Create image grids and layouts" },
    { title: "Image Optimizer", slug: "image-optimizer", description: "Optimize images for web use" }
  ],

  // Add remaining categories with 30+ tools each...
  "converter-tools": [
    { title: "Base64 Encoder/Decoder", slug: "base64-encoder-decoder", description: "Encode and decode Base64 data" },
    { title: "URL Encoder/Decoder", slug: "url-encoder-decoder", description: "Encode and decode URLs" },
    { title: "HTML Entity Encoder/Decoder", slug: "html-entity-encoder-decoder", description: "Convert HTML entities" },
    { title: "JSON to XML Converter", slug: "json-to-xml-converter", description: "Convert JSON to XML format" },
    { title: "XML to JSON Converter", slug: "xml-to-json-converter", description: "Convert XML to JSON format" },
    { title: "CSV to JSON Converter", slug: "csv-to-json-converter", description: "Convert CSV to JSON format" },
    { title: "JSON to CSV Converter", slug: "json-to-csv-converter", description: "Convert JSON to CSV format" },
    { title: "Unix Timestamp Converter", slug: "unix-timestamp-converter", description: "Convert Unix timestamps to date" },
    { title: "RGB to HEX Converter", slug: "rgb-to-hex-converter", description: "Convert RGB colors to HEX" },
    { title: "HEX to RGB Converter", slug: "hex-to-rgb-converter", description: "Convert HEX colors to RGB" },
    { title: "Unit Converter", slug: "unit-converter", description: "Convert between different units" },
    { title: "Currency Converter", slug: "currency-converter", description: "Convert between currencies" },
    { title: "Binary Converter", slug: "binary-converter", description: "Convert between binary and decimal" },
    { title: "Hexadecimal Converter", slug: "hexadecimal-converter", description: "Convert hexadecimal numbers" },
    { title: "Roman Numeral Converter", slug: "roman-numeral-converter", description: "Convert to/from Roman numerals" },
    { title: "Temperature Converter", slug: "temperature-converter", description: "Convert temperature units" },
    { title: "Length Converter", slug: "length-converter", description: "Convert length measurements" },
    { title: "Weight Converter", slug: "weight-converter", description: "Convert weight measurements" },
    { title: "Area Converter", slug: "area-converter", description: "Convert area measurements" },
    { title: "Volume Converter", slug: "volume-converter", description: "Convert volume measurements" },
    { title: "Speed Converter", slug: "speed-converter", description: "Convert speed measurements" },
    { title: "Pressure Converter", slug: "pressure-converter", description: "Convert pressure measurements" },
    { title: "Energy Converter", slug: "energy-converter", description: "Convert energy measurements" },
    { title: "Power Converter", slug: "power-converter", description: "Convert power measurements" },
    { title: "Frequency Converter", slug: "frequency-converter", description: "Convert frequency measurements" },
    { title: "Data Size Converter", slug: "data-size-converter", description: "Convert data size units" },
    { title: "Markdown to HTML", slug: "markdown-to-html", description: "Convert Markdown to HTML" },
    { title: "HTML to Markdown", slug: "html-to-markdown", description: "Convert HTML to Markdown" },
    { title: "Text to Binary", slug: "text-to-binary", description: "Convert text to binary" },
    { title: "Binary to Text", slug: "binary-to-text", description: "Convert binary to text" },
    { title: "ASCII to Text", slug: "ascii-to-text", description: "Convert ASCII codes to text" },
    { title: "Text to ASCII", slug: "text-to-ascii", description: "Convert text to ASCII codes" }
  ]
};

export function getAllTools() {
  const allTools = [];
  let toolId = 1;
  
  for (const category of TOOL_CATEGORIES) {
    const categoryTools = TOOLS_DATA[category.slug as keyof typeof TOOLS_DATA] || [];
    
    for (const tool of categoryTools) {
      allTools.push({
        id: toolId++,
        ...tool,
        categoryId: category.id,
        category: category,
        metaTitle: `${tool.title} - Free Online Tool`,
        metaDescription: tool.description,
        metaTags: `${tool.title.toLowerCase()}, free tool, online tool, ${category.name.toLowerCase()}`,
        isActive: true,
        createdAt: new Date()
      });
    }
  }
  
  return allTools;
}