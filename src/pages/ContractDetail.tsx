import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { StatusBadge, getStatusVariant, getRiskVariant } from '@/components/StatusBadge';
import { 
  ArrowLeft, 
  Loader2, 
  AlertTriangle, 
  FileText,
  Calendar,
  Users,
  TrendingUp,
  Eye,
  Shield,
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContractDetails {
  id: string;
  name: string;
  parties: string;
  start: string;
  expiry: string;
  status: string;
  risk: string;
  clauses: Array<{
    title: string;
    summary: string;
    confidence: number;
  }>;
  insights: Array<{
    risk: string;
    message: string;
  }>;
  evidence: Array<{
    source: string;
    snippet: string;
    relevance: number;
  }>;
}

const ContractDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contract, setContract] = useState<ContractDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchContractDetails(id);
    }
  }, [id]);

  const fetchContractDetails = async (contractId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const response = await fetch('/contract-details.json');
      if (!response.ok) {
        throw new Error('Failed to fetch contract details');
      }
      
      const data = await response.json();
      const contractData = data[contractId];
      
      if (!contractData) {
        throw new Error('Contract not found');
      }
      
      setContract(contractData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-success';
    if (confidence >= 0.6) return 'text-warning';
    return 'text-destructive';
  };

  const getInsightIcon = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'medium':
        return <Info className="h-4 w-4 text-warning" />;
      case 'low':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading contract details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Contract Not Found</h3>
            <p className="text-muted-foreground mb-4">
              {error || 'The requested contract could not be found.'}
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{contract.name}</h1>
          <p className="text-muted-foreground">Contract Details & Analysis</p>
        </div>
      </div>

      {/* Contract Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Contract Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                Parties
              </div>
              <p className="font-medium">{contract.parties}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Start Date
              </div>
              <p className="font-medium">{formatDate(contract.start)}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Expiry Date
              </div>
              <p className="font-medium">{formatDate(contract.expiry)}</p>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Status & Risk</div>
              <div className="flex gap-2">
                <StatusBadge variant={getStatusVariant(contract.status)}>
                  {contract.status}
                </StatusBadge>
                <StatusBadge variant={getRiskVariant(contract.risk)}>
                  {contract.risk} Risk
                </StatusBadge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Clauses Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Key Clauses
            </CardTitle>
            <CardDescription>
              Important contract clauses with AI confidence scores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {contract.clauses.map((clause, index) => (
              <div key={index} className="p-4 border rounded-lg bg-card">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">{clause.title}</h4>
                  <Badge variant="outline" className={getConfidenceColor(clause.confidence)}>
                    {Math.round(clause.confidence * 100)}% confidence
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{clause.summary}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Insights Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              AI Insights
            </CardTitle>
            <CardDescription>
              Risk analysis and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {contract.insights.map((insight, index) => (
              <div key={index} className="p-4 border rounded-lg bg-card">
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.risk)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge variant={getRiskVariant(insight.risk)}>
                        {insight.risk}
                      </StatusBadge>
                    </div>
                    <p className="text-sm">{insight.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Evidence Button */}
      <div className="flex justify-center">
        <Button onClick={() => setIsEvidenceOpen(true)} variant="outline">
          <Eye className="mr-2 h-4 w-4" />
          View Evidence ({contract.evidence.length})
        </Button>
      </div>

      {/* Evidence Drawer */}
      <Sheet open={isEvidenceOpen} onOpenChange={setIsEvidenceOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Supporting Evidence</SheetTitle>
            <SheetDescription>
              Document excerpts and relevance scores for the analysis
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {contract.evidence.map((evidence, index) => (
              <div key={index} className="p-4 border rounded-lg bg-card">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{evidence.source}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(evidence.relevance * 100)}% relevance
                  </span>
                </div>
                <p className="text-sm italic bg-muted p-3 rounded">
                  "{evidence.snippet}"
                </p>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ContractDetail;