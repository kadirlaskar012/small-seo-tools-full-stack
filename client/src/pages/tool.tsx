import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SEOScoreChecker from "@/components/tools/seo-score-checker";
import MetaTagsAnalyzer from "@/components/tools/meta-tags-analyzer";
import KeywordDensityChecker from "@/components/tools/keyword-density-checker";
import BacklinkChecker from "@/components/tools/backlink-checker";
import TextCaseConverter from "@/components/tools/text-case-converter";
import WordCounter from "@/components/tools/word-counter";
import { PageSpeedChecker } from "@/components/tools/page-speed-checker";
import { AdvancedPageSpeedChecker } from "@/components/tools/advanced-page-speed-checker";
import { RobotsTxtGenerator } from "@/components/tools/robots-txt-generator";
import { DateDifferenceCalculator } from "@/components/tools/date-difference-calculator";
import { AgeInMonthsCalculator } from "@/components/tools/age-in-months-calculator";
import { PercentageCalculator } from "@/components/tools/percentage-calculator";
import { SmartRedirectChainChecker } from "@/components/tools/smart-redirect-chain-checker";
import { SchemaMarkupTester } from "@/components/tools/schema-markup-tester";
import { SmartModernNotepad } from "@/components/tools/smart-modern-notepad";
import { JWTDecoder } from "@/components/tools/jwt-decoder";
import { RegexGenerator } from "@/components/tools/regex-generator";
import { JSObfuscator } from "@/components/tools/js-obfuscator";
import type { ToolWithCategory } from "@shared/schema";
import SEOHead from "@/components/seo-head";
import { AlertCircle, Home, ChevronRight, ChevronDown, ChevronUp, Search } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { ToolLogo } from "@/components/ui/tool-logo";
import { useEffect, useState } from "react";

