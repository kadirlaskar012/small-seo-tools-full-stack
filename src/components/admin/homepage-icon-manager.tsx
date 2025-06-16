import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ToolLogo } from "@/components/ui/tool-logo";
import { Pencil, Save, X, Eye } from "lucide-react";

interface ToolIcon {
  id: number;
  toolId: number;
  iconType: string;
  iconData: string;
  isActive: boolean;
  createdAt: string;
}

interface Tool {
  id: number;
  title: string;
  slug: string;
  category: {
    id: number;
    name: string;
    slug: string;
    color: string;
  };
}

export function HomepageIconManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingTool, setEditingTool] = useState<number | null>(null);
  const [iconType, setIconType] = useState<string>("emoji");
  const [iconData, setIconData] = useState<string>("");

  const { data: tools = [] } = useQuery<Tool[]>({
    queryKey: ["/api/tools"],
  });

  const { data: toolIcons = [] } = useQuery<ToolIcon[]>({
    queryKey: ["/api/admin/tool-icons"],
  });

  const updateIconMutation = useMutation({
    mutationFn: async ({ toolId, iconType, iconData }: { toolId: number; iconType: string; iconData: string }) => {
      await apiRequest("POST", "/api/admin/tool-icons", {
        toolId,
        iconType,
        iconData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tool-icons"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tools"] });
      setEditingTool(null);
      setIconData("");
      toast({
        title: "Success",
        description: "Tool icon updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update tool icon",
        variant: "destructive",
      });
    },
  });

  const deleteIconMutation = useMutation({
    mutationFn: async (toolId: number) => {
      await apiRequest("DELETE", `/api/admin/tool-icons/${toolId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tool-icons"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tools"] });
      toast({
        title: "Success",
        description: "Tool icon removed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove tool icon",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (toolId: number) => {
    const existingIcon = toolIcons.find(icon => icon.toolId === toolId);
    setEditingTool(toolId);
    setIconType(existingIcon?.iconType || "emoji");
    setIconData(existingIcon?.iconData || "");
  };

  const handleSave = () => {
    if (!editingTool || !iconData.trim()) return;

    updateIconMutation.mutate({
      toolId: editingTool,
      iconType,
      iconData: iconData.trim(),
    });
  };

  const handleCancel = () => {
    setEditingTool(null);
    setIconData("");
    setIconType("emoji");
  };

  const getToolIcon = (toolId: number) => {
    return toolIcons.find(icon => icon.toolId === toolId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Homepage Icon Manager
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage tool icons displayed on the homepage. Changes are applied in real-time.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tools.map((tool) => {
            const toolIcon = getToolIcon(tool.id);
            const isEditing = editingTool === tool.id;

            return (
              <div
                key={tool.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                    <ToolLogo 
                      toolSlug={tool.slug} 
                      categorySlug={tool.category.slug} 
                      size={24}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{tool.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        style={{ borderColor: tool.category.color, color: tool.category.color }}
                      >
                        {tool.category.name}
                      </Badge>
                      {toolIcon && (
                        <Badge variant="secondary">
                          Custom Icon: {toolIcon.iconData}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Select value={iconType} onValueChange={setIconType}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="emoji">Emoji</SelectItem>
                          <SelectItem value="icon">Icon</SelectItem>
                          <SelectItem value="text">Text</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder={iconType === "emoji" ? "🛠️" : iconType === "icon" ? "wrench" : "Tool"}
                        value={iconData}
                        onChange={(e) => setIconData(e.target.value)}
                        className="w-32"
                      />
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={!iconData.trim() || updateIconMutation.isPending}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(tool.id)}
                      >
                        <Pencil className="h-4 w-4" />
                        {toolIcon ? "Edit" : "Add"} Icon
                      </Button>
                      {toolIcon && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteIconMutation.mutate(tool.id)}
                          disabled={deleteIconMutation.isPending}
                        >
                          <X className="h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}