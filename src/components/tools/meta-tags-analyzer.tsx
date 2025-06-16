import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, XCircle, Tags, Copy, Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MetaTag {
  name: string;
  content: string;
  status: "good" | "warning" | "error";
  recommendation?: string;
}

interface MetaAnalysis {
  title: {
    content: string;
    length: number;
    status: "good" | "warning" | "error";
  };
  description: {
    content: string;
    length: number;
    status: "good" | "warning" | "error";
  };
  keywords: string[];
  viewport: string;
  robots: string;
  canonical: string;
  ogTags: MetaTag[];
  twitterTags: MetaTag[];
  structuredData: any[];
  httpEquiv: MetaTag[];
  customTags: MetaTag[];
}

export default function MetaTagsAnalyzer() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<MetaAnalysis | null>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const analyzeMetaTags = async () => {
    if (!url) {
      setError("Please enter a valid URL");
      return;
    }

    if (!url.match(/^https?:\/\/.+/)) {
      setError("Please enter a valid URL starting with http:// or https://");
      return;
    }

    setIsAnalyzing(true);
    setError("");

    try {
      // Fetch and analyze actual webpage meta tags
      const response = await fetch('/api/seo/meta-tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze meta tags');
      }

      const analysisData = await response.json();
      setAnalysis(analysisData);
    } catch (err) {
      setError("Failed to analyze meta tags. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  const generateMetaTagsCode = () => {
    if (!analysis) return "";
    
    return `<!-- Basic Meta Tags -->
<title>${analysis.title.content}</title>
<meta name="description" content="${analysis.description.content}">
<meta name="keywords" content="${analysis.keywords.join(", ")}">
<meta name="viewport" content="${analysis.viewport}">
<meta name="robots" content="${analysis.robots}">
<link rel="canonical" href="${analysis.canonical}">

<!-- Open Graph Meta Tags -->
${analysis.ogTags.map(tag => `<meta property="${tag.name}" content="${tag.content}">`).join('\n')}

<!-- Twitter Meta Tags -->
${analysis.twitterTags.map(tag => `<meta name="${tag.name}" content="${tag.content}">`).join('\n')}

<!-- Additional Meta Tags -->
${analysis.httpEquiv.map(tag => `<meta http-equiv="${tag.name}" content="${tag.content}">`).join('\n')}
${analysis.customTags.map(tag => `<meta name="${tag.name}" content="${tag.content}">`).join('\n')}`;
  };

  const getStatusIcon = (status: "good" | "warning" | "error") => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: "good" | "warning" | "error") => {
    switch (status) {
      case "good":
        return <Badge className="bg-green-500 text-white">Good</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500 text-white">Warning</Badge>;
      case "error":
        return <Badge className="bg-red-500 text-white">Error</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Input Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="url" className="text-sm font-medium">Website URL</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={analyzeMetaTags} 
                  disabled={isAnalyzing}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Tags className="h-4 w-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-950 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {analysis && (
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Tags</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="structured">Structured Data</TabsTrigger>
            <TabsTrigger value="export">Export Code</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title Tag */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    Title Tag
                    {getStatusBadge(analysis.title.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm font-mono">{analysis.title.content}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Length:</span>
                      <Badge variant={analysis.title.length >= 30 && analysis.title.length <= 60 ? "default" : "secondary"}>
                        {analysis.title.length} characters
                      </Badge>
                    </div>
                    {analysis.title.length < 30 && (
                      <p className="text-xs text-yellow-600">Consider making your title longer (30-60 characters)</p>
                    )}
                    {analysis.title.length > 60 && (
                      <p className="text-xs text-yellow-600">Title might be too long, consider shortening it</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Meta Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    Meta Description
                    {getStatusBadge(analysis.description.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm">{analysis.description.content}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Length:</span>
                      <Badge variant={analysis.description.length >= 120 && analysis.description.length <= 160 ? "default" : "secondary"}>
                        {analysis.description.length} characters
                      </Badge>
                    </div>
                    {analysis.description.length < 120 && (
                      <p className="text-xs text-yellow-600">Consider making your description longer (120-160 characters)</p>
                    )}
                    {analysis.description.length > 160 && (
                      <p className="text-xs text-yellow-600">Description might be too long, consider shortening it</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Keywords and Other Basic Tags */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline">{keyword}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Viewport</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    {analysis.viewport}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Robots</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    {analysis.robots}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Open Graph Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Open Graph Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.ogTags.map((tag, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{tag.name}</span>
                          {getStatusIcon(tag.status)}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded">
                          {tag.content || "Not set"}
                        </p>
                        {tag.recommendation && (
                          <p className="text-xs text-yellow-600 mt-1">{tag.recommendation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Twitter Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Twitter Card Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.twitterTags.map((tag, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{tag.name}</span>
                          {getStatusIcon(tag.status)}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded">
                          {tag.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* HTTP Equiv Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">HTTP-Equiv Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.httpEquiv.map((tag, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{tag.name}</span>
                          {getStatusIcon(tag.status)}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded">
                          {tag.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Custom Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.customTags.map((tag, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{tag.name}</span>
                          {getStatusIcon(tag.status)}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded">
                          {tag.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Canonical URL */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Canonical URL</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded flex-1">
                    {analysis.canonical}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(analysis.canonical)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="structured" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Structured Data (JSON-LD)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.structuredData.map((schema, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline">{schema["@type"]}</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(JSON.stringify(schema, null, 2))}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <pre className="text-xs bg-gray-50 dark:bg-gray-800 p-3 rounded overflow-x-auto">
                        {JSON.stringify(schema, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Complete Meta Tags Code
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(generateMetaTagsCode())}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy All
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const blob = new Blob([generateMetaTagsCode()], { type: 'text/html' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'meta-tags.html';
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-gray-50 dark:bg-gray-800 p-4 rounded overflow-x-auto whitespace-pre-wrap">
                  {generateMetaTagsCode()}
                </pre>
              </CardContent>
            </Card>

            {/* SEO Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">SEO Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.title.status !== "good" && (
                    <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Title Tag Optimization</p>
                        <p className="text-xs text-gray-600">Ensure your title is 30-60 characters and includes target keywords</p>
                      </div>
                    </div>
                  )}
                  {analysis.description.status !== "good" && (
                    <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Meta Description Optimization</p>
                        <p className="text-xs text-gray-600">Keep description between 120-160 characters with compelling copy</p>
                      </div>
                    </div>
                  )}
                  {!analysis.ogTags.find(tag => tag.name === "og:image")?.content && (
                    <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <Eye className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Add Open Graph Image</p>
                        <p className="text-xs text-gray-600">Include an og:image for better social media sharing appearance</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}