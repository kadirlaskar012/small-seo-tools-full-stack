import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Category, ToolWithCategory, BlogPost } from "@shared/schema";
import { Settings, Wand2, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

export default function Admin() {
  const [generatingIcons, setGeneratingIcons] = useState(false);
  const [iconResults, setIconResults] = useState<any[]>([]);

  const { data: tools = [] } = useQuery<ToolWithCategory[]>({
    queryKey: ["/api/tools"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const generateIconsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/generate-all-icons', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to generate icons');
      return response.json();
    },
    onSuccess: (data) => {
      const results = [];
      if (data.results?.tools) {
        data.results.tools.forEach((tool: any) => {
          results.push({ success: true, message: `Generated icon for tool: ${tool.title}` });
        });
      }
      if (data.results?.categories) {
        data.results.categories.forEach((category: any) => {
          results.push({ success: true, message: `Generated icon for category: ${category.name}` });
        });
      }
      if (data.results?.errors) {
        data.results.errors.forEach((error: string) => {
          results.push({ success: false, message: error });
        });
      }
      setIconResults(results);
      setGeneratingIcons(false);
    },
    onError: () => {
      setGeneratingIcons(false);
    }
  });

  const handleGenerateIcons = () => {
    setGeneratingIcons(true);
    setIconResults([]);
    generateIconsMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <title>Admin Panel - Free SEO Tools</title>
      <meta name="description" content="Admin panel for managing tools and website content." />
      <meta name="robots" content="noindex" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage your tools and website content</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Icon Generation */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  AI Icon Generation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Generate unique AI-powered icons for all tools and categories using OpenAI API.
                  </p>
                  
                  <button
                    onClick={handleGenerateIcons}
                    disabled={generatingIcons}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {generatingIcons ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Icons...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate All Icons
                      </>
                    )}
                  </button>

                  {iconResults.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Generation Results</h3>
                      <div className="space-y-2">
                        {iconResults.map((result, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            {result.success ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className={result.success ? "text-green-700" : "text-red-700"}>
                              {result.message}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Tools</span>
                    <span className="font-semibold">{tools.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categories</span>
                    <span className="font-semibold">{categories.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Tools</span>
                    <span className="font-semibold">
                      {tools.filter(tool => tool.isActive).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tools.slice(0, 5).map((tool) => (
                    <div key={tool.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm">{tool.category.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {tool.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {tool.category.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>All Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map((tool) => (
                  <div key={tool.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm">{tool.category.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {tool.title}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {tool.category.name}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {tool.description}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        tool.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {tool.isActive ? "Active" : "Inactive"}
                      </span>
                      <a 
                        href={`/tools/${tool.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        View Tool
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}