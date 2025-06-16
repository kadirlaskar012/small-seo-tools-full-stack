export const NEW_TOOL_CATEGORIES = [
  {
    id: 1,
    name: "SEO Tools",
    slug: "seo-tools",
    description: "Essential SEO optimization and analysis tools",
    icon: "🔍",
    color: "#3B82F6"
  },
  {
    id: 2,
    name: "Text Tools",
    slug: "text-tools", 
    description: "Text processing and manipulation utilities",
    icon: "📝",
    color: "#8B5CF6"
  },
  {
    id: 3,
    name: "PDF Tools",
    slug: "pdf-tools",
    description: "PDF processing and conversion tools",
    icon: "📄",
    color: "#EF4444"
  },
  {
    id: 4,
    name: "Image Tools",
    slug: "image-tools",
    description: "Image processing and conversion utilities",
    icon: "🖼️",
    color: "#10B981"
  },
  {
    id: 5,
    name: "Converter Tools",
    slug: "converter-tools",
    description: "File format conversion utilities",
    icon: "🔄",
    color: "#F59E0B"
  },
  {
    id: 6,
    name: "Code Tools",
    slug: "code-tools",
    description: "Developer tools and utilities",
    icon: "💻",
    color: "#6366F1"
  },
  {
    id: 7,
    name: "Website Tools",
    slug: "website-tools",
    description: "Website analysis and monitoring tools",
    icon: "🌐",
    color: "#EC4899"
  },
  {
    id: 8,
    name: "Writing & Grammar Tools",
    slug: "writing-grammar-tools",
    description: "Writing assistance and grammar checking tools",
    icon: "✍️",
    color: "#14B8A6"
  },
  {
    id: 9,
    name: "AI Tools",
    slug: "ai-tools",
    description: "AI-powered content generation tools",
    icon: "🤖",
    color: "#F97316"
  },
  {
    id: 10,
    name: "Math & Calculation Tools",
    slug: "math-calculation-tools",
    description: "Mathematical calculators and utilities",
    icon: "🔢",
    color: "#84CC16"
  }
];

