import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { ToolWithCategory } from "@shared/schema";
import { Trash2, Edit, ExternalLink } from "lucide-react";
import { Link } from "wouter";

interface ToolListProps {
  tools: ToolWithCategory[];
}

export default function ToolList({ tools }: ToolListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteToolMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/tools/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tools"] });
      toast({
        title: "Tool deleted",
        description: "The tool has been successfully deleted",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete tool",
        variant: "destructive",
      });
    },
  });

  const handleDelete = async (id: number, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteToolMutation.mutateAsync(id);
    }
  };

  const getIconForCategory = (icon: string) => {
    const iconMap: Record<string, string> = {
      text_fields: "📝",
      image: "🖼️",
      picture_as_pdf: "📄",
      search: "🔍",
    };
    return iconMap[icon] || "🛠️";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tools ({tools.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {tools.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No tools created yet.</p>
        ) : (
          <div className="space-y-4">
            {tools.map((tool) => (
              <div key={tool.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getIconForCategory(tool.category.icon)}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{tool.title}</h3>
                      <Badge variant={tool.isActive ? "default" : "secondary"}>
                        {tool.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">/{tool.slug}</p>
                    <p className="text-sm text-muted-foreground">{tool.category.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/${tool.slug}`}>
                    <Button size="sm" variant="outline" className="gap-1">
                      <ExternalLink className="h-3 w-3" />
                      View
                    </Button>
                  </Link>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="gap-1"
                    onClick={() => handleDelete(tool.id, tool.title)}
                    disabled={deleteToolMutation.isPending}
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
