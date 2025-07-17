import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, LogIn, UserCheck, Download, Trash2, RefreshCw } from 'lucide-react';
import customerDataService from '@/services/customerDataService';

const CustomerDataSection = () => {
  const { toast } = useToast();
  const [customerData, setCustomerData] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalLogins: 0,
    successfulLogins: 0,
    failedLogins: 0,
    recentSignups: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCustomerData();
  }, []);

  const loadCustomerData = () => {
    setLoading(true);
    try {
      const customers = customerDataService.getStoredCustomerData();
      const logins = customerDataService.getStoredLoginHistory();
      const statistics = customerDataService.getCustomerStats();

      setCustomerData(customers);
      setLoginHistory(logins);
      setStats(statistics);
    } catch (error) {
      console.error('Error loading customer data:', error);
      toast({
        title: "Error",
        description: "Failed to load customer data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    try {
      const csvData = customerDataService.exportCustomerData();
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customer_data_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Customer data has been exported to CSV file.",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export customer data.",
        variant: "destructive",
      });
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all customer data? This action cannot be undone.')) {
      customerDataService.clearAllData();
      loadCustomerData();
      toast({
        title: "Data Cleared",
        description: "All customer data has been cleared.",
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-amber-600" />
        <span className="ml-2">Loading customer data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Customer Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <LogIn className="h-6 w-6 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Logins</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalLogins}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <UserCheck className="h-6 w-6 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Successful Logins</p>
                <p className="text-xl font-bold text-green-700">{stats.successfulLogins}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <UserCheck className="h-6 w-6 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Failed Logins</p>
                <p className="text-xl font-bold text-red-700">{stats.failedLogins}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-amber-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Recent Signups</p>
                <p className="text-xl font-bold text-amber-700">{stats.recentSignups}</p>
                <p className="text-xs text-gray-500">Last 7 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button
          onClick={loadCustomerData}
          variant="outline"
          className="flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
        
        <Button
          onClick={handleExportData}
          className="bg-green-600 hover:bg-green-700 flex items-center"
          disabled={customerData.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>

        <Button
          onClick={handleClearData}
          variant="destructive"
          className="flex items-center"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All Data
        </Button>
      </div>

      {/* Customer Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information ({customerData.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {customerData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No customer data available yet.</p>
              <p className="text-sm">Customer data will appear here after users sign up.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {customerData.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{customer.full_name}</h3>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                        {customer.mobile && (
                          <p className="text-sm text-gray-600">📱 {customer.mobile}</p>
                        )}
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={customer.email_verified ? "default" : "secondary"}>
                            {customer.email_verified ? "Verified" : "Unverified"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {customer.signup_method || 'email'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p><strong>Signed up:</strong> {formatDate(customer.signup_date)}</p>
                    <p><strong>Last login:</strong> {formatDate(customer.last_login)}</p>
                    <p><strong>Login count:</strong> {customer.login_count || 0}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Login History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Login Activity ({loginHistory.slice(0, 10).length} of {loginHistory.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loginHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <LogIn className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No login activity yet.</p>
              <p className="text-sm">Login history will appear here after users sign in.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {loginHistory
                .sort((a, b) => new Date(b.login_time) - new Date(a.login_time))
                .slice(0, 10)
                .map((login) => (
                  <div key={login.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <LogIn className={`h-4 w-4 ${login.success ? 'text-green-600' : 'text-red-600'}`} />
                      <div>
                        <p className="font-medium text-gray-900">{login.email}</p>
                        <p className="text-sm text-gray-600">{login.login_method || 'email_password'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={login.success ? "default" : "destructive"}>
                        {login.success ? "Success" : "Failed"}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(login.login_time)}
                      </p>
                    </div>
                  </div>
                ))}
              
              {loginHistory.length > 10 && (
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    Showing 10 most recent logins. Export CSV for complete history.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Promotional Use Notice */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-amber-600" />
              </div>
            </div>
            <div>
              <h4 className="font-medium text-amber-800">Customer Data for Promotional Use</h4>
              <p className="text-sm text-amber-700 mt-1">
                This customer data is collected for promotional purposes. You can export the data as CSV 
                to use for email marketing campaigns, customer analysis, and business insights.
              </p>
              <div className="mt-2 text-xs text-amber-600">
                <p>• Email addresses for newsletter campaigns</p>
                <p>• Login patterns for engagement analysis</p>
                <p>• Customer preferences for targeted marketing</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDataSection;