import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  Globe, 
  Clock, 
  Smartphone, 
  Monitor, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Download,
  ExternalLink,
  RefreshCw,
  Share,
  FileDown,
  Activity,
  Target,
  TrendingUp
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface CoreWebVitals {
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
  tti: number;
  tbt: number;
}

interface PageMetrics {
  page_title: string;
  load_time: number;
  page_size: number;
  num_requests: number;
  performance_score: number;
  accessibility_score: number;
  best_practices_score: number;
  seo_score: number;
}

interface Issue {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

interface Suggestion {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

interface SpeedTestResult {
  success: boolean;
  url: string;
  timestamp: string;
  core_web_vitals: CoreWebVitals;
  metrics: PageMetrics;
  issues: Issue[];
  suggestions: Suggestion[];
  test_id: string;
}

export function AdvancedPageSpeedChecker() {
  const [url, setUrl] = useState('');
  const [strategy, setStrategy] = useState<'mobile' | 'desktop'>('desktop');
  const [results, setResults] = useState<SpeedTestResult | null>(null);
  const { toast } = useToast();

  const speedTestMutation = useMutation({
    mutationFn: async ({ url, strategy }: { url: string; strategy: 'mobile' | 'desktop' }) => {
      const response = await apiRequest('POST', '/api/pagespeed/analyze', {
        url,
        strategy,
        categories: ['PERFORMANCE', 'ACCESSIBILITY', 'BEST_PRACTICES', 'SEO']
      });
      return response.json();
    },
    onSuccess: (data: SpeedTestResult) => {
      setResults(data);
      toast({
        title: "Speed Test Complete",
        description: `Performance score: ${data.metrics.performance_score}/100`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Speed Test Failed",
        description: error.message || "Unable to analyze the website. Please check the URL and try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a valid URL to analyze.",
        variant: "destructive",
      });
      return;
    }

    if (!url.match(/^https?:\/\/.+/)) {
      toast({
        title: "Invalid URL",
        description: "URL must start with http:// or https://",
        variant: "destructive",
      });
      return;
    }

    speedTestMutation.mutate({ url: url.trim(), strategy });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 50) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 90) return 'default';
    if (score >= 50) return 'secondary';
    return 'destructive';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const shareResults = () => {
    if (results && navigator.share) {
      navigator.share({
        title: `Page Speed Test Results for ${results.url}`,
        text: `Performance Score: ${results.metrics.performance_score}/100`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Results link copied to clipboard",
      });
    }
  };

  const downloadReport = () => {
    if (!results) return;
    
    const reportData = {
      url: results.url,
      timestamp: results.timestamp,
      scores: {
        performance: results.metrics.performance_score,
        accessibility: results.metrics.accessibility_score,
        bestPractices: results.metrics.best_practices_score,
        seo: results.metrics.seo_score
      },
      metrics: results.core_web_vitals,
      pageInfo: {
        title: results.metrics.page_title,
        size: formatBytes(results.metrics.page_size),
        requests: results.metrics.num_requests,
        loadTime: formatTime(results.metrics.load_time * 1000)
      },
      issues: results.issues,
      suggestions: results.suggestions
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `speed-test-${results.test_id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Downloaded",
      description: "Speed test report saved to your device",
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Page Speed Test
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Analyze your website's performance with Google PageSpeed Insights. 
          Get detailed metrics, Core Web Vitals, and optimization recommendations.
        </p>
      </div>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Website Speed Analysis
          </CardTitle>
          <CardDescription>
            Enter a URL to analyze its performance, accessibility, and SEO metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="text-lg"
                  disabled={speedTestMutation.isPending}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={strategy === 'desktop' ? 'default' : 'outline'}
                  onClick={() => setStrategy('desktop')}
                  disabled={speedTestMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <Monitor className="h-4 w-4" />
                  Desktop
                </Button>
                <Button
                  type="button"
                  variant={strategy === 'mobile' ? 'default' : 'outline'}
                  onClick={() => setStrategy('mobile')}
                  disabled={speedTestMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <Smartphone className="h-4 w-4" />
                  Mobile
                </Button>
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={speedTestMutation.isPending}
              className="w-full sm:w-auto text-lg py-3 px-8"
            >
              {speedTestMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-5 w-5" />
                  Test Speed
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Loading State */}
      {speedTestMutation.isPending && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="animate-pulse">
                <Activity className="h-12 w-12 mx-auto text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Analyzing Your Website</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  This may take 30-60 seconds. We're gathering performance data from Google PageSpeed Insights.
                </p>
              </div>
              <Progress value={undefined} className="w-full max-w-md mx-auto" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Results Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Speed Test Results
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <ExternalLink className="h-4 w-4" />
                    <a 
                      href={results.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate max-w-md"
                    >
                      {results.url}
                    </a>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={shareResults}>
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadReport}>
                    <FileDown className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => speedTestMutation.mutate({ url, strategy })}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retest
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Score Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className={getScoreColor(results.metrics.performance_score)}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{results.metrics.performance_score}</div>
                  <div className="text-sm font-medium">Performance</div>
                </div>
              </CardContent>
            </Card>
            <Card className={getScoreColor(results.metrics.accessibility_score)}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{results.metrics.accessibility_score}</div>
                  <div className="text-sm font-medium">Accessibility</div>
                </div>
              </CardContent>
            </Card>
            <Card className={getScoreColor(results.metrics.best_practices_score)}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{results.metrics.best_practices_score}</div>
                  <div className="text-sm font-medium">Best Practices</div>
                </div>
              </CardContent>
            </Card>
            <Card className={getScoreColor(results.metrics.seo_score)}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{results.metrics.seo_score}</div>
                  <div className="text-sm font-medium">SEO</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results */}
          <Tabs defaultValue="metrics" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="metrics">Core Metrics</TabsTrigger>
              <TabsTrigger value="vitals">Web Vitals</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            </TabsList>

            <TabsContent value="metrics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Load Time</p>
                        <p className="text-2xl font-bold">{formatTime(results.metrics.load_time * 1000)}</p>
                      </div>
                      <Clock className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Page Size</p>
                        <p className="text-2xl font-bold">{formatBytes(results.metrics.page_size)}</p>
                      </div>
                      <Target className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Requests</p>
                        <p className="text-2xl font-bold">{results.metrics.num_requests}</p>
                      </div>
                      <Activity className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Page Title</p>
                        <p className="text-sm font-medium truncate">{results.metrics.page_title}</p>
                      </div>
                      <Globe className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="vitals" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">First Contentful Paint</span>
                        <Badge variant="outline">{formatTime(results.core_web_vitals.fcp * 1000)}</Badge>
                      </div>
                      <Progress value={Math.min(100, (4000 - results.core_web_vitals.fcp * 1000) / 40)} />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Largest Contentful Paint</span>
                        <Badge variant="outline">{formatTime(results.core_web_vitals.lcp * 1000)}</Badge>
                      </div>
                      <Progress value={Math.min(100, (4000 - results.core_web_vitals.lcp * 1000) / 40)} />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Time to Interactive</span>
                        <Badge variant="outline">{formatTime(results.core_web_vitals.tti * 1000)}</Badge>
                      </div>
                      <Progress value={Math.min(100, (6000 - results.core_web_vitals.tti * 1000) / 60)} />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Cumulative Layout Shift</span>
                        <Badge variant="outline">{results.core_web_vitals.cls.toFixed(3)}</Badge>
                      </div>
                      <Progress value={Math.min(100, (0.25 - results.core_web_vitals.cls) / 0.0025)} />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total Blocking Time</span>
                        <Badge variant="outline">{formatTime(results.core_web_vitals.tbt)}</Badge>
                      </div>
                      <Progress value={Math.min(100, (600 - results.core_web_vitals.tbt) / 6)} />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">First Input Delay</span>
                        <Badge variant="outline">{formatTime(results.core_web_vitals.fid)}</Badge>
                      </div>
                      <Progress value={Math.min(100, (300 - results.core_web_vitals.fid) / 3)} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="issues" className="space-y-4">
              {results.issues.length > 0 ? (
                <div className="space-y-3">
                  {results.issues.map((issue, index) => (
                    <Alert key={index} className={getSeverityColor(issue.severity)}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{issue.title}</h4>
                            <Badge variant={issue.severity === 'high' ? 'destructive' : issue.severity === 'medium' ? 'secondary' : 'outline'}>
                              {issue.severity}
                            </Badge>
                          </div>
                          <p className="text-sm">{issue.description}</p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                      <p>No critical issues found! Your website is performing well.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4">
              {results.suggestions.length > 0 ? (
                <div className="space-y-3">
                  {results.suggestions.map((suggestion, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{suggestion.title}</h4>
                            <Badge variant={suggestion.impact === 'high' ? 'default' : suggestion.impact === 'medium' ? 'secondary' : 'outline'}>
                              {suggestion.impact} impact
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{suggestion.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <TrendingUp className="h-12 w-12 mx-auto mb-2 text-blue-500" />
                      <p>No optimization suggestions at this time. Your website is well optimized!</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}