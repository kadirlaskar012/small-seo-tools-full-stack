import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMobile } from "@/hooks/use-mobile";
import { Search, ArrowRight, Combine, ChevronRight } from "lucide-react";
import type { Category, ToolWithCategory, BlogPost } from "@shared/schema";
import SEOHead from "@/components/seo-head";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const isMobile = useMobile();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: tools = [] } = useQuery<ToolWithCategory[]>({
    queryKey: ["/api/tools"],
  });

  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog?published=true"],
  });

  const filteredTools = tools.filter(tool => {
    const matchesSearch = !searchQuery || 
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
      tool.category.slug === selectedCategory;
    
    return matchesSearch && matchesCategory && tool.isActive;
  });

  const getIconForCategory = (icon: string) => {
    const iconMap: Record<string, string> = {
      text_fields: "📝",
      image: "🖼️",
      picture_as_pdf: "📄",
      search: "🔍",
    };
    return iconMap[icon] || "🛠️";
  };

  const getColorForCategory = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-100 text-blue-600",
      purple: "bg-purple-100 text-purple-600",
      red: "bg-red-100 text-red-600",
      cyan: "bg-cyan-100 text-cyan-600",
      green: "bg-green-100 text-green-600",
      orange: "bg-orange-100 text-orange-600",
    };
    return colorMap[color] || "bg-gray-100 text-gray-600";
  };

  return (
    <>
      <SEOHead 
        title="The Ultimate Online Tools - Free Online Tools for Everyone"
        description="Powerful, fast, and easy-to-use online tools for all your digital needs. Text tools, image tools, PDF tools, SEO tools and more. No registration required."
        keywords="online tools, free tools, text tools, image tools, pdf tools, seo tools, web tools"
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">The Ultimate Online Tools</h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Powerful, fast, and easy-to-use tools for all your digital needs. No registration required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="relative w-full max-w-md">
              <Input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 py-3 text-foreground"
              />
              <Search className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
            </div>
            <Button 
              variant="secondary" 
              size="lg"
              className="flex items-center gap-2"
              onClick={() => document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Combine className="h-5 w-5" />
              Browse All Tools
            </Button>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools-section" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">Popular Tools</h2>
            <div className="flex flex-wrap gap-2 mb-8">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className="rounded-full"
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.slug ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.slug)}
                  className="rounded-full"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Desktop Grid Layout */}
          {!isMobile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool) => (
                <Link key={tool.id} href={`/${tool.slug}`}>
                  <Card className="tool-card h-full cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 ${getColorForCategory(tool.category.color)} rounded-lg flex items-center justify-center mr-4 text-2xl`}>
                          {getIconForCategory(tool.category.icon)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                            {tool.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{tool.category.name}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {tool.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">Free</Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            /* Mobile List Layout */
            <div className="space-y-3">
              {filteredTools.map((tool) => (
                <Link key={tool.id} href={`/${tool.slug}`}>
                  <div className="tool-card-mobile">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getIconForCategory(tool.category.icon)}</span>
                      <div>
                        <h3 className="text-sm font-semibold">{tool.title}</h3>
                        <p className="text-xs text-muted-foreground">{tool.category.name}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                {searchQuery ? "No tools found matching your search." : "No tools available."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Blog Section Preview */}
      {blogPosts.length > 0 && (
        <section className="py-16 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Latest from Our Blog</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Tips, tutorials, and insights to help you make the most of our tools
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(0, 3).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-2">
                        <Badge variant="outline">Blog</Badge>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="text-primary text-sm font-medium">Read more →</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/blog">
                <Button variant="outline" size="lg" className="gap-2">
                  View All Posts
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
