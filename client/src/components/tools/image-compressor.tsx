import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Image, Upload, Download, Combine } from "lucide-react";

export default function ImageCompressor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const { toast } = useToast();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPEG, PNG, WebP, etc.)",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      setOriginalSize(file.size);
      setCompressedImage(null);
      setCompressedSize(0);
    }
  }, [toast]);

  const compressImage = useCallback(async () => {
    if (!selectedFile) return;

    setIsCompressing(true);
    setCompressionProgress(0);

    try {
      // Simulate compression progress
      const progressInterval = setInterval(() => {
        setCompressionProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Create canvas for compression
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      await new Promise((resolve, reject) => {
        img.onload = () => {
          // Calculate new dimensions (keeping aspect ratio)
          const maxWidth = 1200;
          const maxHeight = 1200;
          let { width, height } = img;

          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedUrl = URL.createObjectURL(blob);
              setCompressedImage(compressedUrl);
              setCompressedSize(blob.size);
              setCompressionProgress(100);
              resolve(compressedUrl);
            } else {
              reject(new Error('Compression failed'));
            }
          }, 'image/jpeg', 0.8);
        };

        img.onerror = reject;
        img.src = URL.createObjectURL(selectedFile);
      });

      toast({
        title: "Compression complete",
        description: "Your image has been successfully compressed",
      });
    } catch (error) {
      toast({
        title: "Compression failed",
        description: "There was an error compressing your image",
        variant: "destructive",
      });
    } finally {
      setIsCompressing(false);
    }
  }, [selectedFile, toast]);

  const downloadCompressed = useCallback(() => {
    if (!compressedImage || !selectedFile) return;

    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = `compressed_${selectedFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [compressedImage, selectedFile]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const compressionRatio = originalSize > 0 ? ((originalSize - compressedSize) / originalSize * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* File Upload */}
      <Card>
        <CardContent className="pt-6">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Click to upload an image</p>
              <p className="text-muted-foreground">Supports JPEG, PNG, WebP formats</p>
            </label>
          </div>
          
          {selectedFile && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Selected File:</h3>
              <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">Size: {formatFileSize(selectedFile.size)}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compression Controls */}
      {selectedFile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Combine className="h-5 w-5" />
              Combine Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={compressImage} 
              disabled={isCompressing}
              className="w-full"
            >
              {isCompressing ? "Compressing..." : "Combine Image"}
            </Button>
            
            {isCompressing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing...</span>
                  <span>{compressionProgress}%</span>
                </div>
                <Progress value={compressionProgress} />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {compressedImage && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Original</CardTitle>
            </CardHeader>
            <CardContent>
              <img 
                src={URL.createObjectURL(selectedFile!)} 
                alt="Original" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Size: {formatFileSize(originalSize)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Compressed
                <Button size="sm" onClick={downloadCompressed} className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <img 
                src={compressedImage} 
                alt="Compressed" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="mt-2 space-y-1">
                <p className="text-sm text-muted-foreground">
                  Size: {formatFileSize(compressedSize)}
                </p>
                <p className="text-sm font-medium text-green-600">
                  Reduced by {compressionRatio.toFixed(1)}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
