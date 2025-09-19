import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadFile {
  id: string;
  file: File;
  status: 'uploading' | 'success' | 'error';
  progress: number;
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  }, []);

  const handleFiles = (fileList: File[]) => {
    const newFiles: UploadFile[] = fileList.map(file => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      status: 'uploading',
      progress: 0,
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload for each file
    newFiles.forEach(uploadFile => {
      simulateUpload(uploadFile.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setFiles(prev => 
        prev.map(file => {
          if (file.id === fileId && file.status === 'uploading') {
            const newProgress = Math.min(file.progress + Math.random() * 20, 100);
            
            if (newProgress >= 100) {
              clearInterval(interval);
              // Randomly simulate success or error (90% success rate)
              const isSuccess = Math.random() > 0.1;
              
              setTimeout(() => {
                setFiles(prev =>
                  prev.map(f =>
                    f.id === fileId
                      ? { ...f, status: isSuccess ? 'success' : 'error', progress: 100 }
                      : f
                  )
                );

                if (isSuccess) {
                  toast({
                    title: "Upload Complete",
                    description: `${file.file.name} uploaded successfully.`,
                  });
                } else {
                  toast({
                    title: "Upload Failed",
                    description: `Failed to upload ${file.file.name}.`,
                    variant: "destructive",
                  });
                }
              }, 500);
              
              return { ...file, progress: 100 };
            }
            
            return { ...file, progress: newProgress };
          }
          return file;
        })
      );
    }, 200);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleClose = () => {
    setFiles([]);
    onClose();
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'uploading':
        return <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg card-elevated">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Upload className="h-4 w-4 text-primary" />
            </div>
            Upload Contracts
          </DialogTitle>
          <DialogDescription className="text-base">
            Upload your contract documents for analysis and management. Supports multiple file formats.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Enhanced Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "upload-zone relative overflow-hidden group",
              isDragOver && "drag-over scale-105"
            )}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className={cn(
                "h-16 w-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300",
                isDragOver ? "bg-primary text-primary-foreground scale-110" : "bg-primary/10 text-primary group-hover:bg-primary/20"
              )}>
                <Upload className="h-8 w-8" />
              </div>
              
              <h3 className="text-lg font-semibold mb-2">
                {isDragOver ? "Drop files here" : "Upload Contract Files"}
              </h3>
              
              <p className="text-muted-foreground mb-4 text-center">
                Drag and drop your files here, or click to browse
              </p>
              
              <Button
                variant="outline"
                className="relative h-11 px-6 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <FileText className="mr-2 h-4 w-4" />
                Choose Files
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </Button>
              
              <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>PDF, DOC, DOCX, TXT</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Up to 10MB each</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Files List */}
          {files.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Upload Progress ({files.length} file{files.length !== 1 ? 's' : ''})
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFiles([])}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear All
                </Button>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 -mr-2">
                {files.map((file, index) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-4 p-4 border border-border/50 rounded-lg bg-card/50 hover:bg-card transition-all duration-200 group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                      file.status === 'success' && "bg-green-100 dark:bg-green-900/20",
                      file.status === 'error' && "bg-red-100 dark:bg-red-900/20",
                      file.status === 'uploading' && "bg-blue-100 dark:bg-blue-900/20"
                    )}>
                      <FileText className={cn(
                        "h-5 w-5",
                        file.status === 'success' && "text-green-600 dark:text-green-400",
                        file.status === 'error' && "text-red-600 dark:text-red-400",
                        file.status === 'uploading' && "text-blue-600 dark:text-blue-400"
                      )} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium truncate pr-2">{file.file.name}</p>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {getStatusIcon(file.status)}
                          <span className={cn(
                            "text-xs font-medium",
                            file.status === 'success' && "text-green-600 dark:text-green-400",
                            file.status === 'error' && "text-red-600 dark:text-red-400",
                            file.status === 'uploading' && "text-blue-600 dark:text-blue-400"
                          )}>
                            {file.status === 'uploading' && `${Math.round(file.progress)}%`}
                            {file.status === 'success' && 'Complete'}
                            {file.status === 'error' && 'Failed'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {(file.file.size / 1024 / 1024).toFixed(1)} MB
                        </span>
                        {file.status === 'uploading' && (
                          <div className="flex-1 mx-3">
                            <Progress 
                              value={file.progress} 
                              className="h-1.5 bg-muted" 
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="flex-shrink-0 h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-border/30">
            <div className="text-xs text-muted-foreground">
              {files.length > 0 && (
                <span>
                  {files.filter(f => f.status === 'success').length} of {files.length} uploaded successfully
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleClose}
                className="border-border/50 hover:border-border hover:bg-accent/50 transition-all duration-200"
              >
                {files.some(f => f.status === 'success') ? 'Done' : 'Cancel'}
              </Button>
              {files.length > 0 && files.every(f => f.status !== 'uploading') && (
                <Button 
                  onClick={() => setFiles([])}
                  className="btn-primary-gradient"
                >
                  Upload More
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}