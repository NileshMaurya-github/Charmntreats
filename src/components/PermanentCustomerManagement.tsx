import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Download, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Calendar,
  TrendingUp,
  ShoppingCart,
  Eye,
  UserCheck,
  UserX,
  Target
} from 'lucide-react';
import permanentCustomerService from '@/services/permanentCustomerService';

interface CustomerProfile {
  id: string;
  email: string;
  full_name: string;
  mobile_number?: string;
  signup_date: string;
  email_verified: boolean;
  signup_method: string;
  last_login_at: string;
  login_count: number;
  total_orders: number;
  total_spent: number;
  marketing_consent: boolean;
  status: string;
  source: string;
  created_at: string;
}

interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  newThisWeek: number;
  newThisMonth: number;
  totalLogins: number;
  averageLoginCount: number;
  marketingOptIns: number;
}

const PermanentCustomerManagement = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [stats, setStats] = useState<CustomerStats>({
    totalCustomers: 0,
    activeCustomers: 0,
    newThisWeek: 0,
    newThisMonth: 0,
    totalLogins: 0,
    averageLoginCount: 0,
    marketingOptIns: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    setLoading(true);
    try {
      console.log('📊 Fetching permanent customer data...');
      
      // Fetch customers and stats in parallel
      const [customersData, statsData] = await Promise.all([
        permanentCustomerService.getAllCustomers(),
        permanentCustomerService.getCustomerStats()
      ]);

      setCustomers(customersData);
      setStats(statsData);
      
      console.log('✅ Customer data loaded:', {
        customers: customersData.length,
        stats: statsData
      });
    } catch (error) {
      console.error('❌ Error fetching customer data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch customer data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportCustomerData = async () => {
    try {
      console.log('📤 Exporting customer data for marketing...');
      const csvData = await permanentCustomerService.exportCustomersForMarketing();
      
      // Create and download CSV file
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `charmntreats-customers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Customer data exported successfully! ${stats.marketingOptIns} customers included.`,
      });
    } catch (error) {
      console.error('❌ Error exporting customer data:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export customer data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTargetedCustomers = async (criteria: string) => {
    try {
      let targetCriteria = {};
      
      switch (criteria) {
        case 'high-value':
          targetCriteria = { minSpent: 1000, minOrders: 3 };
          break;
        case 'recent-signups':
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          targetCriteria = { signupAfter: oneWeekAgo.toISOString() };
          break;
        case 'inactive':
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          targetCriteria = { lastLoginAfter: oneMonthAgo.toISOString() };
          break;
      }

      const targetedCustomers = await permanentCustomerService.getCustomersForTargetedMarketing(targetCriteria);
      
      toast({
        title: "Targeted Customers Found",
        description: `Found ${targetedCustomers.length} customers matching your criteria.`,
      });

      // You can implement further actions here like sending targeted emails
      console.log('🎯 Targeted customers:', targetedCustomers);
    } catch (error) {
      console.error('❌ Error getting targeted customers:', error);
      toast({
        title: "Error",
        description: "Failed to get targeted customers.",
        variant: "destructive",
      });
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        <span className="ml-2">Loading customer data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-amber-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New This Week</p>
                <p className="text-2xl font-bold text-gray-900">{stats.newThisWeek}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Marketing Opt-ins</p>
                <p className="text-2xl font-bold text-gray-900">{stats.marketingOptIns}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Customer Management</span>
            <div className="flex gap-2">
              <Button
                onClick={exportCustomerData}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Export for Marketing
              </Button>
              <Button
                onClick={fetchCustomerData}
                variant="outline"
                size="sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="customers" className="space-y-4">
            <TabsList>
              <TabsTrigger value="customers">All Customers</TabsTrigger>
              <TabsTrigger value="targeting">Targeted Marketing</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="customers" className="space-y-4">
              {/* Search and Filter */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search customers by email or name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Customer List */}
              <div className="space-y-2">
                {filteredCustomers.map((customer) => (
                  <Card key={customer.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{customer.full_name}</h3>
                            <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                              {customer.status}
                            </Badge>
                            {customer.email_verified && (
                              <Badge variant="outline" className="text-green-600">
                                Verified
                              </Badge>
                            )}
                            {customer.marketing_consent && (
                              <Badge variant="outline" className="text-blue-600">
                                Marketing OK
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {customer.email}
                              </span>
                              {customer.mobile_number && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {customer.mobile_number}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Joined {formatDate(customer.signup_date)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">
                          <div>Logins: {customer.login_count}</div>
                          <div>Orders: {customer.total_orders}</div>
                          <div>Spent: {formatCurrency(customer.total_spent)}</div>
                          <div className="text-xs text-gray-500">
                            Last login: {formatDate(customer.last_login_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="targeting" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">High-Value Customers</h3>
                  <p className="text-sm text-gray-600 mb-4">Customers with 3+ orders and ₹1000+ spent</p>
                  <Button
                    onClick={() => getTargetedCustomers('high-value')}
                    className="w-full"
                    size="sm"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Target High-Value
                  </Button>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Recent Signups</h3>
                  <p className="text-sm text-gray-600 mb-4">Customers who joined in the last 7 days</p>
                  <Button
                    onClick={() => getTargetedCustomers('recent-signups')}
                    className="w-full"
                    size="sm"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Target New Users
                  </Button>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Inactive Customers</h3>
                  <p className="text-sm text-gray-600 mb-4">Haven't logged in for 30+ days</p>
                  <Button
                    onClick={() => getTargetedCustomers('inactive')}
                    className="w-full"
                    size="sm"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Re-engage Inactive
                  </Button>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Customer Growth</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>New this week:</span>
                      <span className="font-semibold">{stats.newThisWeek}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>New this month:</span>
                      <span className="font-semibold">{stats.newThisMonth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total customers:</span>
                      <span className="font-semibold">{stats.totalCustomers}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Engagement Stats</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total logins:</span>
                      <span className="font-semibold">{stats.totalLogins}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg logins per user:</span>
                      <span className="font-semibold">{stats.averageLoginCount.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marketing opt-ins:</span>
                      <span className="font-semibold">{stats.marketingOptIns}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermanentCustomerManagement;