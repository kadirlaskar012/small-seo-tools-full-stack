import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Globe, Clock, Smartphone, Monitor, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface SpeedMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  overallScore: number;
  recommendations: string[];
  insights: string;
  deviceType: 'mobile' | 'desktop';
  pageSize: number;
  requestCount: number;
  optimizationSuggestions: Array<{
    category: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    solution: string;
  }>;
}

export function PageSpeedChecker() {
  const [url, setUrl] = useState('');
  const [deviceType, setDeviceType] = useState<'mobile' | 'desktop'>('desktop');
  const [results, setResults] = useState<SpeedMetrics | null>(null);

  const speedCheckMutation = useMutation({
    mutationFn: async ({ url, deviceType }: { url: string; deviceType: 'mobile' | 'desktop' }) => {
      const response = await apiRequest('/api/tools/page-speed-check', {
        method: 'POST',
        body: JSON.stringify({ url, deviceType }),
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    onSuccess: (data) => {
      setResults(data);
    },
    onError: (error) => {
      console.error('Speed check failed:', error);
    }
  });

  const handleAnalyze = () => {
    if (!url.trim()) return;
    
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    speedCheckMutation.mutate({ url: formattedUrl, deviceType });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { variant: 'default' as const, label: 'Good', color: 'bg-green-500' };
    if (score >= 50) return { variant: 'secondary' as const, label: 'Needs Improvement', color: 'bg-yellow-500' };
    return { variant: 'destructive' as const, label: 'Poor', color: 'bg-red-500' };
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Page Speed Analyzer
          </CardTitle>
          <CardDescription>
            Analyze website performance with real-time metrics and AI-powered optimization recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="url"
                placeholder="Enter website URL (e.g., example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={deviceType === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDeviceType('desktop')}
              >
                <Monitor className="h-4 w-4 mr-2" />
                Desktop
              </Button>
              <Button
                variant={deviceType === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDeviceType('mobile')}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile
              </Button>
            </div>
            <Button 
              onClick={handleAnalyze}
              disabled={speedCheckMutation.isPending || !url.trim()}
            >
              {speedCheckMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(results.overallScore)}`}>
                    {results.overallScore}
                  </div>
                  <div className="text-sm text-gray-600">Overall Score</div>
                </div>
                <div className="flex-1 mx-8">
                  <Progress value={results.overallScore} className="h-3" />
                </div>
                <Badge {...getScoreBadge(results.overallScore)}>
                  {getScoreBadge(results.overallScore).label}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold">{results.loadTime.toFixed(2)}s</div>
                  <div className="text-gray-600">Load Time</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold">{(results.pageSize / 1024 / 1024).toFixed(2)}MB</div>
                  <div className="text-gray-600">Page Size</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold">{results.requestCount}</div>
                  <div className="text-gray-600">Requests</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold">{results.deviceType}</div>
                  <div className="text-gray-600">Device</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Core Web Vitals */}
          <Card>
            <CardHeader>
              <CardTitle>Core Web Vitals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">First Contentful Paint</div>
                  <div className="text-2xl font-bold">{results.firstContentfulPaint.toFixed(2)}s</div>
                  <Progress value={Math.min(100, (4 - results.firstContentfulPaint) * 25)} className="mt-2" />
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Largest Contentful Paint</div>
                  <div className="text-2xl font-bold">{results.largestContentfulPaint.toFixed(2)}s</div>
                  <Progress value={Math.min(100, (4 - results.largestContentfulPaint) * 25)} className="mt-2" />
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Cumulative Layout Shift</div>
                  <div className="text-2xl font-bold">{results.cumulativeLayoutShift.toFixed(3)}</div>
                  <Progress value={Math.min(100, (0.25 - results.cumulativeLayoutShift) * 400)} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{results.insights}</p>
              </div>
            </CardContent>
          </Card>

          {/* Optimization Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle>Optimization Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.optimizationSuggestions.map((suggestion, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      {getImpactIcon(suggestion.impact)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{suggestion.category}</h4>
                          <Badge variant={suggestion.impact === 'high' ? 'destructive' : suggestion.impact === 'medium' ? 'secondary' : 'default'}>
                            {suggestion.impact} impact
                          </Badge>
                        </div>
                        <p className="text-gray-700 mb-2">{suggestion.description}</p>
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <strong>Solution:</strong> {suggestion.solution}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Wins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span className="text-sm text-blue-800">{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}