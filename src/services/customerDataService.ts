// Customer Data Service for tracking customer information and promotional purposes
import { supabase } from '@/integrations/supabase/client';

interface CustomerData {
  user_id?: string;
  email: string;
  full_name: string;
  mobile?: string;
  signup_date?: string;
  email_verified?: boolean;
  signup_method?: string;
  last_login?: string;
  login_count?: number;
}

interface LoginHistory {
  user_id?: string;
  email: string;
  login_time?: string;
  login_method?: string;
  success: boolean;
}

class CustomerDataService {
  // Store customer signup data
  async storeCustomerData(customerData: CustomerData): Promise<boolean> {
    try {
      console.log('📊 Storing customer data:', customerData);

      // Store in localStorage as backup
      const existingData = this.getStoredCustomerData();
      const newCustomer = {
        id: Date.now().toString(),
        ...customerData,
        signup_date: customerData.signup_date || new Date().toISOString(),
        login_count: 1
      };

      existingData.push(newCustomer);
      localStorage.setItem('customer_data', JSON.stringify(existingData));

      // Also try to store permanently in Supabase via API endpoint
      try {
        const response = await fetch('/api/store-customer-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(customerData)
        });

        if (response.ok) {
          console.log('✅ Customer data stored permanently in Supabase');
        } else {
          console.log('⚠️ Failed to store in Supabase, but stored locally');
        }
      } catch (apiError) {
        console.log('⚠️ API call failed, but data stored locally:', apiError);
      }

      console.log('✅ Customer data stored successfully');
      return true;
    } catch (error) {
      console.error('❌ Error storing customer data:', error);
      return false;
    }
  }

  // Track login activity
  async trackLogin(loginData: LoginHistory): Promise<boolean> {
    try {
      console.log('📊 Tracking login:', loginData);

      // Store login history in localStorage
      const existingHistory = this.getStoredLoginHistory();
      const newLogin = {
        id: Date.now().toString(),
        ...loginData,
        login_time: loginData.login_time || new Date().toISOString()
      };

      existingHistory.push(newLogin);
      localStorage.setItem('login_history', JSON.stringify(existingHistory));

      // Update customer data with last login
      if (loginData.success && loginData.email) {
        this.updateLastLogin(loginData.email);
      }

      console.log('✅ Login tracked successfully');
      return true;
    } catch (error) {
      console.error('❌ Error tracking login:', error);
      return false;
    }
  }

  // Update last login time and increment login count
  private updateLastLogin(email: string): void {
    try {
      const customerData = this.getStoredCustomerData();
      const customerIndex = customerData.findIndex(c => c.email === email);
      
      if (customerIndex !== -1) {
        customerData[customerIndex].last_login = new Date().toISOString();
        customerData[customerIndex].login_count = (customerData[customerIndex].login_count || 0) + 1;
        localStorage.setItem('customer_data', JSON.stringify(customerData));
      }
    } catch (error) {
      console.error('❌ Error updating last login:', error);
    }
  }

  // Get stored customer data
  getStoredCustomerData(): any[] {
    try {
      const data = localStorage.getItem('customer_data');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('❌ Error getting customer data:', error);
      return [];
    }
  }

  // Get stored login history
  getStoredLoginHistory(): any[] {
    try {
      const data = localStorage.getItem('login_history');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('❌ Error getting login history:', error);
      return [];
    }
  }

  // Get paginated customers from Supabase
  async getCustomersPaginated(page: number, pageSize: number): Promise<{ data: any[], count: number }> {
    console.log(`📋 Fetching customers page ${page} (size ${pageSize})`);
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    try {
      // Get total count
      const { count, error: countError } = await supabase
        .from('profiles' as any)
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;

      // Get paginated data
      const { data, error } = await supabase
        .from('profiles' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .range(start, end);

      if (error) throw error;

      return { data: data || [], count: count || 0 };
    } catch (error) {
      console.error('⚠️ Database fetch failed, falling back to localStorage:', error);
      
      // Fallback to localStorage
      const allCustomers = this.getStoredCustomerData();
      const paginatedCustomers = allCustomers.slice(start, end + 1);
      return { data: paginatedCustomers, count: allCustomers.length };
    }
  }

  // Fetch customer stats from Supabase
  async fetchCustomerStats(): Promise<{
    totalCustomers: number;
    totalLogins: number;
    successfulLogins: number;
    failedLogins: number;
    recentSignups: number;
  }> {
    try {
      // Get total customers count
      const { count: totalCustomers } = await supabase
        .from('profiles' as any)
        .select('*', { count: 'exact', head: true });

      // For logins, we might not have a table yet, so we'll use localStorage for now
      // or if you have a login_history table, query that.
      // Assuming we rely on localStorage for login history for now as per existing code
      const loginHistory = this.getStoredLoginHistory();
      
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      // Get recent signups count
      const { count: recentSignups } = await supabase
        .from('profiles' as any)
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());

      return {
        totalCustomers: totalCustomers || 0,
        totalLogins: loginHistory.length,
        successfulLogins: loginHistory.filter(login => login.success).length,
        failedLogins: loginHistory.filter(login => !login.success).length,
        recentSignups: recentSignups || 0
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return this.getCustomerStats(); // Fallback to local stats
    }
  }

  // Get customer statistics
  getCustomerStats(): {
    totalCustomers: number;
    totalLogins: number;
    successfulLogins: number;
    failedLogins: number;
    recentSignups: number;
  } {
    const customerData = this.getStoredCustomerData();
    const loginHistory = this.getStoredLoginHistory();
    
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentSignups = customerData.filter(customer => 
      new Date(customer.signup_date) > sevenDaysAgo
    ).length;

    return {
      totalCustomers: customerData.length,
      totalLogins: loginHistory.length,
      successfulLogins: loginHistory.filter(login => login.success).length,
      failedLogins: loginHistory.filter(login => !login.success).length,
      recentSignups
    };
  }

  // Export customer data for promotional purposes
  exportCustomerData(): string {
    const customerData = this.getStoredCustomerData();
    const csvHeader = 'Email,Full Name,Mobile Number,Signup Date,Email Verified,Last Login,Login Count\n';
    const csvData = customerData.map(customer => 
      `${customer.email},${customer.full_name},${customer.mobile || 'Not provided'},${customer.signup_date},${customer.email_verified},${customer.last_login || 'Never'},${customer.login_count || 0}`
    ).join('\n');
    
    return csvHeader + csvData;
  }

  // Clear all data (for testing)
  clearAllData(): void {
    localStorage.removeItem('customer_data');
    localStorage.removeItem('login_history');
    console.log('🗑️ All customer data cleared');
  }
}

export const customerDataService = new CustomerDataService();
export default customerDataService;