import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import WordCounter from "@/components/tools/word-counter";
import ImageCompressor from "@/components/tools/image-compressor";
import PDFToWord from "@/components/tools/pdf-to-word";
import type { ToolWithCategory } from "@shared/schema";
import SEOHead from "@/components/seo-head";
import { AlertCircle, Home, ChevronRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useEffect } from "react";

export default function Tool() {
  const { slug } = useParams();
  const queryClient = useQueryClient();

  const { data: tool, isLoading, error } = useQuery<ToolWithCategory>({
    queryKey: [`/api/tools/${slug}`],
    enabled: !!slug,
  });

  const { data: similarTools = [] } = useQuery<ToolWithCategory[]>({
    queryKey: [`/api/tools/${tool?.id}/similar`],
    enabled: !!tool?.id,
  });

  // Track tool usage
  const trackUsageMutation = useMutation({
    mutationFn: async (toolId: number) => {
      await apiRequest(`/api/tools/${toolId}/usage`, {
        method: "POST",
      });
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
    switch (tool.code) {
      case "word-counter":
        return <WordCounter />;
      case "image-compressor":
        return <ImageCompressor />;
      case "pdf-to-word":
        return <PDFToWord />;
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
              <div className={`w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-2xl`}>
                📝
              </div>
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
        {renderToolComponent()}
        
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
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {similarTools.slice(0, 6).map((similarTool) => (
                <Link key={similarTool.id} href={`/${similarTool.slug}`}>
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer h-full text-center">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mx-auto mb-3 text-xl">
                      📝
                    </div>
                    <h3 className="font-medium text-sm text-gray-900 dark:text-white leading-tight mb-2">
                      {similarTool.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {similarTool.description}
                    </p>
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
