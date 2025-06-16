import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { BlogPost } from "@shared/schema";
import { Trash2, Edit, ExternalLink } from "lucide-react";
import { Link } from "wouter";

interface BlogListProps {
  posts: BlogPost[];
}

export default function BlogList({ posts }: BlogListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/blog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({
        title: "Post deleted",
        description: "The blog post has been successfully deleted",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    },
  });

  const handleDelete = async (id: number, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await deletePostMutation.mutateAsync(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blog Posts ({posts.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No blog posts created yet.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{post.title}</h3>
                    <Badge variant={post.isPublished ? "default" : "secondary"}>
                      {post.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">/{post.slug}</p>
                  <p className="text-sm text-muted-foreground">
                    Created: {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {post.isPublished && (
                    <Link href={`/blog/${post.slug}`}>
                      <Button size="sm" variant="outline" className="gap-1">
                        <ExternalLink className="h-3 w-3" />
                        View
                      </Button>
                    </Link>
                  )}
                  <Button size="sm" variant="outline" className="gap-1">
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="gap-1"
                    onClick={() => handleDelete(post.id, post.title)}
                    disabled={deletePostMutation.isPending}
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