export default function Tool() {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  
  // State for collapsible sections
  const [categoriesExpanded, setCategoriesExpanded] = useState(true); // Categories expanded by default
  const [popularExpanded, setPopularExpanded] = useState(false);
  const [latestExpanded, setLatestExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({}); // Track individual category expansions

  const { data: tool, isLoading, error } = useQuery<ToolWithCategory>({
    queryKey: [`/api/tools/${slug}`],
    enabled: !!slug,
  });

  const { data: similarTools = [] } = useQuery<ToolWithCategory[]>({
    queryKey: [`/api/tools/${tool?.id}/similar`],
    enabled: !!tool?.id,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: allTools = [] } = useQuery<ToolWithCategory[]>({
    queryKey: ["/api/tools"],
  });

  const { data: popularTools = [] } = useQuery<ToolWithCategory[]>({
    queryKey: ["/api/tools/popular"],
    queryFn: async () => {
      const response = await fetch("/api/tools/popular?limit=8");
      if (!response.ok) throw new Error('Failed to fetch popular tools');
      return response.json();
    },
  });

  // Track tool usage
  const trackUsageMutation = useMutation({
    mutationFn: async (toolId: number) => {
      await apiRequest("POST", `/api/tools/${toolId}/usage`);
    },
  });

  useEffect(() => {
    if (tool?.id && !trackUsageMutation.isPending) {
      trackUsageMutation.mutate(tool.id);
    }
  }, [tool?.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-12 bg-muted rounded w-2/3 mb-8"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Tool Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The tool you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/">
              <Badge variant="outline" className="cursor-pointer">← Back to Home</Badge>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderToolComponent = () => {
    switch (tool.slug) {
      case "seo-score-checker":
        return <SEOScoreChecker />;
      case "meta-tags-analyzer":
        return <MetaTagsAnalyzer />;
      case "keyword-density-checker":
        return <KeywordDensityChecker />;
      case "backlink-checker":
        return <BacklinkChecker />;
      case "page-speed-checker":
      case "page-speed-test":
        return <AdvancedPageSpeedChecker />;
      case "text-case-converter":
        return <TextCaseConverter />;
      case "word-counter":
        return <WordCounter />;
      case "robots-txt-generator":
        return <RobotsTxtGenerator />;
      case "date-difference-calculator":
        return <DateDifferenceCalculator />;
      case "age-in-months-calculator":
        return <AgeInMonthsCalculator />;
      case "percentage-change-calculator":
        return <PercentageCalculator />;
      case "redirect-chain-checker":
        return <SmartRedirectChainChecker />;
      case "schema-markup-tester":
        return <SchemaMarkupTester />;
      case "smart-modern-notepad":
      case "notepad":
        return <SmartModernNotepad />;
      case "jwt-decoder":
        return <JWTDecoder />;
      case "regex-generator":
        return <RegexGenerator />;
      case "js-obfuscator":
      case "javascript-obfuscator":
        return <JSObfuscator />;
      default:
        return (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                This tool is currently under development. Please check back later.
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <>
      <SEOHead 
        title={tool.metaTitle || `${tool.title} - The Ultimate Online Tools`}
        description={tool.metaDescription || tool.description}
        keywords={tool.metaTags || `${tool.title}, ${tool.category.name}, online tools`}
      />
      
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8">
          <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-auto p-1">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/?category=${tool.category.slug}`}>
              <Button variant="ghost" size="sm" className="h-auto p-1 text-muted-foreground hover:text-foreground">
                {tool.category.name}
              </Button>
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">{tool.title}</span>
          </nav>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <ToolLogo 
                toolSlug={tool.slug} 
                categorySlug={tool.category.slug} 
                size={64}
                className="transition-transform hover:scale-105"
              />
              <div>
                <h1 className="text-3xl font-bold">{tool.title}</h1>
                <Badge variant="secondary">{tool.category.name}</Badge>
              </div>
            </div>
          </div>
          
          <p className="text-lg text-muted-foreground max-w-3xl">
            {tool.description}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Tool Content - 75% */}
          <div className="flex-1 min-w-0 lg:w-3/4">
            {renderToolComponent()}
          </div>

          {/* Right Sidebar - 25% */}
          <div className="lg:w-1/4 lg:flex-shrink-0">
            {/* Single collapsible box with all sections */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>

              {/* Categories Section */}
              <div>
                <button
                  onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                  className="w-full flex items-center justify-between text-left p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Browse by Category
                  </h3>
                  {categoriesExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                
                {categoriesExpanded && (
                  <div className="mt-3 space-y-4">
                    {categories.map((category) => {
                      const categoryTools = allTools.filter(t => t.category.id === category.id);
                      if (categoryTools.length === 0) return null;
                      
                      const isCategoryExpanded = expandedCategories[category.id] || false;
                      
                      return (
                        <div key={category.id} className="mb-3">
                          <button
                            onClick={() => setExpandedCategories(prev => ({
                              ...prev,
                              [category.id]: !prev[category.id]
                            }))}
                            className="w-full flex items-center justify-between text-left p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
                          >
                            <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                              <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: category.color }}></span>
                              {category.name} ({categoryTools.length})
                            </h4>
                            {isCategoryExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          </button>
                          
                          {isCategoryExpanded && (
                            <div className="mt-2 space-y-1 pl-4">
                              {categoryTools.slice(0, 5).map((categoryTool) => (
                                <Link key={categoryTool.id} href={`/tools/${categoryTool.slug}`} className="block">
                                  <div className="border border-gray-200 dark:border-gray-600 rounded p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <h5 className="font-medium text-xs text-gray-900 dark:text-white truncate">
                                      {categoryTool.title}
                                    </h5>
                                  </div>
                                </Link>
                              ))}
                              {categoryTools.length > 5 && (
                                <Link href={`/?category=${category.slug}`} className="block">
                                  <div className="text-xs text-blue-600 dark:text-blue-400 hover:underline p-2">
                                    View all {categoryTools.length} tools →
                                  </div>
                                </Link>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Popular Tools Section */}
              <div>
                <button
                  onClick={() => setPopularExpanded(!popularExpanded)}
                  className="w-full flex items-center justify-between text-left p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Popular Tools
                  </h3>
                  {popularExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                
                {popularExpanded && (
                  <div className="mt-3 space-y-2">
                    {popularTools.map((popularTool, index) => (
                      <Link key={popularTool.id} href={`/tools/${popularTool.slug}`} className="block">
                        <div className="border border-gray-200 dark:border-gray-600 rounded p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 w-3">
                              {index + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-xs text-gray-900 dark:text-white truncate">
                                {popularTool.title}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {popularTool.category.name}
                                {popularTool.usageCount && popularTool.usageCount > 0 && (
                                  <span className="ml-1 text-blue-600 dark:text-blue-400">
                                    • {popularTool.usageCount} uses
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Latest Tools Section */}
              <div>
                <button
                  onClick={() => setLatestExpanded(!latestExpanded)}
                  className="w-full flex items-center justify-between text-left p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Latest Tools
                  </h3>
                  {latestExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                
                {latestExpanded && (
                  <div className="mt-3 space-y-2">
                    {allTools.slice(-6).reverse().map((latestTool) => (
                      <Link key={latestTool.id} href={`/tools/${latestTool.slug}`} className="block">
                        <div className="border border-gray-200 dark:border-gray-600 rounded p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-xs text-gray-900 dark:text-white truncate">
                                {latestTool.title}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {latestTool.category.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Tools Section */}
        {similarTools.length > 0 && (
          <div className="mt-16 border-t pt-12">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Similar Tools
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Explore more tools from the {tool.category.name} category
              </p>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {similarTools.slice(0, 6).map((similarTool) => (
                <Link key={similarTool.id} href={`/tools/${similarTool.slug}`}>
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer text-center">
                    <div className="flex items-center justify-center mx-auto mb-2">
                      <ToolLogo 
                        toolSlug={similarTool.slug} 
                        categorySlug={similarTool.category.slug} 
                        size={32}
                        className="transition-transform hover:scale-105"
                      />
                    </div>
                    <h3 className="font-medium text-xs text-gray-900 dark:text-white leading-tight">
                      {similarTool.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
