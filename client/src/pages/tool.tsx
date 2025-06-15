import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import WordCounter from "@/components/tools/word-counter";
import ImageCompressor from "@/components/tools/image-compressor";
import PDFToWord from "@/components/tools/pdf-to-word";
import type { ToolWithCategory } from "@shared/schema";
import SEOHead from "@/components/seo-head";
import { AlertCircle } from "lucide-react";

export default function Tool() {
  const { slug } = useParams();

  const { data: tool, isLoading, error } = useQuery<ToolWithCategory>({
    queryKey: [`/api/tools/${slug}`],
    enabled: !!slug,
  });

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
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/?category=${tool.category.slug}`}>
                  {tool.category.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbPage>{tool.title}</BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>
          
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
      </div>
    </>
  );
}
