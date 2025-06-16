import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  LinkIcon, 
  Download, 
  Copy, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Globe,
  ArrowRight,
  Shield,
  Eye,
  RotateCcw,
  FileText,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RedirectStep {
  step: number;
  url: string;
  status_code?: number;
  status_text?: string;
  domain: string;
  protocol: string;
  response_time: number;
  is_redirect?: boolean;
  is_final?: boolean;
  is_error?: boolean;
  redirect_to?: string;
  error?: string;
  headers?: Record<string, string>;
  meta_refresh?: string;
}

interface RedirectSummary {
  status: string;
  status_text: string;
  redirect_count: number;
  total_steps: number;
  final_url: string;
  final_status_code: number;
  total_time: number;
  protocol_warning: boolean;
  has_errors: boolean;
  original_url: string;
  url_changed: boolean;
}

interface RedirectAnalysis {
  success: boolean;
  chain: RedirectStep[];
  summary: RedirectSummary;
  original_url: string;
  total_time: number;
  error?: string;
}

export function SmartRedirectChainChecker() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<RedirectAnalysis | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();

  const analyzeRedirects = async () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to analyze",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const response = await fetch("/api/tools/redirect-chain/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: url.trim() })
      });

      const result = await response.json();

      if (result.success) {
        setAnalysis(result);
        toast({
          title: "Analysis Complete",
          description: `Found ${result.summary.redirect_count} redirects in ${result.total_time}ms`
        });
      } else {
        throw new Error(result.error || "Analysis failed");
      }
    } catch (error) {
      console.error("Redirect analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze redirects",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadReport = async (format: 'text' | 'json' = 'text') => {
    if (!analysis) return;

    try {
      const response = await fetch("/api/tools/redirect-chain/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ result: analysis, format })
      });

      const data = await response.json();
      
      if (data.report) {
        const blob = new Blob([data.report], { 
          type: format === 'json' ? 'application/json' : 'text/plain' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `redirect-analysis-${Date.now()}.${format === 'json' ? 'json' : 'txt'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: "Report Downloaded",
          description: `Analysis report downloaded as ${format.toUpperCase()}`
        });
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to generate report",
        variant: "destructive"
      });
    }
  };

  const copyReport = async () => {
    if (!analysis) return;

    try {
      const response = await fetch("/api/tools/redirect-chain/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ result: analysis, format: 'text' })
      });

      const data = await response.json();
      
      if (data.report) {
        await navigator.clipboard.writeText(data.report);
        toast({
          title: "Report Copied",
          description: "Analysis report copied to clipboard"
        });
      }
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy report",
        variant: "destructive"
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'success': return 'default';
      case 'error': return 'destructive';
      case 'loop': return 'destructive';
      case 'direct': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (step: RedirectStep) => {
    if (step.error) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (step.is_final) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (step.is_redirect) return <ArrowRight className="h-4 w-4 text-blue-500" />;
    return <Globe className="h-4 w-4 text-gray-500" />;
  };

  const getStepColor = (step: RedirectStep) => {
    if (step.error) return 'bg-red-50 border-red-200';
    if (step.is_final && step.status_code === 200) return 'bg-green-50 border-green-200';
    if (step.is_redirect) return 'bg-blue-50 border-blue-200';
    return 'bg-gray-50 border-gray-200';
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getDomainFavicon = (domain: string) => {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
  };

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* URL Input Section */}
      <Card className="shadow-lg">
        <CardContent className="space-y-4 pt-6">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="url" className="sr-only">URL to analyze</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isAnalyzing && analyzeRedirects()}
                className="text-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              />
            </div>
            <Button 
              onClick={analyzeRedirects} 
              disabled={isAnalyzing || !url.trim()}
              className="px-8"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Analyze Chain
                </>
              )}
            </Button>
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <Progress value={undefined} className="h-2" />
              <p className="text-sm text-muted-foreground text-center">
                Following redirect chain... This may take a few seconds
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Summary Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Analysis Summary
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyReport}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Report
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadReport('text')}>
                    <FileText className="h-4 w-4 mr-2" />
                    TXT Report
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadReport('json')}>
                    <Download className="h-4 w-4 mr-2" />
                    JSON Report
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="pt-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{analysis.summary.redirect_count}</div>
                    <div className="text-sm text-blue-700">Total Redirects</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                  <CardContent className="pt-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{formatTime(analysis.total_time)}</div>
                    <div className="text-sm text-green-700">Total Time</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="pt-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{analysis.summary.final_status_code}</div>
                    <div className="text-sm text-purple-700">Final Status</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusBadgeVariant(analysis.summary.status)}>
                    {analysis.summary.status_text}
                  </Badge>
                  {analysis.summary.protocol_warning && (
                    <Badge variant="destructive">
                      <Shield className="h-3 w-3 mr-1" />
                      HTTPS → HTTP Downgrade
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Original URL:</strong> 
                    <div className="break-all text-muted-foreground">{analysis.original_url}</div>
                  </div>
                  <div>
                    <strong>Final URL:</strong> 
                    <div className="break-all text-muted-foreground">{analysis.summary.final_url}</div>
                  </div>
                </div>

                {analysis.summary.protocol_warning && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Security Warning: This redirect chain includes a downgrade from HTTPS to HTTP, 
                      which may expose user data to interception.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Redirect Chain Visualization */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-orange-500" />
                Redirect Chain Flow
              </CardTitle>
              <CardDescription>
                Visual representation of the complete redirect chain with timing and status information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.chain.map((step, index) => (
                  <div 
                    key={step.step} 
                    className={`relative p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${getStepColor(step)}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white border-2 border-current flex items-center justify-center font-bold text-sm">
                          {step.step}
                        </div>
                        {getStatusIcon(step)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <img 
                            src={getDomainFavicon(step.domain)} 
                            alt=""
                            className="w-4 h-4"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          <span className="font-medium text-sm">{step.domain}</span>
                          <Badge variant="outline" className="text-xs">
                            {step.protocol.toUpperCase()}
                          </Badge>
                        </div>

                        <div className="text-sm font-mono break-all text-gray-700 mb-2">
                          {step.url}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {step.status_code && (
                            <span className="flex items-center gap-1">
                              <Badge variant="secondary" className="text-xs">
                                {step.status_code}
                              </Badge>
                              {step.status_text}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(step.response_time)}
                          </span>
                        </div>

                        {step.error && (
                          <Alert variant="destructive" className="mt-2">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                              {step.error}
                            </AlertDescription>
                          </Alert>
                        )}

                        {step.meta_refresh && (
                          <Alert className="mt-2">
                            <AlertDescription className="text-sm">
                              Meta refresh detected: {step.meta_refresh}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>

                      {step.redirect_to && (
                        <div className="flex-shrink-0">
                          <ArrowRight className="h-5 w-5 text-blue-500" />
                        </div>
                      )}
                    </div>

                    {index < analysis.chain.length - 1 && (
                      <div className="absolute left-8 -bottom-2 w-0.5 h-4 bg-gray-300"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Technical Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="headers" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="headers">Response Headers</TabsTrigger>
                  <TabsTrigger value="timing">Performance</TabsTrigger>
                  <TabsTrigger value="security">Security Analysis</TabsTrigger>
                </TabsList>
                
                <TabsContent value="headers" className="space-y-4">
                  {analysis.chain.map((step) => (
                    step.headers && (
                      <div key={step.step} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Step {step.step} Headers</h4>
                        <div className="space-y-1 text-sm font-mono">
                          {Object.entries(step.headers).slice(0, 10).map(([key, value]) => (
                            <div key={key} className="flex">
                              <span className="text-blue-600 min-w-0 w-1/3">{key}:</span>
                              <span className="text-gray-700 break-all">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </TabsContent>
                
                <TabsContent value="timing" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Response Times</h4>
                      {analysis.chain.map((step) => (
                        <div key={step.step} className="flex justify-between items-center text-sm">
                          <span>Step {step.step}</span>
                          <Badge variant="outline">{formatTime(step.response_time)}</Badge>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Performance Metrics</h4>
                      <div className="text-sm space-y-1">
                        <div>Total Time: <strong>{formatTime(analysis.total_time)}</strong></div>
                        <div>Average per Step: <strong>{formatTime(analysis.total_time / analysis.chain.length)}</strong></div>
                        <div>Fastest Step: <strong>{formatTime(Math.min(...analysis.chain.map(s => s.response_time)))}</strong></div>
                        <div>Slowest Step: <strong>{formatTime(Math.max(...analysis.chain.map(s => s.response_time)))}</strong></div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="security" className="space-y-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Protocol Analysis</h4>
                        <div className="space-y-2 text-sm">
                          {analysis.chain.map((step) => (
                            <div key={step.step} className="flex items-center gap-2">
                              <Badge variant={step.protocol === 'https' ? 'default' : 'destructive'}>
                                {step.protocol.toUpperCase()}
                              </Badge>
                              <span className="text-muted-foreground">Step {step.step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Security Recommendations</h4>
                        <div className="space-y-2 text-sm">
                          {analysis.summary.protocol_warning && (
                            <Alert variant="destructive">
                              <AlertDescription>
                                Fix HTTPS to HTTP downgrade in redirect chain
                              </AlertDescription>
                            </Alert>
                          )}
                          {analysis.summary.redirect_count > 3 && (
                            <Alert>
                              <AlertDescription>
                                Consider reducing redirect chain length for better performance
                              </AlertDescription>
                            </Alert>
                          )}
                          {analysis.summary.redirect_count === 0 && (
                            <Alert>
                              <AlertDescription>
                                No redirects detected - optimal setup
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}