import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, ExternalLink, Share2 } from "lucide-react";
import type { ToolWithCategory } from "@shared/schema";

// Tool component mappings - only include existing components
const TOOL_COMPONENTS = {
  "page-speed-test": () => import("@/components/tools/advanced-page-speed-checker"),
  "text-case-converter": () => import("@/components/tools/text-case-converter"),
  "word-counter": () => import("@/components/tools/word-counter"),
};

export default function Tool() {
  const { slug } = useParams();
  const [isMobile, setIsMobile] = useState(false);
  const [ToolComponent, setToolComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { data: tool, isLoading } = useQuery<ToolWithCategory>({
    queryKey: [`/api/tools/${slug}`],
    enabled: !!slug,
  });

  const { data: similarTools = [] } = useQuery<ToolWithCategory[]>({
    queryKey: [`/api/tools/${tool?.id}/similar`],
    enabled: !!tool?.id,
  });

  const trackUsageMutation = useMutation({
    mutationFn: () => fetch(`/api/tools/${tool?.id}/usage`, { method: 'POST' }),
  });

  useEffect(() => {
    if (tool && slug && TOOL_COMPONENTS[slug as keyof typeof TOOL_COMPONENTS]) {
      TOOL_COMPONENTS[slug as keyof typeof TOOL_COMPONENTS]()
        .then((module: any) => {
          setToolComponent(() => module.default);
          trackUsageMutation.mutate();
        })
        .catch(() => {
          setToolComponent(() => () => (
            <div className="text-center py-8">
              <p className="text-gray-500">Tool component not available</p>
            </div>
          ));
        });
    }
  }, [tool, slug]);

  const getColorForCategory = (color: string) => {
    const colorMap: Record<string, string> = {
      "#3B82F6": "bg-blue-50 text-blue-700 border-blue-200",
      "#8B5CF6": "bg-purple-50 text-purple-700 border-purple-200",
      "#EF4444": "bg-red-50 text-red-700 border-red-200",
      "#10B981": "bg-green-50 text-green-700 border-green-200",
      "#F59E0B": "bg-orange-50 text-orange-700 border-orange-200",
      "#6366F1": "bg-indigo-50 text-indigo-700 border-indigo-200",
      "#EC4899": "bg-pink-50 text-pink-700 border-pink-200",
      "#14B8A6": "bg-teal-50 text-teal-700 border-teal-200",
      "#84CC16": "bg-lime-50 text-lime-700 border-lime-200",
      "#F97316": "bg-orange-50 text-orange-700 border-orange-200",
    };
    return colorMap[color] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const shareUrl = () => {
    if (navigator.share) {
      navigator.share({
        title: tool?.title,
        text: tool?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tool...</p>
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tool Not Found</h1>
          <p className="text-gray-600 mb-6">The requested tool could not be found.</p>
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tools
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Tags */}
      <title>{tool.metaTitle || `${tool.title} - Free Online Tool`}</title>
      <meta name="description" content={tool.metaDescription || tool.description} />
      <meta name="keywords" content={tool.metaTags || `${tool.title}, free tool, online tool`} />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tools
              </Link>
              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getColorForCategory(tool.category.color)}`}>
                {tool.category.name}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={shareUrl}
                className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tool Name Box */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="text-center">
            <div className="mb-4">
              {!isMobile && (
                <div className={`inline-flex p-4 rounded-2xl ${getColorForCategory(tool.category.color)} bg-white/10 border border-white/20`}>
                  <span className="text-4xl">{tool.category.icon}</span>
                </div>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {tool.title}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
              {tool.description}
            </p>
          </div>
        </div>
      </div>

      {/* Tool Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Tool Area */}
          <div className="lg:col-span-3">
            <Card className="mb-8">
              <CardContent className="p-6">
                {ToolComponent ? <ToolComponent /> : (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading tool interface...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tool Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">About This Tool</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Free to use
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    No registration required
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Privacy focused
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Similar Tools */}
            {similarTools.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Related Tools</h3>
                  <div className="space-y-3">
                    {similarTools.slice(0, 4).map((similarTool) => (
                      <Link
                        key={similarTool.id}
                        href={`/tools/${similarTool.slug}`}
                        className="block p-3 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          {!isMobile && (
                            <div className={`p-2 rounded-lg ${getColorForCategory(similarTool.category.color)} flex-shrink-0`}>
                              <span className="text-lg">{similarTool.category.icon}</span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors text-sm">
                              {similarTool.title}
                            </h4>
                            <p className="text-xs text-gray-600 truncate">
                              {similarTool.description}
                            </p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}