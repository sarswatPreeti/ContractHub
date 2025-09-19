import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileBarChart, Download, Calendar, Filter } from 'lucide-react';

const ReportsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Generate and download comprehensive contract reports</p>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileBarChart className="h-5 w-5" />
              Portfolio Summary
            </CardTitle>
            <CardDescription>
              Complete overview of your contract portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Total contracts and values</li>
              <li>• Status distribution</li>
              <li>• Risk assessment summary</li>
              <li>• Upcoming renewals and expirations</li>
            </ul>
            <Button variant="outline" disabled className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Generate Report (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Compliance Report
            </CardTitle>
            <CardDescription>
              Track compliance status and requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Compliance violations</li>
              <li>• Missing clauses</li>
              <li>• Regulatory requirements</li>
              <li>• Action items</li>
            </ul>
            <Button variant="outline" disabled className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Generate Report (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Risk Analysis
            </CardTitle>
            <CardDescription>
              Detailed risk assessment across contracts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• High-risk contracts</li>
              <li>• Risk trend analysis</li>
              <li>• Mitigation recommendations</li>
              <li>• Risk scoring methodology</li>
            </ul>
            <Button variant="outline" disabled className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Generate Report (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileBarChart className="h-5 w-5" />
              Custom Reports
            </CardTitle>
            <CardDescription>
              Build custom reports with specific criteria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Custom date ranges</li>
              <li>• Specific contract types</li>
              <li>• Filtered by parties</li>
              <li>• Flexible export formats</li>
            </ul>
            <Button variant="outline" disabled className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Build Custom Report (Coming Soon)
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <FileBarChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Advanced Reporting Engine</h3>
            <p className="text-muted-foreground mb-4">
              Generate comprehensive reports for compliance, risk management, and portfolio analysis. 
              Export in multiple formats including PDF, Excel, and CSV for easy sharing with stakeholders.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;