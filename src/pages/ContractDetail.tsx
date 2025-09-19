import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { StatusBadge, getStatusVariant, getRiskVariant } from '@/components/StatusBadge';
import { cn } from '@/lib/utils';
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
  Info,
  Download,
  FileType
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiGetContractDetail } from '@/lib/api';

interface ContractClause {
  title: string;
  text: string;
  confidence: number;
  page?: number;
}

interface ContractInsight {
  type: string; // "risk" or "recommendation"
  title: string;
  description: string;
  severity: string; // "low", "medium", "high"
}

interface ContractDetails {
  doc_id: string;
  filename: string;
  uploaded_on: string;
  expiry_date?: string;
  status: string;
  risk_score: string;
  parties?: string;
  contract_type?: string;
  clauses: ContractClause[];
  insights: ContractInsight[];
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
      
      const data = await apiGetContractDetail(contractId);
      setContract(data);
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
    if (confidence >= 0.9) return 'text-success';
    if (confidence >= 0.75) return 'text-warning';
    return 'text-destructive';
  };

  const getInsightIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
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

  const getInsightTypeIcon = (type: string) => {
    return type === 'risk' ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />;
  };

  const calculateDaysUntilExpiry = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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

  const daysUntilExpiry = contract.expiry_date ? calculateDaysUntilExpiry(contract.expiry_date) : null;

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto bg-gradient-to-br from-background to-muted/10 min-h-screen">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="h-11 px-4 hover:bg-accent/50 transition-all duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <Separator orientation="vertical" className="h-8" />
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              {contract.filename}
            </h1>
            <p className="text-lg text-muted-foreground">Contract Analysis & Insights</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="h-11 px-6 border-border/50 hover:border-primary/30 hover:bg-accent/50 transition-all duration-200">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Enhanced Contract Metadata */}
      <Card className="card-elevated">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            Contract Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                <Users className="h-4 w-4" />
                Parties
              </div>
              <p className="text-lg font-semibold">{contract.parties || 'Not specified'}</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                <FileType className="h-4 w-4" />
                Contract Type
              </div>
              <p className="text-lg font-semibold">{contract.contract_type || 'General Contract'}</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                <Calendar className="h-4 w-4" />
                Uploaded
              </div>
              <p className="text-lg font-semibold">{formatDate(contract.uploaded_on)}</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                <Calendar className="h-4 w-4" />
                Expiry Date
              </div>
              <div>
                <p className="text-lg font-semibold">{contract.expiry_date ? formatDate(contract.expiry_date) : 'Not specified'}</p>
                {daysUntilExpiry !== null && (
                  <p className={`text-sm font-medium ${daysUntilExpiry < 30 ? 'text-red-600 dark:text-red-400' : daysUntilExpiry < 90 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
                    {daysUntilExpiry > 0 ? `${daysUntilExpiry} days remaining` : `Expired ${Math.abs(daysUntilExpiry)} days ago`}
                  </p>
                )}
              </div>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <StatusBadge variant={getStatusVariant(contract.status)} className="px-4 py-2">
                {contract.status}
              </StatusBadge>
              <StatusBadge variant={getRiskVariant(contract.risk_score)} className="px-4 py-2">
                {contract.risk_score} Risk
              </StatusBadge>
            </div>
            <div className="text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-lg">
              {contract.clauses.length} clauses analyzed • {contract.insights.length} insights generated
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Enhanced Clauses Section */}
        <Card className="card-elevated">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              Key Clauses
            </CardTitle>
            <CardDescription className="text-base">
              Important contract clauses extracted with AI confidence scores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {contract.clauses.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-20 w-20 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                  <FileText className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <p className="text-muted-foreground">No clauses extracted from this contract</p>
              </div>
            ) : (
              contract.clauses.map((clause, index) => (
                <div key={index} className="p-6 border border-border/50 rounded-lg bg-card/50 hover:bg-card hover:shadow-md transition-all duration-200 group">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">{clause.title}</h4>
                    <div className="flex items-center gap-3">
                      {clause.page && (
                        <Badge variant="outline" className="text-xs bg-muted/50">
                          Page {clause.page}
                        </Badge>
                      )}
                      <Badge 
                        variant="outline" 
                        className={`text-xs font-medium ${getConfidenceColor(clause.confidence)} border-current`}
                      >
                        {Math.round(clause.confidence * 100)}% confident
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed bg-muted/20 p-4 rounded-lg italic">
                    "{clause.text}"
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Enhanced AI Insights Section */}
        <Card className="card-elevated">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              AI Insights & Recommendations
            </CardTitle>
            <CardDescription className="text-base">
              Risk analysis and actionable recommendations powered by AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {contract.insights.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-20 w-20 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                  <TrendingUp className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <p className="text-muted-foreground">No insights available for this contract</p>
              </div>
            ) : (
              contract.insights.map((insight, index) => (
                <div key={index} className="p-6 border border-border/50 rounded-lg bg-card/50 hover:bg-card hover:shadow-md transition-all duration-200 group">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "flex-shrink-0 mt-1 h-8 w-8 rounded-lg flex items-center justify-center",
                      insight.type === 'risk' ? "bg-red-100 dark:bg-red-900/20" : "bg-blue-100 dark:bg-blue-900/20"
                    )}>
                      {getInsightTypeIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="font-semibold text-base group-hover:text-primary transition-colors">{insight.title}</h4>
                        <div className="flex items-center gap-2">
                          {getInsightIcon(insight.severity)}
                          <Badge 
                            variant="outline" 
                            className={`text-xs font-medium ${
                              insight.severity === 'high' ? 'border-red-500 text-red-600 dark:text-red-400' : 
                              insight.severity === 'medium' ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400' : 
                              'border-green-500 text-green-600 dark:text-green-400'
                            }`}
                          >
                            {insight.severity.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Evidence Button */}
      <div className="flex justify-center pt-4">
        <Button 
          onClick={() => setIsEvidenceOpen(true)} 
          variant="outline" 
          size="lg"
          className="h-12 px-8 border-border/50 hover:border-primary/30 hover:bg-accent/50 transition-all duration-200"
        >
          <Eye className="mr-3 h-5 w-5" />
          View Source Evidence ({contract.clauses.length} extracts)
        </Button>
      </div>

      {/* Enhanced Evidence Drawer */}
      <Sheet open={isEvidenceOpen} onOpenChange={setIsEvidenceOpen}>
        <SheetContent className="w-[400px] sm:w-[600px]">
          <SheetHeader className="pb-6">
            <SheetTitle className="text-xl">Supporting Evidence</SheetTitle>
            <SheetDescription className="text-base">
              Document excerpts and their extraction confidence details
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {contract.clauses.map((clause, index) => (
              <div key={index} className="p-6 border border-border/50 rounded-lg bg-card/50 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-sm px-3 py-1 bg-primary/10 text-primary border-primary/20">
                    {clause.title}
                  </Badge>
                  <div className="flex items-center gap-3">
                    {clause.page && (
                      <span className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                        Page {clause.page}
                      </span>
                    )}
                    <span className={`text-sm font-medium ${getConfidenceColor(clause.confidence)}`}>
                      {Math.round(clause.confidence * 100)}% confidence
                    </span>
                  </div>
                </div>
                <blockquote className="text-sm italic bg-muted/30 p-4 rounded-lg border-l-4 border-primary/30 leading-relaxed">
                  "{clause.text}"
                </blockquote>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ContractDetail;