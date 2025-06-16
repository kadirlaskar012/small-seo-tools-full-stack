import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  Download, 
  Unlock, 
  Lock, 
  FileText, 
  Shield,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PDFRemovalResult {
  success: boolean;
  output_url?: string;
  file_size_original?: number;
  file_size_output?: number;
  pages_count?: number;
  processing_time?: number;
  security_info?: {
    was_password_protected: boolean;
    had_user_password: boolean;
    had_owner_password: boolean;
    permissions_removed: string[];
  };
  error?: string;
  message?: string;
}

export function PDFPasswordRemover() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<PDFRemovalResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select a PDF file under 50MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      setResult(null);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid PDF file",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select a PDF file under 50MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      setResult(null);
    }
  };

  const removePassword = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setUploadProgress(0);
    setProcessingStage("Starting PDF analysis...");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('pdf', selectedFile);

      // Fast progress tracking for 30-second processing
      const stages = [
        "Uploading PDF file...",
        "Analyzing PDF security...",
        "Testing common passwords...",
        "Trying password patterns...",
        "Advanced password cracking...",
        "Finalizing unlocked PDF..."
      ];

      let currentStage = 0;
      const progressInterval = setInterval(() => {
        currentStage++;
        if (currentStage < stages.length) {
          setProcessingStage(stages[currentStage]);
          setUploadProgress(Math.min(90, (currentStage / stages.length) * 100));
        }
      }, 5000); // Update every 5 seconds

      const response = await fetch('/api/tools/pdf-password-remover', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      
      const data = await response.json();
      setUploadProgress(100);
      setProcessingStage("Complete!");
      setResult(data);

      if (data.success) {
        toast({
          title: "Password Removed Successfully",
          description: `PDF unlocked! ${data.pages_count} pages processed in ${data.processing_time}s`,
        });
      } else {
        toast({
          title: "Password Removal Failed",
          description: data.error || "Failed to remove password protection",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("PDF password removal error:", error);
      setResult({
        success: false,
        error: "Network error occurred during processing"
      });
      toast({
        title: "Processing Error",
        description: "A network error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
      setProcessingStage("");
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadFile = () => {
    if (result?.output_url) {
      const link = document.createElement('a');
      link.href = result.output_url;
      link.download = selectedFile?.name?.replace(/\.pdf$/i, '_unlocked.pdf') || 'unlocked.pdf';
      link.click();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <div className="space-y-4">
              <Label htmlFor="pdf-upload" className="text-base font-medium">Upload PDF File</Label>
              
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-upload"
                />
                
                {selectedFile ? (
                  <div className="space-y-2">
                    <FileText className="h-12 w-12 mx-auto text-red-500" />
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFile();
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="text-lg font-medium">Drop PDF file here</p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse (Max 50MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Process Button */}
              {selectedFile && (
                <Button
                  onClick={removePassword}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing PDF...
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4 w-4 mr-2" />
                      Remove Password Protection
                    </>
                  )}
                </Button>
              )}

              {/* Progress Bar */}
              {isProcessing && (
                <div className="space-y-3">
                  <Progress value={uploadProgress} className="h-2" />
                  <div className="text-sm text-center space-y-1">
                    <p className="text-muted-foreground">
                      {processingStage || "Initializing..."}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {uploadProgress}% complete
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Info className="h-5 w-5 mr-2 text-blue-500" />
                How It Works
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                  <p>Upload your password-protected PDF file</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                  <p>Our tool uses 7 advanced exploitation methods and 10,000+ password patterns</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                  <p>Download your unlocked PDF file instantly</p>
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Ultimate Security Bypass:</strong> Uses 7 advanced exploitation techniques including binary manipulation, encryption removal, and security bypass methods with 10,000+ password patterns.
                </AlertDescription>
              </Alert>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Processing Time:</strong> Maximum 30 seconds per file. Complex passwords may require longer processing.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <Card>
          <CardContent className="pt-6">
            {result.success ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
                    Password Removed Successfully!
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {result.pages_count}
                    </p>
                    <p className="text-sm text-muted-foreground">Pages</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {result.processing_time}s
                    </p>
                    <p className="text-sm text-muted-foreground">Time</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {result.file_size_original ? formatFileSize(result.file_size_original) : 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground">Original</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {result.file_size_output ? formatFileSize(result.file_size_output) : 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground">Unlocked</p>
                  </div>
                </div>

                {result.security_info && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Security Information</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Was Password Protected:</span>
                        <Badge variant={result.security_info.was_password_protected ? "destructive" : "secondary"}>
                          {result.security_info.was_password_protected ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Had User Password:</span>
                        <Badge variant={result.security_info.had_user_password ? "destructive" : "secondary"}>
                          {result.security_info.had_user_password ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Had Owner Password:</span>
                        <Badge variant={result.security_info.had_owner_password ? "destructive" : "secondary"}>
                          {result.security_info.had_owner_password ? "Yes" : "No"}
                        </Badge>
                      </div>
                      {result.security_info.permissions_removed?.length > 0 && (
                        <div>
                          <span>Permissions Removed:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {result.security_info.permissions_removed.map((permission, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Button onClick={downloadFile} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Unlocked PDF
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                  <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
                    Password Removal Failed
                  </h3>
                </div>
                
                <Alert variant="destructive">
                  <Lock className="h-4 w-4" />
                  <AlertDescription>
                    {result.error || "Unable to crack the password automatically. The PDF may have a very strong or complex password."}
                  </AlertDescription>
                </Alert>

                <div className="text-sm space-y-2">
                  <p><strong>Common reasons for failure:</strong></p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Very strong or complex password (not in our 2000+ password dictionary)</li>
                    <li>PDF uses advanced encryption methods</li>
                    <li>Password contains special characters or unusual patterns</li>
                    <li>File corruption or incomplete upload</li>
                  </ul>
                </div>

                <Button 
                  onClick={() => setResult(null)} 
                  variant="outline" 
                  className="w-full"
                >
                  Try Another PDF File
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}