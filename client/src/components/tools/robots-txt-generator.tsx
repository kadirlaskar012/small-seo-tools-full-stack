import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, Plus, Trash2, Bot, Globe, FileText, Layout } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface RobotRule {
  id: string;
  userAgent: string;
  type: "allow" | "disallow";
  path: string;
}

interface RobotsConfig {
  domain: string;
  rules: RobotRule[];
  sitemapUrl: string;
  crawlDelay?: number;
}

const COMMON_USER_AGENTS = [
  { value: "*", label: "All Bots (*)" },
  { value: "Googlebot", label: "Googlebot (Google)" },
  { value: "Bingbot", label: "Bingbot (Bing)" },
  { value: "Slurp", label: "Slurp (Yahoo)" },
  { value: "DuckDuckBot", label: "DuckDuckBot (DuckDuckGo)" },
  { value: "Baiduspider", label: "Baiduspider (Baidu)" },
  { value: "YandexBot", label: "YandexBot (Yandex)" },
  { value: "facebookexternalhit", label: "Facebook Bot" },
  { value: "Twitterbot", label: "Twitter Bot" },
  { value: "LinkedInBot", label: "LinkedIn Bot" },
];

const RULE_TEMPLATES = [
  {
    name: "Allow All",
    description: "Allow all bots to crawl entire website",
    rules: [{ userAgent: "*", type: "allow" as const, path: "/" }]
  },
  {
    name: "Block All",
    description: "Block all bots from crawling website",
    rules: [{ userAgent: "*", type: "disallow" as const, path: "/" }]
  },
  {
    name: "Standard Website",
    description: "Common rules for most websites",
    rules: [
      { userAgent: "*", type: "allow", path: "/" },
      { userAgent: "*", type: "disallow", path: "/admin/" },
      { userAgent: "*", type: "disallow", path: "/private/" },
      { userAgent: "*", type: "disallow", path: "/temp/" }
    ]
  },
  {
    name: "E-commerce Site",
    description: "Optimized for online stores",
    rules: [
      { userAgent: "*", type: "allow", path: "/" },
      { userAgent: "*", type: "disallow", path: "/cart/" },
      { userAgent: "*", type: "disallow", path: "/checkout/" },
      { userAgent: "*", type: "disallow", path: "/account/" },
      { userAgent: "*", type: "disallow", path: "/admin/" }
    ]
  },
  {
    name: "Blog/News Site",
    description: "Optimized for content sites",
    rules: [
      { userAgent: "*", type: "allow", path: "/" },
      { userAgent: "*", type: "allow", path: "/posts/" },
      { userAgent: "*", type: "allow", path: "/articles/" },
      { userAgent: "*", type: "disallow", path: "/wp-admin/" },
      { userAgent: "*", type: "disallow", path: "/author/" }
    ]
  }
];

