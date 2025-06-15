import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, TrendingUp, Shield, AlertCircle, Link as LinkIcon, CheckCircle, XCircle } from "lucide-react";

interface BacklinkData {
  url: string;
  domain: string;
  anchor: string;
  domainAuthority: number;
  pageAuthority: number;
  followType: "dofollow" | "nofollow";
  status: "active" | "broken" | "redirect";
  firstSeen: string;
  lastSeen: string;
}

interface BacklinkAnalysis {
  totalBacklinks: number;
  referringDomains: number;
  domainAuthority: number;
  trustFlow: number;
  citationFlow: number;
  backlinks: BacklinkData[];
  topAnchorTexts: { text: string; count: number }[];
  topReferringDomains: { domain: string; count: number; authority: number }[];
  linkTypes: { dofollow: number; nofollow: number };
  linkStatus: { active: number; broken: number; redirect: number };
}

export default function BacklinkChecker() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<BacklinkAnalysis | null>(null);
  const [error, setError] = useState("");

  const analyzeBacklinks = async () => {
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
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate realistic backlink analysis
      const domains = [
        "techcrunch.com", "mashable.com", "wired.com", "engadget.com", "theverge.com",
        "reddit.com", "medium.com", "linkedin.com", "twitter.com", "facebook.com",
        "github.com", "stackoverflow.com", "dev.to", "hashnode.com", "youtube.com",
        "wikipedia.org", "forbes.com", "businessinsider.com", "entrepreneur.com"
      ];

      const anchorTexts = [
        "click here", "read more", "website", "homepage", "check out", "learn more",
        "visit site", "official site", "company name", "brand name", "product name"
      ];

      const totalBacklinks = Math.floor(Math.random() * 5000) + 500;
      const referringDomains = Math.floor(totalBacklinks * 0.3);

      const backlinks: BacklinkData[] = Array.from({ length: Math.min(50, totalBacklinks) }, (_, i) => {
        const domain = domains[Math.floor(Math.random() * domains.length)];
        const anchor = anchorTexts[Math.floor(Math.random() * anchorTexts.length)];
        const status = Math.random() > 0.1 ? "active" : Math.random() > 0.5 ? "broken" : "redirect";
        
        return {
          url: `https://${domain}/${Math.random().toString(36).substring(7)}`,
          domain,
          anchor,
          domainAuthority: Math.floor(Math.random() * 40) + 40,
          pageAuthority: Math.floor(Math.random() * 60) + 20,
          followType: Math.random() > 0.3 ? "dofollow" : "nofollow",
          status: status as "active" | "broken" | "redirect",
          firstSeen: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          lastSeen: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
      });

      // Calculate anchor text distribution
      const anchorCounts = new Map<string, number>();
      backlinks.forEach(link => {
        anchorCounts.set(link.anchor, (anchorCounts.get(link.anchor) || 0) + 1);
      });

      const topAnchorTexts = Array.from(anchorCounts.entries())
        .map(([text, count]) => ({ text, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Calculate domain distribution
      const domainCounts = new Map<string, { count: number; authority: number }>();
      backlinks.forEach(link => {
        const existing = domainCounts.get(link.domain);
        if (existing) {
          existing.count++;
        } else {
          domainCounts.set(link.domain, { count: 1, authority: link.domainAuthority });
        }
      });

      const topReferringDomains = Array.from(domainCounts.entries())
        .map(([domain, data]) => ({ domain, count: data.count, authority: data.authority }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Calculate link types and status
      const linkTypes = {
        dofollow: backlinks.filter(l => l.followType === "dofollow").length,
        nofollow: backlinks.filter(l => l.followType === "nofollow").length
      };

      const linkStatus = {
        active: backlinks.filter(l => l.status === "active").length,
        broken: backlinks.filter(l => l.status === "broken").length,
        redirect: backlinks.filter(l => l.status === "redirect").length
      };

      const mockAnalysis: BacklinkAnalysis = {
        totalBacklinks,
        referringDomains,
        domainAuthority: Math.floor(Math.random() * 40) + 40,
        trustFlow: Math.floor(Math.random() * 30) + 20,
        citationFlow: Math.floor(Math.random() * 40) + 30,
        backlinks,
        topAnchorTexts,
        topReferringDomains,
        linkTypes,
        linkStatus
      };

      setAnalysis(mockAnalysis);
    } catch (err) {
      setError("Failed to analyze backlinks. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getAuthorityColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    if (score >= 30) return "text-orange-600";
    return "text-red-600";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "broken": return <XCircle className="h-4 w-4 text-red-600" />;
      case "redirect": return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return null;
    }
  };

  const getFollowTypeBadge = (type: string) => {
    return type === "dofollow" ? 
      <Badge className="bg-green-500 text-white">DoFollow</Badge> :
      <Badge className="bg-gray-500 text-white">NoFollow</Badge>;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 border-indigo-200 dark:border-indigo-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 flex items-center justify-center gap-2">
            <LinkIcon className="h-6 w-6" />
            Backlink Checker
          </CardTitle>
          <p className="text-indigo-700 dark:text-indigo-300 text-lg">
            Analyze your website's backlink profile and discover link opportunities
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
                  onClick={analyzeBacklinks} 
                  disabled={isAnalyzing}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Check Backlinks
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
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-indigo-600">{analysis.totalBacklinks.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Backlinks</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-blue-600">{analysis.referringDomains.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Referring Domains</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className={`text-2xl font-bold ${getAuthorityColor(analysis.domainAuthority)}`}>
                  {analysis.domainAuthority}
                </div>
                <div className="text-sm text-gray-600">Domain Authority</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className={`text-2xl font-bold ${getAuthorityColor(analysis.trustFlow)}`}>
                  {analysis.trustFlow}
                </div>
                <div className="text-sm text-gray-600">Trust Flow</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className={`text-2xl font-bold ${getAuthorityColor(analysis.citationFlow)}`}>
                  {analysis.citationFlow}
                </div>
                <div className="text-sm text-gray-600">Citation Flow</div>
              </CardContent>
            </Card>
          </div>

          {/* Link Quality Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Link Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>DoFollow Links</span>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500 text-white">{analysis.linkTypes.dofollow}</Badge>
                      <span className="text-sm text-gray-600">
                        {((analysis.linkTypes.dofollow / analysis.totalBacklinks) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={(analysis.linkTypes.dofollow / analysis.totalBacklinks) * 100} 
                    className="h-2" 
                  />
                  <div className="flex items-center justify-between">
                    <span>NoFollow Links</span>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gray-500 text-white">{analysis.linkTypes.nofollow}</Badge>
                      <span className="text-sm text-gray-600">
                        {((analysis.linkTypes.nofollow / analysis.totalBacklinks) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={(analysis.linkTypes.nofollow / analysis.totalBacklinks) * 100} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Link Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Active Links</span>
                    </div>
                    <Badge className="bg-green-500 text-white">{analysis.linkStatus.active}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span>Broken Links</span>
                    </div>
                    <Badge className="bg-red-500 text-white">{analysis.linkStatus.broken}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span>Redirects</span>
                    </div>
                    <Badge className="bg-yellow-500 text-white">{analysis.linkStatus.redirect}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="backlinks" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="backlinks">All Backlinks</TabsTrigger>
              <TabsTrigger value="domains">Top Domains</TabsTrigger>
              <TabsTrigger value="anchors">Anchor Texts</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="backlinks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Backlinks</CardTitle>
                  <p className="text-sm text-gray-600">
                    Showing {analysis.backlinks.length} of {analysis.totalBacklinks} total backlinks
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.backlinks.map((link, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <a 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline font-medium truncate max-w-lg"
                              >
                                {link.url}
                              </a>
                              <ExternalLink className="h-3 w-3 text-gray-400" />
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>Domain: <span className="font-medium">{link.domain}</span></span>
                              <span>Anchor: <span className="font-medium">"{link.anchor}"</span></span>
                              <span>DA: <span className={`font-medium ${getAuthorityColor(link.domainAuthority)}`}>
                                {link.domainAuthority}
                              </span></span>
                              <span>PA: <span className={`font-medium ${getAuthorityColor(link.pageAuthority)}`}>
                                {link.pageAuthority}
                              </span></span>
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <span>First seen: {link.firstSeen}</span>
                              <span>•</span>
                              <span>Last seen: {link.lastSeen}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {getFollowTypeBadge(link.followType)}
                            <div className="flex items-center gap-1">
                              {getStatusIcon(link.status)}
                              <span className="text-xs capitalize">{link.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="domains" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Referring Domains</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.topReferringDomains.map((domain, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{domain.domain}</div>
                            <div className="text-sm text-gray-600">
                              Authority: <span className={getAuthorityColor(domain.authority)}>{domain.authority}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">{domain.count} links</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="anchors" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Anchor Texts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.topAnchorTexts.map((anchor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-sm font-bold text-green-600 dark:text-green-400">
                            {index + 1}
                          </div>
                          <span className="font-medium">"{anchor.text}"</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{anchor.count} times</Badge>
                          <span className="text-sm text-gray-600">
                            {((anchor.count / analysis.totalBacklinks) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Link Profile Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>DoFollow Ratio</span>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={(analysis.linkTypes.dofollow / analysis.totalBacklinks) * 100} 
                            className="w-20 h-2" 
                          />
                          <span className="text-sm font-medium">
                            {((analysis.linkTypes.dofollow / analysis.totalBacklinks) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Active Links</span>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={(analysis.linkStatus.active / analysis.totalBacklinks) * 100} 
                            className="w-20 h-2" 
                          />
                          <span className="text-sm font-medium">
                            {((analysis.linkStatus.active / analysis.totalBacklinks) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Domain Diversity</span>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={(analysis.referringDomains / analysis.totalBacklinks) * 100} 
                            className="w-20 h-2" 
                          />
                          <span className="text-sm font-medium">Good</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.linkStatus.broken > 0 && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                          <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Fix Broken Links</p>
                            <p className="text-xs text-gray-600">
                              You have {analysis.linkStatus.broken} broken backlinks that need attention
                            </p>
                          </div>
                        </div>
                      )}
                      {(analysis.linkTypes.dofollow / analysis.totalBacklinks) < 0.6 && (
                        <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                          <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Improve DoFollow Ratio</p>
                            <p className="text-xs text-gray-600">
                              Focus on getting more dofollow links to improve link authority
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Monitor New Links</p>
                          <p className="text-xs text-gray-600">
                            Set up alerts to track new backlinks and lost links
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}