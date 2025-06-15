import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, Code, FileText, Eye, Trash2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface MarkdownConversionResult {
  success: boolean;
  markdown?: string;
  word_count?: number;
  char_count?: number;
  processing_time?: number;
  html_elements_count?: number;
  markdown_elements?: {
    headers: number;
    links: number;
    images: number;
    code_blocks: number;
    lists: number;
  };
  error?: string;
}

export function HTMLToMarkdownConverter() {
  const [htmlInput, setHtmlInput] = useState("");
  const [result, setResult] = useState<MarkdownConversionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("input");
  const { toast } = useToast();

  const sampleHTML = `<!DOCTYPE html>
<html>
<head>
    <title>Sample Document</title>
</head>
<body>
    <h1>Welcome to Our Blog</h1>
    <p>This is a <strong>sample article</strong> with various HTML elements.</p>
    
    <h2>Features</h2>
    <ul>
        <li>Easy to use interface</li>
        <li>Fast conversion</li>
        <li>Clean markdown output</li>
    </ul>
    
    <h3>Code Example</h3>
    <pre><code>function hello() {
    console.log("Hello World!");
}</code></pre>
    
    <p>Visit our <a href="https://example.com">website</a> for more information.</p>
    
    <blockquote>
        <p>This is a quote that demonstrates blockquote conversion.</p>
    </blockquote>
    
    <img src="https://example.com/image.jpg" alt="Sample Image" />
</body>
</html>`;

  const convertToMarkdown = async () => {
    if (!htmlInput.trim()) {
      toast({
        title: "No HTML Input",
        description: "Please enter HTML content to convert",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/tools/html-to-markdown", {
        html: htmlInput.trim()
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        setActiveTab("output");
        toast({
          title: "Conversion Complete",
          description: `Converted ${data.html_elements_count || 0} HTML elements to Markdown`,
        });
      }
    } catch (error) {
      console.error("HTML to Markdown conversion error:", error);
      setResult({
        success: false,
        error: "Failed to convert HTML to Markdown. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadMarkdown = () => {
    if (!result?.markdown) return;

    const blob = new Blob([result.markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `converted-markdown-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setHtmlInput("");
    setResult(null);
    setActiveTab("input");
  };

  const loadSample = () => {
    setHtmlInput(sampleHTML);
    setResult(null);
    setActiveTab("input");
  };

  // Auto-convert on input change with debounce
  useEffect(() => {
    if (!htmlInput.trim()) {
      setResult(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      if (htmlInput.trim() && htmlInput.length > 10) {
        convertToMarkdown();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [htmlInput]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            HTML to Markdown Converter
          </CardTitle>
          <CardDescription>
            Convert HTML content to clean Markdown format. 
            Perfect for documentation, blogs, and content migration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button 
              onClick={convertToMarkdown} 
              disabled={!htmlInput.trim() || isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Convert to Markdown
                </>
              )}
            </Button>
            <Button variant="outline" onClick={loadSample}>
              Sample HTML
            </Button>
            <Button variant="outline" onClick={clearAll}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="input" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                HTML Input
              </TabsTrigger>
              <TabsTrigger value="output" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Markdown Output
              </TabsTrigger>
            </TabsList>

            <TabsContent value="input" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="html-input" className="text-base font-medium">
                  HTML Content
                </Label>
                <Textarea
                  id="html-input"
                  value={htmlInput}
                  onChange={(e) => setHtmlInput(e.target.value)}
                  placeholder="Paste your HTML content here..."
                  className="min-h-[400px] font-mono text-sm"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Characters: {htmlInput.length}</span>
                  <span>Lines: {htmlInput.split('\n').length}</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="output" className="space-y-4">
              {result ? (
                <>
                  {result.success ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">Markdown Output</Label>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(result.markdown || "", "Markdown")}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={downloadMarkdown}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>

                      <Textarea
                        value={result.markdown || ""}
                        readOnly
                        className="min-h-[400px] font-mono text-sm"
                      />

                      {/* Statistics */}
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="default">
                            Processing Time: {result.processing_time || 0}ms
                          </Badge>
                          <Badge variant="outline">
                            Words: {result.word_count || 0}
                          </Badge>
                          <Badge variant="outline">
                            Characters: {result.char_count || 0}
                          </Badge>
                          <Badge variant="outline">
                            HTML Elements: {result.html_elements_count || 0}
                          </Badge>
                        </div>

                        {result.markdown_elements && (
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                            <Badge variant="secondary">
                              Headers: {result.markdown_elements.headers}
                            </Badge>
                            <Badge variant="secondary">
                              Links: {result.markdown_elements.links}
                            </Badge>
                            <Badge variant="secondary">
                              Images: {result.markdown_elements.images}
                            </Badge>
                            <Badge variant="secondary">
                              Code Blocks: {result.markdown_elements.code_blocks}
                            </Badge>
                            <Badge variant="secondary">
                              Lists: {result.markdown_elements.lists}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Alert variant="destructive">
                      <AlertDescription>
                        <strong>Conversion Failed:</strong> {result.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              ) : (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Converted Markdown will appear here</p>
                  <p className="text-sm text-gray-400 mt-2">Start typing HTML in the input tab</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}