export function RobotsTxtGenerator() {
  const [config, setConfig] = useState<RobotsConfig>({
    domain: "",
    rules: [{ id: "1", userAgent: "*", type: "allow", path: "/" }],
    sitemapUrl: "",
    crawlDelay: undefined
  });
  const [generatedContent, setGeneratedContent] = useState("");
  const [activeTab, setActiveTab] = useState("builder");
  const { toast } = useToast();

  // Generate robots.txt content
  const generateRobotsContent = () => {
    let content = "";
    
    // Group rules by user agent
    const rulesByAgent = config.rules.reduce((acc, rule) => {
      if (!acc[rule.userAgent]) {
        acc[rule.userAgent] = [];
      }
      acc[rule.userAgent].push(rule);
      return acc;
    }, {} as Record<string, RobotRule[]>);

    // Generate content for each user agent
    Object.entries(rulesByAgent).forEach(([userAgent, rules]) => {
      content += `User-agent: ${userAgent}\n`;
      
      rules.forEach(rule => {
        const directive = rule.type === "allow" ? "Allow" : "Disallow";
        content += `${directive}: ${rule.path}\n`;
      });
      
      if (config.crawlDelay && userAgent === "*") {
        content += `Crawl-delay: ${config.crawlDelay}\n`;
      }
      
      content += "\n";
    });

    // Add sitemap if provided
    if (config.sitemapUrl) {
      let sitemapUrl = config.sitemapUrl;
      if (!sitemapUrl.startsWith("http")) {
        const domain = config.domain || "https://example.com";
        const baseUrl = domain.endsWith("/") ? domain.slice(0, -1) : domain;
        sitemapUrl = `${baseUrl}/${sitemapUrl.startsWith("/") ? sitemapUrl.slice(1) : sitemapUrl}`;
      }
      content += `Sitemap: ${sitemapUrl}\n`;
    }

    return content.trim();
  };

  // Update generated content when config changes
  useEffect(() => {
    setGeneratedContent(generateRobotsContent());
  }, [config]);

  // Add new rule
  const addRule = () => {
    const newRule: RobotRule = {
      id: Date.now().toString(),
      userAgent: "*",
      type: "disallow",
      path: "/"
    };
    setConfig(prev => ({
      ...prev,
      rules: [...prev.rules, newRule]
    }));
  };

  // Remove rule
  const removeRule = (id: string) => {
    setConfig(prev => ({
      ...prev,
      rules: prev.rules.filter(rule => rule.id !== id)
    }));
  };

  // Update rule
  const updateRule = (id: string, updates: Partial<RobotRule>) => {
    setConfig(prev => ({
      ...prev,
      rules: prev.rules.map(rule => 
        rule.id === id ? { ...rule, ...updates } : rule
      )
    }));
  };

  // Apply template
  const applyTemplate = (template: typeof RULE_TEMPLATES[0]) => {
    const newRules = template.rules.map((rule, index) => ({
      id: Date.now().toString() + index,
      userAgent: rule.userAgent,
      type: rule.type,
      path: rule.path
    }));
    
    setConfig(prev => ({
      ...prev,
      rules: newRules
    }));
    
    toast({
      title: "Template Applied",
      description: `${template.name} template has been applied successfully.`
    });
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      toast({
        title: "Copied!",
        description: "Robots.txt content copied to clipboard."
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  // Download file
  const downloadFile = () => {
    const blob = new Blob([generatedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "robots.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Robots.txt file has been downloaded."
    });
  };

  // Validate robots.txt mutation
  const validateMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("/api/tools/robots-txt/validate", {
        method: "POST",
        body: JSON.stringify({ content }),
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Validation Complete",
        description: data.valid ? "Robots.txt is valid!" : "Issues found in robots.txt",
        variant: data.valid ? "default" : "destructive"
      });
    },
    onError: () => {
      toast({
        title: "Validation Error",
        description: "Failed to validate robots.txt",
        variant: "destructive"
      });
    }
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Rule Builder
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Preview & Download
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          {/* Website Configuration */}
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="domain">Website Domain</Label>
                  <Input
                    id="domain"
                    placeholder="https://example.com"
                    value={config.domain}
                    onChange={(e) => setConfig(prev => ({ ...prev, domain: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="sitemap">Sitemap URL (Optional)</Label>
                  <Input
                    id="sitemap"
                    placeholder="sitemap.xml or https://example.com/sitemap.xml"
                    value={config.sitemapUrl}
                    onChange={(e) => setConfig(prev => ({ ...prev, sitemapUrl: e.target.value }))}
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Label htmlFor="crawlDelay">Crawl Delay (seconds)</Label>
                <Input
                  id="crawlDelay"
                  type="number"
                  placeholder="10"
                  value={config.crawlDelay || ""}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    crawlDelay: e.target.value ? parseInt(e.target.value) : undefined 
                  }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Rules Section */}
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Crawl Rules</span>
                <Button onClick={addRule} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Rule
                </Button>
              </div>
              {config.rules.map((rule, index) => (
                <div key={rule.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Rule {index + 1}</Badge>
                    {config.rules.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>User Agent</Label>
                      <Select
                        value={rule.userAgent}
                        onValueChange={(value) => updateRule(rule.id, { userAgent: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COMMON_USER_AGENTS.map(agent => (
                            <SelectItem key={agent.value} value={agent.value}>
                              {agent.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Action</Label>
                      <RadioGroup
                        value={rule.type}
                        onValueChange={(value: "allow" | "disallow") => 
                          updateRule(rule.id, { type: value })
                        }
                        className="flex flex-row space-x-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="allow" id={`allow-${rule.id}`} />
                          <Label htmlFor={`allow-${rule.id}`}>Allow</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="disallow" id={`disallow-${rule.id}`} />
                          <Label htmlFor={`disallow-${rule.id}`}>Disallow</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <Label>Path</Label>
                      <Input
                        placeholder="/admin/"
                        value={rule.path}
                        onChange={(e) => updateRule(rule.id, { path: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Predefined Templates</h3>
                <p className="text-sm text-muted-foreground">Choose from common robots.txt configurations</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {RULE_TEMPLATES.map((template, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="space-y-2 mb-4">
                        {template.rules.map((rule, ruleIndex) => (
                          <div key={ruleIndex} className="text-sm text-muted-foreground">
                            <code>
                              {rule.type === "allow" ? "Allow" : "Disallow"}: {rule.path} 
                              ({rule.userAgent})
                            </code>
                          </div>
                        ))}
                      </div>
                      <Button 
                        onClick={() => applyTemplate(template)}
                        className="w-full"
                      >
                        Apply Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Generated Robots.txt</h3>
                <p className="text-sm text-muted-foreground">Preview and download your robots.txt file</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={copyToClipboard} variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </Button>
                <Button onClick={downloadFile}>
                  <Download className="h-4 w-4 mr-2" />
                  Download robots.txt
                </Button>
                <Button 
                  onClick={() => validateMutation.mutate(generatedContent)}
                  variant="outline"
                  disabled={validateMutation.isPending}
                >
                  {validateMutation.isPending ? "Validating..." : "Validate"}
                </Button>
              </div>
              
              <div className="relative">
                <Textarea
                  value={generatedContent}
                  readOnly
                  className="font-mono text-sm min-h-[300px]"
                  placeholder="Your robots.txt content will appear here..."
                />
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p><strong>Instructions:</strong></p>
                <ol className="list-decimal list-inside space-y-1 mt-2">
                  <li>Download the robots.txt file</li>
                  <li>Upload it to the root directory of your website (e.g., https://example.com/robots.txt)</li>
                  <li>Test the file using Google Search Console</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}