import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import type { BlogPost } from "@shared/schema";
import SEOHead from "@/components/seo-head";
import { AlertCircle, Calendar, Clock } from "lucide-react";

export default function BlogPost() {
  const { slug } = useParams();

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: [`/api/blog/${slug}`],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse max-w-4xl mx-auto">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-12 bg-muted rounded w-2/3 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
            <div className="h-4 bg-muted rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/blog">
              <Badge variant="outline" className="cursor-pointer">← Back to Blog</Badge>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const estimatedReadTime = Math.ceil(post.content.split(' ').length / 200);

  return (
    <>
      <SEOHead 
        title={post.metaTitle || `${post.title} - Blog`}
        description={post.metaDescription || post.excerpt || ''}
        keywords={post.metaTags || ''}
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
                <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbPage>{post.title}</BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{estimatedReadTime} min read</span>
              </div>
            </div>
            {post.excerpt && (
              <p className="text-lg text-muted-foreground max-w-3xl">
                {post.excerpt}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
          </div>
        </article>
      </div>
    </>
  );
}
