import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Loader2, 
  Search, 
  MessageSquare, 
  ArrowLeft, 
  Sparkles,
  FileText,
  Lightbulb,
  Clock
} from 'lucide-react';
import { apiQuery } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface QueryChunk {
  chunk_id: string;
  text_chunk: string;
  relevance: number;
  metadata: {
    page?: number;
    contract_name?: string;
    clause_type?: string;
    confidence?: number;
  };
}

interface QueryResult {
  answer: string;
  chunks: QueryChunk[];
}

const SAMPLE_QUERIES = [
  "What are the termination notice requirements?",
  "What is the liability cap in my contracts?",
  "Show me payment terms and deadlines",
  "What confidentiality obligations exist?",
  "Are there any renewal clauses?",
  "What are the intellectual property terms?"
];

const QueryPage = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (queryText?: string) => {
    const searchQuery = queryText || query;
    if (!searchQuery.trim()) {
      toast({
        title: "Please enter a question",
        description: "Type your question about your contracts",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await apiQuery(searchQuery, 5);
      setResult(res);
      
      // Add to history if not already there
      if (!queryHistory.includes(searchQuery)) {
        setQueryHistory(prev => [searchQuery, ...prev.slice(0, 4)]);
      }
      
      setQuery('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Search failed';
      toast({
        title: "Search failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 0.8) return 'text-success border-success';
    if (relevance >= 0.6) return 'text-warning border-warning';
    return 'text-destructive border-destructive';
  };

  const getClauseTypeColor = (clauseType: string) => {
    const colors: Record<string, string> = {
      'termination': 'bg-destructive/10 text-destructive',
      'liability': 'bg-warning/10 text-warning',
      'payment': 'bg-success/10 text-success',
      'confidentiality': 'bg-primary/10 text-primary',
      'intellectual_property': 'bg-purple-100 text-purple-700',
      'general': 'bg-muted text-muted-foreground'
    };
    return colors[clauseType] || colors['general'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 backdrop-blur-sm bg-background/80 rounded-lg p-6 border shadow-sm">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Contract Query
            </h1>
            <p className="text-muted-foreground">Ask questions about your contracts in natural language</p>
          </div>
        </div>

        {/* Search Interface */}
        <Card className="card-elevated backdrop-blur-sm bg-background/90 border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              Ask Your Contracts
            </CardTitle>
            <CardDescription>
              Use natural language to search through your contract documents and get AI-powered answers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  ref={inputRef}
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 h-12 text-base border-primary/20 focus:border-primary/50 focus:ring-primary/20" 
                  placeholder="e.g., What are the termination requirements?"
                  disabled={loading}
                />
              </div>
              <Button 
                onClick={() => handleSubmit()} 
                disabled={loading || !query.trim()}
                className="btn-primary-gradient h-12 px-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                    Searching...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4"/>
                    Search
                  </>
                )}
              </Button>
            </div>

          {/* Sample Queries */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Try these example questions:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {SAMPLE_QUERIES.map((sampleQuery, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSubmit(sampleQuery)}
                  disabled={loading}
                  className="justify-start text-left h-auto py-3 px-4 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
                >
                  <span className="text-sm">{sampleQuery}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Recent Queries */}
          {queryHistory.length > 0 && (
            <div className="space-y-3 pt-2 border-t">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent searches:
              </p>
              <div className="flex flex-wrap gap-2">
                {queryHistory.map((historyQuery, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSubmit(historyQuery)}
                    disabled={loading}
                    className="text-xs opacity-70 hover:opacity-100 hover:bg-primary/5 transition-all duration-200"
                  >
                    {historyQuery}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* AI Answer */}
          <Card className="card-elevated border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                AI Answer
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="p-6 rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-purple-500/5 border border-primary/20 shadow-sm">
                <p className="leading-relaxed text-foreground font-medium">{result.answer}</p>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
                <FileText className="h-3 w-3" />
                Based on {result.chunks.length} relevant contract sections
              </div>
            </CardContent>
          </Card>

          {/* Source Evidence */}
          {result.chunks.length > 0 && (
            <Card className="card-elevated">
              <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-muted/50 rounded-lg">
                    <FileText className="h-5 w-5" />
                  </div>
                  Supporting Evidence
                </CardTitle>
                <CardDescription>
                  Contract excerpts that support this answer, ranked by relevance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {result.chunks.map((chunk, index) => (
                  <div key={chunk.chunk_id} className="p-5 border rounded-xl bg-gradient-to-r from-background to-muted/20 space-y-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs bg-primary/10 border-primary/30">
                          #{index + 1}
                        </Badge>
                        {chunk.metadata?.clause_type && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getClauseTypeColor(chunk.metadata.clause_type)}`}
                          >
                            {chunk.metadata.clause_type.replace('_', ' ')}
                          </Badge>
                        )}
                        {chunk.metadata?.contract_name && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {chunk.metadata.contract_name}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {chunk.metadata?.page && (
                          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                            Page {chunk.metadata.page}
                          </span>
                        )}
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getRelevanceColor(chunk.relevance)}`}
                        >
                          {Math.round(chunk.relevance * 100)}% relevant
                        </Badge>
                      </div>
                    </div>
                    
                    <blockquote className="text-sm italic border-l-4 border-primary/30 pl-4 bg-primary/5 p-4 rounded-r-lg">
                      "{chunk.text_chunk}"
                    </blockquote>
                    
                    {chunk.metadata?.confidence && (
                      <div className="text-xs text-muted-foreground bg-muted/30 rounded px-3 py-1 w-fit">
                        Extraction confidence: {Math.round(chunk.metadata.confidence * 100)}%
                      </div>
                    )}
                  </div>
                ))}
                
                {result.chunks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="p-4 bg-muted/20 rounded-full w-fit mx-auto mb-4">
                      <FileText className="h-8 w-8 opacity-50" />
                    </div>
                    <p className="font-medium">No relevant contract sections found</p>
                    <p className="text-xs mt-1">Try rephrasing your question or upload more contracts</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && (
        <Card className="card-elevated">
          <CardContent className="py-12">
            <div className="text-center">
              <div className="p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-full w-fit mx-auto mb-4">
                <MessageSquare className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Ready to Search</h3>
              <p className="text-muted-foreground mb-4">
                Enter your question above or try one of the example queries to get started
              </p>
              <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4 max-w-md mx-auto">
                <p>💡 <strong>Tip:</strong> Ask specific questions like "What are payment terms?" or "How much notice is required for termination?"</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
};

export default QueryPage;