export const NEW_TOOLS_DATA: Record<string, any[]> = {
  "seo-tools": [
    {
      title: "Robots.txt Generator",
      slug: "robots-txt-generator",
      description: "Generate SEO-friendly robots.txt files for your website with proper directives and syntax",
      metaTitle: "Free Robots.txt Generator - Create SEO-Optimized Robots.txt Files",
      metaDescription: "Generate professional robots.txt files for better SEO. Free tool with sitemap integration, user-agent directives, and crawl delay settings.",
      keywords: "robots.txt generator, robots txt, SEO robots file, robots.txt creator, website robots",
      code: `
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configure Robots.txt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sitemap">Sitemap URL</Label>
                  <Input 
                    id="sitemap" 
                    placeholder="https://example.com/sitemap.xml"
                    value={sitemapUrl}
                    onChange={(e) => setSitemapUrl(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="crawlDelay">Crawl Delay (seconds)</Label>
                  <Input 
                    id="crawlDelay" 
                    type="number"
                    placeholder="1"
                    value={crawlDelay}
                    onChange={(e) => setCrawlDelay(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>User-Agent Rules</Label>
                  {userAgentRules.map((rule, index) => (
                    <div key={index} className="grid grid-cols-3 gap-2">
                      <Input 
                        placeholder="User-agent"
                        value={rule.userAgent}
                        onChange={(e) => updateRule(index, 'userAgent', e.target.value)}
                      />
                      <Select value={rule.directive} onValueChange={(value) => updateRule(index, 'directive', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Allow">Allow</SelectItem>
                          <SelectItem value="Disallow">Disallow</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input 
                        placeholder="Path"
                        value={rule.path}
                        onChange={(e) => updateRule(index, 'path', e.target.value)}
                      />
                    </div>
                  ))}
                  <Button onClick={addRule} variant="outline" size="sm">
                    Add Rule
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Generated Robots.txt</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  readOnly
                  value={generateRobotsTxt()}
                  className="font-mono text-sm h-64"
                />
                <Button onClick={downloadRobotsTxt} className="mt-2 w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download robots.txt
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      `
    },
    {
      title: "Redirect Chain Checker",
      slug: "redirect-chain-checker",
      description: "Analyze HTTP redirects and identify redirect chains that may harm SEO performance",
      metaTitle: "Free Redirect Chain Checker - Analyze HTTP Redirects for SEO",
      metaDescription: "Check redirect chains, analyze HTTP status codes, and optimize your website's redirect structure for better SEO performance.",
      keywords: "redirect checker, HTTP redirects, redirect chain, 301 redirects, 302 redirects, SEO redirects",
      code: `
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Check Redirect Chain</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={checkRedirects} className="space-y-4">
                <div>
                  <Label htmlFor="url">Enter URL to Check</Label>
                  <Input 
                    id="url"
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Check Redirects
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {redirectChain.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Redirect Chain Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {redirectChain.map((redirect, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <Badge variant={getStatusVariant(redirect.status)}>
                          {redirect.status}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{redirect.url}</p>
                        <p className="text-xs text-muted-foreground">
                          Response time: {redirect.responseTime}ms
                        </p>
                      </div>
                      {index < redirectChain.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
                
                {redirectChain.length > 3 && (
                  <Alert className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Warning: This redirect chain has {redirectChain.length} hops. 
                      Long redirect chains can negatively impact SEO and user experience.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      `
    },
    {
      title: "Schema Markup Tester",
      slug: "schema-markup-tester",
      description: "Test and validate JSON-LD schema markup for better search engine understanding",
      metaTitle: "Free Schema Markup Tester - Validate JSON-LD Structured Data",
      metaDescription: "Test and validate your schema markup for SEO. Check JSON-LD structured data, rich snippets, and Google search features.",
      keywords: "schema markup tester, JSON-LD validator, structured data, rich snippets, schema.org, SEO markup",
      code: `
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Schema Markup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="method">Test Method</Label>
                  <Select value={testMethod} onValueChange={setTestMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="url">Test by URL</SelectItem>
                      <SelectItem value="code">Test by Code</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {testMethod === 'url' ? (
                  <div>
                    <Label htmlFor="url">Website URL</Label>
                    <Input 
                      id="url"
                      type="url"
                      placeholder="https://example.com"
                      value={testUrl}
                      onChange={(e) => setTestUrl(e.target.value)}
                    />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="schema">JSON-LD Schema Code</Label>
                    <Textarea 
                      id="schema"
                      placeholder='{"@context": "https://schema.org", "@type": "Organization", "name": "Example"}'
                      value={schemaCode}
                      onChange={(e) => setSchemaCode(e.target.value)}
                      className="font-mono text-sm h-32"
                    />
                  </div>
                )}
                
                <Button onClick={testSchema} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Test Schema
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Validation Results</CardTitle>
              </CardHeader>
              <CardContent>
                {validationResults ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      {validationResults.isValid ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className={validationResults.isValid ? 'text-green-600' : 'text-red-600'}>
                        {validationResults.isValid ? 'Valid Schema' : 'Invalid Schema'}
                      </span>
                    </div>
                    
                    {validationResults.schemas.map((schema, index) => (
                      <div key={index} className="p-3 border rounded">
                        <h4 className="font-medium">{schema.type}</h4>
                        <p className="text-sm text-muted-foreground">{schema.description}</p>
                      </div>
                    ))}
                    
                    {validationResults.errors.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-red-600">Errors:</h4>
                        {validationResults.errors.map((error, index) => (
                          <div key={index} className="p-2 bg-red-50 border border-red-200 rounded text-sm">
                            {error}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Enter a URL or schema code to test</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      `
    }
  ],
  "text-tools": [
    {
      title: "Remove Duplicate Lines",
      slug: "remove-duplicate-lines",
      description: "Remove duplicate lines from text while preserving original formatting and order",
      metaTitle: "Free Remove Duplicate Lines Tool - Clean Text Online",
      metaDescription: "Remove duplicate lines from text instantly. Free online tool to clean up lists, remove repeated content, and organize text efficiently.",
      keywords: "remove duplicate lines, duplicate text remover, clean text, remove duplicates, text deduplication",
      code: `
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Input Text</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Enter your text here (one item per line)..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="h-64"
                />
                <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                  <span>Lines: {inputText.split('\\n').filter(line => line.trim()).length}</span>
                  <Button onClick={clearInput} variant="outline" size="sm">
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Cleaned Text</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  readOnly
                  value={outputText}
                  className="h-64"
                  placeholder="Cleaned text will appear here..."
                />
                <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                  <span>Lines: {outputText.split('\\n').filter(line => line.trim()).length}</span>
                  <Button onClick={copyToClipboard} variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="caseSensitive"
                  checked={caseSensitive}
                  onCheckedChange={setCaseSensitive}
                />
                <Label htmlFor="caseSensitive">Case sensitive comparison</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="trimWhitespace"
                  checked={trimWhitespace}
                  onCheckedChange={setTrimWhitespace}
                />
                <Label htmlFor="trimWhitespace">Trim whitespace</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="keepFirst"
                  checked={keepFirst}
                  onCheckedChange={setKeepFirst}
                />
                <Label htmlFor="keepFirst">Keep first occurrence (instead of last)</Label>
              </div>
              <Button onClick={removeDuplicates} className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Duplicates
              </Button>
            </CardContent>
          </Card>
        </div>
      `
    },
    {
      title: "Word Frequency Counter",
      slug: "word-frequency-counter",
      description: "Analyze text and count word frequency with detailed statistics and visualization",
      metaTitle: "Free Word Frequency Counter - Analyze Text Statistics",
      metaDescription: "Count word frequency in text with detailed statistics. Free tool for content analysis, keyword research, and text optimization.",
      keywords: "word frequency counter, text analysis, word count, text statistics, keyword frequency",
      code: `
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Text Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Enter your text here for analysis..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="h-32"
              />
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-muted-foreground">
                  Characters: {inputText.length} | Words: {getWordCount()} | Lines: {getLineCount()}
                </div>
                <Button onClick={analyzeText} disabled={!inputText.trim()}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analyze
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {analysis && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{analysis.totalWords}</div>
                      <div className="text-sm text-muted-foreground">Total Words</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{analysis.uniqueWords}</div>
                      <div className="text-sm text-muted-foreground">Unique Words</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{analysis.averageWordLength}</div>
                      <div className="text-sm text-muted-foreground">Avg Word Length</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{analysis.sentences}</div>
                      <div className="text-sm text-muted-foreground">Sentences</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Word Frequency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {analysis.wordFrequency.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 hover:bg-muted rounded">
                        <span className="font-medium">{item.word}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">{item.count}</span>
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full"
                              style={{ width: \`\${(item.count / analysis.wordFrequency[0].count) * 100}%\` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      `
    },
    {
      title: "Slug Generator",
      slug: "slug-generator",
      description: "Generate SEO-friendly URL slugs from titles and text with customizable options",
      metaTitle: "Free URL Slug Generator - Create SEO-Friendly URLs",
      metaDescription: "Generate clean, SEO-optimized URL slugs from titles. Free tool with customizable options for better search engine rankings.",
      keywords: "slug generator, URL slug, SEO URL, permalink generator, URL friendly, clean URLs",
      code: `
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate URL Slug</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="input">Title or Text</Label>
                <Textarea 
                  id="input"
                  placeholder="Enter title or text to convert to slug..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="separator">Separator</Label>
                  <Select value={separator} onValueChange={setSeparator}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-">Hyphen (-)</SelectItem>
                      <SelectItem value="_">Underscore (_)</SelectItem>
                      <SelectItem value=".">Dot (.)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="case">Case</Label>
                  <Select value={caseOption} onValueChange={setCaseOption}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lower">Lowercase</SelectItem>
                      <SelectItem value="upper">Uppercase</SelectItem>
                      <SelectItem value="preserve">Preserve Case</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="removeStopWords"
                    checked={removeStopWords}
                    onCheckedChange={setRemoveStopWords}
                  />
                  <Label htmlFor="removeStopWords">Remove stop words (a, an, the, etc.)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="transliterate"
                    checked={transliterate}
                    onCheckedChange={setTransliterate}
                  />
                  <Label htmlFor="transliterate">Transliterate non-Latin characters</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="removeNumbers"
                    checked={removeNumbers}
                    onCheckedChange={setRemoveNumbers}
                  />
                  <Label htmlFor="removeNumbers">Remove numbers</Label>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Generated Slug</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg font-mono text-lg break-all">
                  {generatedSlug || 'Your slug will appear here...'}
                </div>
                
                <div className="flex space-x-2">
                  <Button onClick={generateSlug} className="flex-1">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Generate Slug
                  </Button>
                  <Button onClick={copySlug} variant="outline" disabled={!generatedSlug}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                
                {generatedSlug && (
                  <div className="text-sm text-muted-foreground">
                    <p>✓ SEO-friendly format</p>
                    <p>✓ No special characters</p>
                    <p>✓ Lowercase letters and numbers only</p>
                    <p>✓ Length: {generatedSlug.length} characters</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      `
    },
    {
      title: "Smart Modern Notepad",
      slug: "notepad",
      description: "Modern online notepad with rich text editing, auto-save, themes, and file operations",
      metaTitle: "Online Smart Notepad - Write & Save Instantly",
      metaDescription: "Write, edit, save, and share your notes instantly with this modern and elegant online notepad tool with rich text features.",
      keywords: "online notepad, text editor, rich text editor, note taking, auto save notepad, modern notepad",
      code: `<div>Smart Modern Notepad Tool</div>`
    }
  ],
  "pdf-tools": [
    {
      title: "PDF Page Extractor",
      slug: "pdf-page-extractor",
      description: "Extract specific pages from PDF files and save them as separate documents",
      metaTitle: "Free PDF Page Extractor - Extract Pages from PDF Online",
      metaDescription: "Extract specific pages from PDF files easily. Free online tool to split PDFs and save individual pages as separate documents.",
      keywords: "pdf page extractor, split pdf, extract pdf pages, pdf page splitter, pdf tools",
      code: `<div>PDF Page Extractor Tool</div>`
    },
    {
      title: "PDF Password Remover",
      slug: "pdf-password-remover",
      description: "Remove password protection from PDF files to make them accessible and editable",
      metaTitle: "Free PDF Password Remover - Unlock Protected PDFs",
      metaDescription: "Remove password protection from PDF files instantly. Free online tool to unlock encrypted PDFs and make them accessible.",
      keywords: "pdf password remover, unlock pdf, remove pdf password, decrypt pdf, pdf unlocker",
      code: `<div>PDF Password Remover Tool</div>`
    },
    {
      title: "PDF to Text Converter",
      slug: "pdf-to-text-converter",
      description: "Convert PDF documents to plain text format for easy editing and content extraction",
      metaTitle: "Free PDF to Text Converter - Extract Text from PDF Online",
      metaDescription: "Convert PDF files to text format instantly. Free online tool to extract text content from PDF documents for editing.",
      keywords: "pdf to text converter, extract text from pdf, pdf text extractor, convert pdf to txt",
      code: `<div>PDF to Text Converter Tool</div>`
    }
  ],
  "image-tools": [
    {
      title: "Image to Text (OCR)",
      slug: "image-to-text-ocr",
      description: "Extract text from images using advanced OCR technology for easy content digitization",
      metaTitle: "Free Image to Text OCR - Extract Text from Images Online",
      metaDescription: "Extract text from images instantly with OCR technology. Free online tool to convert image text to editable format.",
      keywords: "image to text, ocr online, extract text from image, image text recognition, photo to text",
      code: `<div>Image to Text OCR Tool</div>`
    },
    {
      title: "Background Remover",
      slug: "background-remover",
      description: "Remove backgrounds from images automatically using AI-powered background removal technology",
      metaTitle: "Free Background Remover - Remove Image Backgrounds Online",
      metaDescription: "Remove image backgrounds instantly with AI technology. Free online tool for transparent backgrounds and clean cutouts.",
      keywords: "background remover, remove background, transparent background, image cutout, background eraser",
      code: `<div>Background Remover Tool</div>`
    },
    {
      title: "Image DPI Converter",
      slug: "image-dpi-converter",
      description: "Change image DPI and resolution for print optimization and web display requirements",
      metaTitle: "Free Image DPI Converter - Change Image Resolution Online",
      metaDescription: "Convert image DPI and resolution instantly. Free online tool to optimize images for print and web display.",
      keywords: "image dpi converter, change image resolution, dpi changer, image resolution converter, print optimization",
      code: `<div>Image DPI Converter Tool</div>`
    },
    {
      title: "Profile Picture Maker",
      slug: "profile-picture-maker",
      description: "Create stunning profile pictures with advanced editing tools, styles, and effects",
      metaTitle: "Profile Picture Maker - Create Stunning Profile Pictures Online",
      metaDescription: "Professional profile picture maker with advanced editing tools. Apply styles, backgrounds, borders, and effects. Download high-quality images instantly.",
      keywords: "profile picture maker, avatar creator, image editor, photo editor, profile photo, social media images",
      code: `<ProfilePictureMaker />`
    }
  ],
  "converter-tools": [
    {
      title: "HTML to Markdown Converter",
      slug: "html-to-markdown-converter",
      description: "Convert HTML content to Markdown format for documentation and content management",
      metaTitle: "Free HTML to Markdown Converter - Convert HTML to MD Online",
      metaDescription: "Convert HTML to Markdown format instantly. Free online tool for documentation, GitHub, and content management systems.",
      keywords: "html to markdown, html to md converter, markdown converter, html markdown conversion",
      code: `<div>HTML to Markdown Converter Tool</div>`
    },
    {
      title: "WebP to JPG Converter",
      slug: "webp-to-jpg-converter",
      description: "Convert WebP images to JPG format for better compatibility and sharing",
      metaTitle: "Free WebP to JPG Converter - Convert WebP Images Online",
      metaDescription: "Convert WebP images to JPG format instantly. Free online tool for better image compatibility and sharing.",
      keywords: "webp to jpg, webp converter, convert webp to jpeg, image format converter, webp to jpg online",
      code: `<div>WebP to JPG Converter Tool</div>`
    },
    {
      title: "CSV to JSON Converter",
      slug: "csv-to-json-converter",
      description: "Convert CSV data to JSON format for API integration and data processing",
      metaTitle: "Free CSV to JSON Converter - Convert CSV Data Online",
      metaDescription: "Convert CSV files to JSON format instantly. Free online tool for data transformation and API integration.",
      keywords: "csv to json converter, convert csv to json, data converter, csv json transformation",
      code: `<div>CSV to JSON Converter Tool</div>`
    }
  ],
  "code-tools": [
    {
      title: "JWT Decoder",
      slug: "jwt-decoder",
      description: "Decode and analyze JWT tokens to view header, payload, and signature information",
      metaTitle: "Free JWT Decoder - Decode JWT Tokens Online",
      metaDescription: "Decode JWT tokens instantly to view header and payload data. Free online tool for JWT token analysis and debugging.",
      keywords: "jwt decoder, decode jwt token, jwt parser, json web token decoder, jwt analyzer",
      code: `<div>JWT Decoder Tool</div>`
    },
    {
      title: "Regex Generator",
      slug: "regex-generator",
      description: "Generate regular expressions with visual interface and common pattern templates",
      metaTitle: "Free Regex Generator - Create Regular Expressions Online",
      metaDescription: "Generate regular expressions easily with visual interface. Free online tool with common patterns and real-time testing.",
      keywords: "regex generator, regular expression generator, regex builder, regex maker, pattern generator",
      code: `<div>Regex Generator Tool</div>`
    },
    {
      title: "JavaScript Obfuscator",
      slug: "javascript-obfuscator",
      description: "Obfuscate JavaScript code to protect intellectual property and prevent reverse engineering",
      metaTitle: "Free JavaScript Obfuscator - Protect JS Code Online",
      metaDescription: "Obfuscate JavaScript code to protect your source code. Free online tool for code protection and minification.",
      keywords: "javascript obfuscator, js obfuscator, code obfuscation, protect javascript, minify js",
      code: `<div>JavaScript Obfuscator Tool</div>`
    }
  ],
  "website-tools": [
    {
      title: "Safe Browsing Checker",
      slug: "safe-browsing-checker",
      description: "Check if websites are safe and secure using Google Safe Browsing API",
      metaTitle: "Free Safe Browsing Checker - Check Website Safety Online",
      metaDescription: "Check if websites are safe from malware and phishing threats. Free online tool using Google Safe Browsing technology.",
      keywords: "safe browsing checker, website safety checker, malware scanner, phishing detector, url safety",
      code: `<div>Safe Browsing Checker Tool</div>`
    },
    {
      title: "IP Geolocation Finder",
      slug: "ip-geolocation-finder",
      description: "Find geographic location, ISP, and other details for any IP address",
      metaTitle: "Free IP Geolocation Finder - Locate IP Address Online",
      metaDescription: "Find IP address location, ISP, and geographic details instantly. Free online IP geolocation lookup tool.",
      keywords: "ip geolocation, ip location finder, ip address lookup, find ip location, ip tracker",
      code: `<div>IP Geolocation Finder Tool</div>`
    },
    {
      title: "Domain Age Checker",
      slug: "domain-age-checker",
      description: "Check domain age, registration date, and expiration information for any website",
      metaTitle: "Free Domain Age Checker - Check Domain Registration Date",
      metaDescription: "Check domain age and registration details instantly. Free online tool to verify domain creation and expiration dates.",
      keywords: "domain age checker, domain age lookup, check domain age, domain registration date, whois lookup",
      code: `<div>Domain Age Checker Tool</div>`
    },
    {
      title: "Google AdSense Ban Checker",
      slug: "adsense-ban-checker",
      description: "Check if your website is banned from showing Google AdSense ads with comprehensive analysis",
      metaTitle: "Free Google AdSense Ban Checker - Check Website AdSense Status",
      metaDescription: "Check if your website is banned from Google AdSense. Analyze AdSense code, robots.txt, and ban indicators with detailed diagnostics.",
      keywords: "adsense ban checker, google adsense ban, adsense status checker, website monetization, adsense analyzer",
      code: `<div>Google AdSense Ban Checker Tool</div>`
    }
  ],
  "writing-grammar-tools": [
    {
      title: "Passive Voice Checker",
      slug: "passive-voice-checker",
      description: "Identify and highlight passive voice in text to improve writing clarity and engagement",
      metaTitle: "Free Passive Voice Checker - Improve Writing Clarity Online",
      metaDescription: "Check for passive voice in your writing to improve clarity and engagement. Free online tool for better writing.",
      keywords: "passive voice checker, writing checker, grammar checker, improve writing, passive voice detector",
      code: `<div>Passive Voice Checker Tool</div>`
    },
    {
      title: "Readability Score Checker",
      slug: "readability-score-checker",
      description: "Analyze text readability using Flesch-Kincaid and other standard readability metrics",
      metaTitle: "Free Readability Score Checker - Analyze Text Readability",
      metaDescription: "Check text readability score with Flesch-Kincaid and other metrics. Free online tool to improve content accessibility.",
      keywords: "readability checker, flesch kincaid score, readability test, text analysis, content readability",
      code: `<div>Readability Score Checker Tool</div>`
    },
    {
      title: "Plagiarism Summary Generator",
      slug: "plagiarism-summary-generator",
      description: "Generate unique content summaries to avoid plagiarism and create original content",
      metaTitle: "Free Plagiarism Summary Generator - Create Original Content",
      metaDescription: "Generate unique content summaries to avoid plagiarism. Free online tool for creating original, plagiarism-free content.",
      keywords: "plagiarism checker, content generator, unique content, plagiarism free, content rewriter",
      code: `<div>Plagiarism Summary Generator Tool</div>`
    }
  ],
  "ai-tools": [
    {
      title: "AI Blog Introduction Generator",
      slug: "ai-blog-introduction-generator",
      description: "Generate compelling blog introductions using AI to hook readers and improve engagement",
      metaTitle: "Free AI Blog Introduction Generator - Create Engaging Intros",
      metaDescription: "Generate compelling blog introductions with AI. Free online tool to create engaging openings that hook readers.",
      keywords: "ai blog intro generator, blog introduction writer, ai content generator, blog intro creator",
      code: `<div>AI Blog Introduction Generator Tool</div>`
    },
    {
      title: "AI Email Subject Line Generator",
      slug: "ai-email-subject-line-generator",
      description: "Create high-converting email subject lines using AI for better open rates",
      metaTitle: "Free AI Email Subject Line Generator - Boost Open Rates",
      metaDescription: "Generate high-converting email subject lines with AI. Free online tool to improve email open rates and engagement.",
      keywords: "ai email subject generator, email subject line creator, email marketing, subject line generator",
      code: `<div>AI Email Subject Line Generator Tool</div>`
    },
    {
      title: "AI YouTube Title Generator",
      slug: "ai-youtube-title-generator",
      description: "Generate catchy YouTube video titles using AI to increase views and engagement",
      metaTitle: "Free AI YouTube Title Generator - Create Viral Video Titles",
      metaDescription: "Generate catchy YouTube video titles with AI. Free online tool to create engaging titles that increase views.",
      keywords: "ai youtube title generator, youtube title creator, video title generator, viral titles",
      code: `<div>AI YouTube Title Generator Tool</div>`
    }
  ],
  "math-calculation-tools": [
    {
      title: "Date Difference Calculator",
      slug: "date-difference-calculator",
      description: "Calculate the difference between two dates in years, months, days, and more",
      metaTitle: "Free Date Difference Calculator - Calculate Days Between Dates",
      metaDescription: "Calculate date differences in years, months, days, hours, and minutes. Free online date calculator tool.",
      keywords: "date difference calculator, days between dates, date calculator, time difference calculator",
      code: `<div>Date Difference Calculator Tool</div>`
    },
    {
      title: "Age in Months Calculator",
      slug: "age-in-months-calculator",
      description: "Calculate exact age in months, weeks, days, and hours from birth date",
      metaTitle: "Free Age in Months Calculator - Calculate Exact Age Online",
      metaDescription: "Calculate your exact age in months, weeks, days, and hours. Free online age calculator with precise results.",
      keywords: "age calculator, age in months, calculate age, exact age calculator, birth date calculator",
      code: `<div>Age in Months Calculator Tool</div>`
    },
    {
      title: "Percentage Change Calculator",
      slug: "percentage-change-calculator",
      description: "Calculate percentage increase, decrease, and change between two values",
      metaTitle: "Free Percentage Change Calculator - Calculate Percent Change",
      metaDescription: "Calculate percentage change, increase, and decrease between values. Free online percentage calculator tool.",
      keywords: "percentage change calculator, percent change, percentage increase calculator, percent decrease",
      code: `<div>Percentage Change Calculator Tool</div>`
    }
  ]
};

export function getAllNewTools() {
  const tools: any[] = [];
  let toolId = 1;
  
  NEW_TOOL_CATEGORIES.forEach(category => {
    const categoryTools = NEW_TOOLS_DATA[category.slug] || [];
    categoryTools.forEach((tool: any) => {
      tools.push({
        id: toolId++,
        title: tool.title,
        slug: tool.slug,
        description: tool.description,
        code: tool.code,
        metaTitle: tool.metaTitle,
        metaDescription: tool.metaDescription,
        keywords: tool.keywords,
        categoryId: category.id,
        isActive: true
      });
    });
  });
  
  return tools;
}