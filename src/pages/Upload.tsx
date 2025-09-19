import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { apiUpload } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const onFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = Array.from(files)[0];
    const allowed = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(f.type)) {
      toast({ 
        title: 'Unsupported file type', 
        description: 'Only PDF, TXT, and DOCX files are supported.', 
        variant: 'destructive' 
      });
      return;
    }
    if (f.size > 10 * 1024 * 1024) { // 10MB limit
      toast({ 
        title: 'File too large', 
        description: 'File size must be under 10MB.', 
        variant: 'destructive' 
      });
      return;
    }
    setFile(f);
  };

  const startUpload = async () => {
    if (!file) return;
    try {
      setUploading(true);
      setProgress(10);
      
      // Simulate parsing progress
      await new Promise(r => setTimeout(r, 500));
      setProgress(30);
      
      await new Promise(r => setTimeout(r, 300));
      setProgress(60);
      
      const res = await apiUpload(file);
      setProgress(100);
      
      toast({ 
        title: 'Contract uploaded successfully!', 
        description: `Document processed with ${res.chunks_inserted} content chunks.` 
      });
      
      // Navigate back to dashboard after successful upload
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
      setFile(null);
    } catch (e) {
      toast({ 
        title: 'Upload failed', 
        description: e instanceof Error ? e.message : 'An error occurred during upload', 
        variant: 'destructive' 
      });
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const removeFile = () => {
    setFile(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="p-6 max-w-3xl mx-auto">
        <div className="backdrop-blur-sm bg-background/80 rounded-lg p-6 border shadow-sm mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4 hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Upload Contract
          </h1>
          <p className="text-muted-foreground">Upload your contract documents for AI-powered analysis and insights</p>
        </div>

        <Card className="card-elevated backdrop-blur-sm bg-background/90 border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <UploadCloud className="h-5 w-5 text-primary" />
              </div>
              Upload Documents
            </CardTitle>
            <CardDescription>
              Drag and drop your contract files or click to browse. Supported formats: PDF, TXT, DOCX
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                dragOver 
                  ? 'border-primary bg-gradient-to-r from-primary/10 to-purple-500/10 scale-105' 
                  : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); onFiles(e.dataTransfer.files); }}
              onClick={() => inputRef.current?.click()}
            >
              <input 
                ref={inputRef} 
                type="file" 
                accept=".pdf,.txt,.docx" 
                className="hidden" 
                onChange={(e) => onFiles(e.target.files)} 
              />
              <div className="p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-full w-fit mx-auto mb-4">
                <UploadCloud className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Drop your contract files here</h3>
              <p className="text-muted-foreground mb-2">or click to browse from your computer</p>
              <p className="text-xs text-muted-foreground bg-muted/50 rounded px-3 py-1 w-fit mx-auto">Maximum file size: 10MB</p>
            </div>

          {file && (
            <Card className="border-primary/20 bg-gradient-to-r from-background to-primary/5">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{file.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type.split('/')[1].toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!uploading ? (
                      <>
                        <Button variant="outline" size="sm" onClick={removeFile} className="hover:bg-destructive/10 hover:border-destructive/30">
                          Remove
                        </Button>
                        <Button size="sm" onClick={startUpload} className="btn-primary-gradient">
                          Process Contract
                        </Button>
                      </>
                    ) : (
                      <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">Processing...</span>
                    )}
                  </div>
                </div>
                
                {uploading && (
                  <div className="mt-4 space-y-3">
                    <Progress value={progress} className="w-full h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground bg-muted/30 rounded-lg p-2">
                      <span className="font-medium">
                        {progress < 30 && "📤 Uploading file..."}
                        {progress >= 30 && progress < 60 && "📄 Parsing document content..."}
                        {progress >= 60 && progress < 100 && "🤖 Generating embeddings..."}
                        {progress >= 100 && "✅ Complete!"}
                      </span>
                      <span className="font-mono">{progress}%</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start gap-3 text-sm p-4 rounded-lg bg-success/5 border border-success/20">
              <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-success">AI-Powered Analysis</div>
                <div className="text-muted-foreground">Automatic clause extraction and risk assessment</div>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm p-4 rounded-lg bg-success/5 border border-success/20">
              <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-success">Secure Storage</div>
                <div className="text-muted-foreground">Your documents are encrypted and stored securely</div>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm p-4 rounded-lg bg-warning/5 border border-warning/20">
              <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-warning">Demo Environment</div>
                <div className="text-muted-foreground">Currently using simulated AI processing for demonstration</div>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm p-4 rounded-lg bg-success/5 border border-success/20">
              <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-success">Instant Search</div>
                <div className="text-muted-foreground">Query your contracts in natural language</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default UploadPage;
