import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, signup, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const submit = async (mode: 'login' | 'signup') => {
    if (!username.trim() || !password.trim()) {
      toast({ title: 'Validation Error', description: 'Please enter both username and password.', variant: 'destructive' });
      return;
    }
    const ok = mode === 'login' ? await login(username, password) : await signup(username, password);
    if (ok) {
      toast({ title: mode === 'login' ? 'Login Successful' : 'Account Created', description: 'Welcome to ContractHub!' });
    } else {
      toast({ title: 'Authentication Failed', description: 'Please check your credentials or try a different username.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-muted/50 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-md relative z-10">
        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-lg card-elevated">
          <CardHeader className="space-y-1 text-center pb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">ContractHub</CardTitle>
            <CardDescription className="text-base text-muted-foreground">Manage your contracts with confidence</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-foreground">Username</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="Enter your username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  disabled={isLoading} 
                  className="h-12 px-4 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-200" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  disabled={isLoading} 
                  className="h-12 px-4 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-200" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <Button 
                  onClick={() => submit('login')} 
                  className="h-12 btn-primary-gradient font-medium relative overflow-hidden group" 
                  disabled={isLoading}
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <div className="relative flex items-center justify-center">
                    {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Signing in...</>) : 'Sign In'}
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => submit('signup')} 
                  className="h-12 border-border/50 hover:border-primary/30 hover:bg-accent/50 transition-all duration-200 font-medium" 
                  disabled={isLoading}
                >
                  {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Creating...</>) : 'Sign Up'}
                </Button>
              </div>
            </div>
            
            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-border/30 text-center">
              <p className="text-xs text-muted-foreground">
                Professional contract management platform
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;