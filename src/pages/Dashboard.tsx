import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge, getStatusVariant, getRiskVariant } from '@/components/StatusBadge';
import { Search, Filter, Loader2, FileText, AlertTriangle, CheckCircle, Clock, Upload, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiListDocuments } from '@/lib/api';

interface Contract {
  id: string;
  name: string;
  parties: string;
  expiry: string;
  status: string;
  risk: string;
}

const Dashboard = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const itemsPerPage = 10;

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      const docs = await apiListDocuments();
      const mapped: Contract[] = docs.map((d: any) => ({
        id: d.doc_id,
        name: d.filename,
        parties: d.parties || 'Not specified',
        expiry: d.expiry_date || new Date().toISOString(),
        status: d.status || 'Active',
        risk: d.risk_score || 'Low',
      }));
      setContracts(mapped);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.parties.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || contract.risk === riskFilter;
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const items = filteredContracts;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContracts = items.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    total: contracts.length,
    active: contracts.filter(c => c.status === 'Active').length,
    expired: contracts.filter(c => c.status === 'Expired').length,
    renewalDue: contracts.filter(c => c.status === 'Renewal Due').length,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading contracts...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Contracts</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchContracts}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-background to-muted/20 min-h-screen">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            Contracts Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">Manage and monitor your contract portfolio</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="h-11 px-6 border-border/50 hover:border-primary/30 hover:bg-accent/50 transition-all duration-200">
            <Link to="/upload">
              <Upload className="mr-2 h-4 w-4"/>
              Upload Contract
            </Link>
          </Button>
          <Button asChild className="h-11 px-6 btn-primary-gradient">
            <Link to="/query">
              <MessageSquare className="mr-2 h-4 w-4"/>
              Ask Question
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-elevated group hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Contracts</CardTitle>
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30 transition-colors">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Active portfolio</p>
          </CardContent>
        </Card>
        
        <Card className="card-elevated group hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/30 transition-colors">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.active}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently running</p>
          </CardContent>
        </Card>
        
        <Card className="card-elevated group hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Renewal Due</CardTitle>
            <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center group-hover:bg-yellow-200 dark:group-hover:bg-yellow-900/30 transition-colors">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.renewalDue}</div>
            <p className="text-xs text-muted-foreground mt-1">Needs attention</p>
          </CardContent>
        </Card>
        
        <Card className="card-elevated group hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Expired</CardTitle>
            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/30 transition-colors">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.expired}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires action</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="card-elevated">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Contract Management</CardTitle>
          <CardDescription>Search and filter your contract portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search contracts, parties, or terms..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-12 h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-200" 
              />
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] h-12 bg-background/50 border-border/50 focus:border-primary/50">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Renewal Due">Renewal Due</SelectItem>
                </SelectContent>
              </Select>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-[140px] h-12 bg-background/50 border-border/50 focus:border-primary/50">
                  <SelectValue placeholder="All Risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contracts Table */}
      <Card className="card-elevated">
        <CardContent className="p-0">
          {paginatedContracts.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center space-y-4">
                <div className="mx-auto h-24 w-24 rounded-full bg-muted/30 flex items-center justify-center">
                  <FileText className="h-12 w-12 text-muted-foreground/50" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">No contracts found</h3>
                  <p className="text-muted-foreground max-w-sm">
                    {filteredContracts.length === 0 && searchTerm 
                      ? 'Try adjusting your search terms or filters' 
                      : 'Upload your first contract to get started'}
                  </p>
                </div>
                {contracts.length === 0 && (
                  <Button asChild className="mt-4">
                    <Link to="/upload">
                      <Upload className="mr-2 h-4 w-4"/>
                      Upload First Contract
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="font-semibold text-foreground py-4">Contract Name</TableHead>
                    <TableHead className="font-semibold text-foreground">Parties</TableHead>
                    <TableHead className="font-semibold text-foreground">Expiry Date</TableHead>
                    <TableHead className="font-semibold text-foreground">Status</TableHead>
                    <TableHead className="font-semibold text-foreground">Risk</TableHead>
                    <TableHead className="font-semibold text-foreground w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedContracts.map((contract, index) => (
                    <TableRow key={contract.id} className="hover:bg-accent/30 transition-colors duration-150 group">
                      <TableCell className="py-4">
                        <Link 
                          to={`/contracts/${contract.id}`} 
                          className="font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors flex items-center group-hover:translate-x-1 transition-transform duration-200"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          {contract.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{contract.parties}</TableCell>
                      <TableCell className="font-mono text-sm">{formatDate(contract.expiry)}</TableCell>
                      <TableCell>
                        <StatusBadge variant={getStatusVariant(contract.status)}>{contract.status}</StatusBadge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge variant={getRiskVariant(contract.risk)}>{contract.risk}</StatusBadge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 hover:text-primary transition-colors">
                          <Link to={`/contracts/${contract.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between py-4">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredContracts.length)} of {filteredContracts.length} contracts
          </p>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1}
              className="h-9 px-4 border-border/50 hover:border-primary/30 hover:bg-accent/50 transition-all duration-200"
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium px-3 py-1 rounded-md bg-primary/10 text-primary">
                {currentPage}
              </span>
              <span className="text-sm text-muted-foreground">of {totalPages}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages}
              className="h-9 px-4 border-border/50 hover:border-primary/30 hover:bg-accent/50 transition-all duration-200"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;