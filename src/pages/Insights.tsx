import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BarChart3, TrendingUp, PieChart, LineChart } from 'lucide-react';

const InsightsPage = () => {
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
          <h1 className="text-3xl font-bold tracking-tight">Contract Insights</h1>
          <p className="text-muted-foreground">Analytics and trends across your contract portfolio</p>
        </div>
      </div>

      {/* Coming Soon Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Risk Analytics
            </CardTitle>
            <CardDescription>
              Comprehensive risk analysis across your contract portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">Coming Soon</p>
              <p className="text-sm">Risk trend analysis and predictions</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Contract Distribution
            </CardTitle>
            <CardDescription>
              Visual breakdown of contract types and statuses
            </CardDescription>
          </CardHeader>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">Coming Soon</p>
              <p className="text-sm">Interactive contract categorization</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
            <CardDescription>
              Key performance indicators and contract health scores
            </CardDescription>
          </CardHeader>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              <LineChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">Coming Soon</p>
              <p className="text-sm">Contract performance tracking</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              AI Recommendations
            </CardTitle>
            <CardDescription>
              Intelligent suggestions for contract optimization
            </CardDescription>
          </CardHeader>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">Coming Soon</p>
              <p className="text-sm">Smart contract optimization insights</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Advanced Analytics Dashboard</h3>
            <p className="text-muted-foreground mb-4">
              This section will provide comprehensive analytics including risk trends, 
              contract performance metrics, and AI-powered insights to help you make 
              better contract management decisions.
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

export default InsightsPage;