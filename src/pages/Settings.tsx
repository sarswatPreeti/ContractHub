import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database,
  LogOut
} from 'lucide-react';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account and application preferences</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                value={user?.username || ''} 
                disabled 
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Username cannot be changed in the demo version
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Display Name</Label>
              <Input 
                id="name" 
                value={user?.name || ''} 
                disabled 
                className="bg-muted"
              />
            </div>
            <Button variant="outline" disabled>
              Save Changes (Demo)
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how you receive notifications about your contracts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Contract Expiration Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when contracts are approaching expiration
                </p>
              </div>
              <Switch disabled />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Risk Score Changes</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts when contract risk scores change
                </p>
              </div>
              <Switch disabled />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Portfolio Summary</Label>
                <p className="text-sm text-muted-foreground">
                  Get a weekly email summary of your contract portfolio
                </p>
              </div>
              <Switch disabled />
            </div>
            <p className="text-xs text-muted-foreground">
              Notification settings are disabled in the demo version
            </p>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>
              Manage your account security and privacy settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Current Password</Label>
              <Input type="password" disabled placeholder="••••••••" className="bg-muted" />
            </div>
            <div className="grid gap-2">
              <Label>New Password</Label>
              <Input type="password" disabled placeholder="••••••••" className="bg-muted" />
            </div>
            <div className="grid gap-2">
              <Label>Confirm New Password</Label>
              <Input type="password" disabled placeholder="••••••••" className="bg-muted" />
            </div>
            <Button variant="outline" disabled>
              Change Password (Demo)
            </Button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>
              Manage your contract data and storage preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Storage Usage</p>
              <div className="text-sm text-muted-foreground">
                Your contracts and data are securely stored and encrypted.
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium">Data Export</p>
              <div className="text-sm text-muted-foreground">
                Export your contract data for backup or migration purposes.
              </div>
              <Button variant="outline" disabled>
                Export Data (Demo)
              </Button>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium text-destructive">Danger Zone</p>
              <div className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data.
              </div>
              <Button variant="destructive" disabled>
                Delete Account (Demo)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Session Management</h3>
                <p className="text-sm text-muted-foreground">
                  Sign out of your current session
                </p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;