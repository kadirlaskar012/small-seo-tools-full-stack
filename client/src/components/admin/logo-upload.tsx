import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Eye } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface LogoUploadProps {
  type: "logo" | "nav_icon";
  title: string;
  description: string;
}

export function LogoUpload({ type, title, description }: LogoUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current branding
  const { data: currentBranding, isLoading } = useQuery({
    queryKey: ["/api/site-branding", type],
    queryFn: async () => {
      const response = await fetch(`/api/site-branding/${type}`);
      if (!response.ok) throw new Error('Failed to fetch branding');
      return response.json();
    },
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (fileData: { 
      type: string; 
      name: string; 
      fileData: string; 
      fileType: string; 
      fileName: string; 
      fileSize: number; 
    }) => {
      const url = currentBranding?.id ? `/api/site-branding/${currentBranding.id}` : "/api/site-branding";
      const method = currentBranding?.id ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fileData),
      });
      
      if (!response.ok) throw new Error('Failed to upload branding');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `${title} uploaded successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/site-branding"] });
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || `Failed to upload ${title.toLowerCase()}`,
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!currentBranding?.id) return;
      return apiRequest(`/api/site-branding/${currentBranding.id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `${title} removed successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/site-branding"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || `Failed to remove ${title.toLowerCase()}`,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, SVG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target?.result as string;
      const fileData = base64Data.split(",")[1]; // Remove data:image/... prefix

      await uploadMutation.mutateAsync({
        type,
        name: selectedFile.name,
        fileData,
        fileType: selectedFile.type,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const getCurrentImageUrl = () => {
    if (previewUrl) return previewUrl;
    if (currentBranding?.fileData) {
      return `data:${currentBranding.fileType};base64,${currentBranding.fileData}`;
    }
    return null;
  };

  const currentImageUrl = getCurrentImageUrl();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Image Preview */}
        {currentImageUrl && (
          <div className="space-y-2">
            <Label>Current {title}</Label>
            <div className="relative inline-block border border-gray-200 rounded-lg p-2 bg-white">
              <img
                src={currentImageUrl}
                alt={title}
                className="max-w-32 max-h-32 object-contain"
              />
              {previewUrl && (
                <div className="absolute -top-1 -right-1">
                  <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    New
                  </div>
                </div>
              )}
            </div>
            {currentBranding && !previewUrl && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(currentImageUrl, "_blank")}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            )}
          </div>
        )}

        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor={`${type}-upload`}>
            {currentBranding ? `Replace ${title}` : `Upload ${title}`}
          </Label>
          <Input
            id={`${type}-upload`}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            ref={fileInputRef}
            className="cursor-pointer"
          />
          <p className="text-xs text-gray-500">
            Supports PNG, JPG, SVG files. Max size: 5MB
          </p>
        </div>

        {/* Action Buttons */}
        {selectedFile && (
          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              disabled={uploadMutation.isPending}
              className="flex-1"
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload"}
            </Button>
            <Button
              variant="outline"
              onClick={handleRemove}
              disabled={uploadMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        )}

        {/* Status */}
        {isLoading && (
          <p className="text-sm text-gray-500">Loading current {title.toLowerCase()}...</p>
        )}
      </CardContent>
    </Card>
  );
}