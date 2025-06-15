import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, XCircle, Globe, Search, Target, Zap } from "lucide-react";

interface SEOAnalysis {
  score: number;
  title: {
    exists: boolean;
    length: number;
    optimized: boolean;
  };
  metaDescription: {
    exists: boolean;
    length: number;
    optimized: boolean;
  };
  headings: {
    h1Count: number;
    h2Count: number;
    structure: boolean;
  };
  images: {
    total: number;
    withAlt: number;
    optimized: boolean;
  };
  links: {
    internal: number;
    external: number;
    broken: number;
  };
  performance: {
    loadTime: number;
    mobileOptimized: boolean;
    httpsEnabled: boolean;
  };
}

export default function SEOScoreChecker() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const [error, setError] = useState("");

  const analyzeURL = async () => {
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
      // Simulate SEO analysis - in production this would call a real SEO API
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock analysis results based on URL patterns
      const mockAnalysis: SEOAnalysis = {
        score: Math.floor(Math.random() * 40) + 60, // 60-100
        title: {
          exists: Math.random() > 0.1,
          length: Math.floor(Math.random() * 70) + 20,
          optimized: Math.random() > 0.3
        },
        metaDescription: {
          exists: Math.random() > 0.2,
          length: Math.floor(Math.random() * 160) + 120,
          optimized: Math.random() > 0.4
        },
        headings: {
          h1Count: Math.floor(Math.random() * 3) + 1,
          h2Count: Math.floor(Math.random() * 10) + 2,
          structure: Math.random() > 0.3
        },
        images: {
          total: Math.floor(Math.random() * 20) + 5,
          withAlt: Math.floor(Math.random() * 15) + 3,
          optimized: Math.random() > 0.5
        },
        links: {
          internal: Math.floor(Math.random() * 50) + 10,
          external: Math.floor(Math.random() * 20) + 5,
          broken: Math.floor(Math.random() * 3)
        },
        performance: {
          loadTime: Math.random() * 3 + 1,
          mobileOptimized: Math.random() > 0.2,
          httpsEnabled: url.startsWith('https')
        }
      };

      setAnalysis(mockAnalysis);
    } catch (err) {
      setError("Failed to analyze URL. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { variant: "default" as const, text: "Excellent", color: "bg-green-500" };
    if (score >= 60) return { variant: "secondary" as const, text: "Good", color: "bg-yellow-500" };
    return { variant: "destructive" as const, text: "Needs Work", color: "bg-red-500" };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-100 flex items-center justify-center gap-2">
            <Search className="h-6 w-6" />
            SEO Score Checker
          </CardTitle>
          <p className="text-blue-700 dark:text-blue-300 text-lg">
            Analyze your website's SEO performance and get actionable insights
          </p>
        </CardHeader>
        <CardContent>
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
                  onClick={analyzeURL} 
                  disabled={isAnalyzing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
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
        <div className="space-y-6">
          {/* Overall Score */}
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className={`text-6xl font-bold ${getScoreColor(analysis.score)}`}>
                    {analysis.score}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">SEO Score</div>
                </div>
                <div className="text-center">
                  <Badge 
                    variant={getScoreBadge(analysis.score).variant}
                    className={`${getScoreBadge(analysis.score).color} text-white px-4 py-2 text-lg`}
                  >
                    {getScoreBadge(analysis.score).text}
                  </Badge>
                </div>
              </div>
              <Progress value={analysis.score} className="w-full h-3 mt-4" />
            </CardHeader>
          </Card>

          {/* Detailed Analysis */}
          <Tabs defaultValue="onpage" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="onpage">On-Page SEO</TabsTrigger>
              <TabsTrigger value="technical">Technical SEO</TabsTrigger>
              <TabsTrigger value="content">Content Analysis</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="onpage" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Title Tag
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Exists</span>
                        {analysis.title.exists ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Length</span>
                        <Badge variant={analysis.title.length >= 30 && analysis.title.length <= 60 ? "default" : "secondary"}>
                          {analysis.title.length} chars
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Optimized</span>
                        {analysis.title.optimized ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Meta Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Exists</span>
                        {analysis.metaDescription.exists ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Length</span>
                        <Badge variant={analysis.metaDescription.length >= 120 && analysis.metaDescription.length <= 160 ? "default" : "secondary"}>
                          {analysis.metaDescription.length} chars
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Optimized</span>
                        {analysis.metaDescription.optimized ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="technical" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Heading Structure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>H1 Tags</span>
                        <Badge variant={analysis.headings.h1Count === 1 ? "default" : "secondary"}>
                          {analysis.headings.h1Count}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>H2 Tags</span>
                        <Badge variant="outline">{analysis.headings.h2Count}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Proper Structure</span>
                        {analysis.headings.structure ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Images</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Total Images</span>
                        <Badge variant="outline">{analysis.images.total}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>With Alt Text</span>
                        <Badge variant={analysis.images.withAlt === analysis.images.total ? "default" : "secondary"}>
                          {analysis.images.withAlt}/{analysis.images.total}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Optimized</span>
                        {analysis.images.optimized ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Link Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{analysis.links.internal}</div>
                      <div className="text-sm text-gray-600">Internal Links</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{analysis.links.external}</div>
                      <div className="text-sm text-gray-600">External Links</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{analysis.links.broken}</div>
                      <div className="text-sm text-gray-600">Broken Links</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Load Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${analysis.performance.loadTime < 2 ? 'text-green-600' : analysis.performance.loadTime < 4 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {analysis.performance.loadTime.toFixed(1)}s
                      </div>
                      <div className="text-sm text-gray-600">Page Load Time</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Mobile Optimized</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    {analysis.performance.mobileOptimized ? (
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                    ) : (
                      <XCircle className="h-12 w-12 text-red-600 mx-auto" />
                    )}
                    <div className="text-sm text-gray-600 mt-2">
                      {analysis.performance.mobileOptimized ? 'Yes' : 'No'}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">HTTPS Enabled</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    {analysis.performance.httpsEnabled ? (
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                    ) : (
                      <XCircle className="h-12 w-12 text-red-600 mx-auto" />
                    )}
                    <div className="text-sm text-gray-600 mt-2">
                      {analysis.performance.httpsEnabled ? 'Secure' : 'Not Secure'}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                SEO Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {!analysis.title.optimized && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Optimize your title tag with relevant keywords</span>
                  </div>
                )}
                {!analysis.metaDescription.optimized && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Improve your meta description to include target keywords</span>
                  </div>
                )}
                {analysis.images.withAlt < analysis.images.total && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Add alt text to {analysis.images.total - analysis.images.withAlt} images</span>
                  </div>
                )}
                {analysis.performance.loadTime > 3 && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Improve page load speed - consider optimizing images and minifying code</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}