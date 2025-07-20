// Permanent Customer Tracking Service for Marketing & Promotional Purposes
import { supabase } from '@/integrations/supabase/client';

interface CustomerProfile {
  id?: string;
  user_id?: string;
  email: string;
  full_name: string;
  mobile_number?: string;
  signup_date: string;
  email_verified: boolean;
  signup_method: 'email' | 'google' | 'facebook' | 'manual';
  last_login_at: string;
  login_count: number;
  total_orders?: number;
  total_spent?: number;
  preferred_categories?: string[];
  marketing_consent: boolean;
  status: 'active' | 'inactive' | 'blocked';
  source: 'website' | 'mobile' | 'admin';
  ip_address?: string;
  user_agent?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

interface LoginActivity {
  id?: string;
  customer_id?: string;
  email: string;
  login_time: string;
  login_method: 'password' | 'otp' | 'social' | 'admin';
  success: boolean;
  ip_address?: string;
  user_agent?: string;
  device_info?: string;
  failure_reason?: string;
  created_at?: string;
}

class PermanentCustomerService {
  
  // Store customer profile permanently
  async storeCustomerProfile(customerData: Partial<CustomerProfile>): Promise<boolean> {
    try {
      console.log('💾 Storing permanent customer profile:', customerData.email);

      const profileData: CustomerProfile = {
        email: customerData.email!,
        full_name: customerData.full_name || 'Unknown User',
        mobile_number: customerData.mobile_number,
        signup_date: customerData.signup_date || new Date().toISOString(),
        email_verified: customerData.email_verified || false,
        signup_method: customerData.signup_method || 'email',
        last_login_at: new Date().toISOString(),
        login_count: 1,
        total_orders: 0,
        total_spent: 0,
        preferred_categories: [],
        marketing_consent: true, // Default to true for promotional purposes
        status: 'active',
        source: 'website',
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Try to store in Supabase first
      const { data, error } = await supabase
        .from('customer_profiles')
        .upsert(profileData, { 
          onConflict: 'email',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase storage failed:', error);
        // Fallback to local storage
        this.storeLocallyAsBackup(profileData);
        return false;
      }

      console.log('✅ Customer profile stored permanently:', data.id);
      
      // Also store locally as backup
      this.storeLocallyAsBackup(profileData);
      
      return true;
    } catch (error) {
      console.error('❌ Error storing customer profile:', error);
      // Always store locally as fallback
      this.storeLocallyAsBackup(customerData as CustomerProfile);
      return false;
    }
  }

  // Update existing customer profile
  async updateCustomerProfile(email: string, updates: Partial<CustomerProfile>): Promise<boolean> {
    try {
      console.log('🔄 Updating customer profile:', email);

      const updateData = {
        ...updates,
        last_login_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Update in Supabase
      const { data, error } = await supabase
        .from('customer_profiles')
        .update(updateData)
        .eq('email', email)
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to update customer profile:', error);
        return false;
      }

      console.log('✅ Customer profile updated:', data.id);
      return true;
    } catch (error) {
      console.error('❌ Error updating customer profile:', error);
      return false;
    }
  }

  // Track login activity
  async trackLoginActivity(loginData: Partial<LoginActivity>): Promise<boolean> {
    try {
      console.log('📊 Tracking login activity:', loginData.email);

      const activityData: LoginActivity = {
        email: loginData.email!,
        login_time: new Date().toISOString(),
        login_method: loginData.login_method || 'password',
        success: loginData.success || false,
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent,
        device_info: this.getDeviceInfo(),
        failure_reason: loginData.failure_reason,
        created_at: new Date().toISOString()
      };

      // Store login activity
      const { error } = await supabase
        .from('login_activities')
        .insert(activityData);

      if (error) {
        console.error('❌ Failed to store login activity:', error);
        return false;
      }

      // Update customer login count if successful
      if (loginData.success) {
        await this.incrementLoginCount(loginData.email!);
      }

      console.log('✅ Login activity tracked');
      return true;
    } catch (error) {
      console.error('❌ Error tracking login activity:', error);
      return false;
    }
  }

  // Increment login count for customer
  private async incrementLoginCount(email: string): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('customer_profiles')
        .select('login_count')
        .eq('email', email)
        .single();

      if (!error && data) {
        await supabase
          .from('customer_profiles')
          .update({ 
            login_count: (data.login_count || 0) + 1,
            last_login_at: new Date().toISOString()
          })
          .eq('email', email);
      }
    } catch (error) {
      console.error('❌ Error incrementing login count:', error);
    }
  }

  // Get all customers for admin dashboard
  async getAllCustomers(): Promise<CustomerProfile[]> {
    try {
      const { data, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Failed to fetch customers:', error);
        return this.getLocalCustomers();
      }

      return data || [];
    } catch (error) {
      console.error('❌ Error fetching customers:', error);
      return this.getLocalCustomers();
    }
  }

  // Get customer statistics
  async getCustomerStats(): Promise<{
    totalCustomers: number;
    activeCustomers: number;
    newThisWeek: number;
    newThisMonth: number;
    totalLogins: number;
    averageLoginCount: number;
    marketingOptIns: number;
  }> {
    try {
      const customers = await this.getAllCustomers();
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const stats = {
        totalCustomers: customers.length,
        activeCustomers: customers.filter(c => c.status === 'active').length,
        newThisWeek: customers.filter(c => new Date(c.signup_date) > oneWeekAgo).length,
        newThisMonth: customers.filter(c => new Date(c.signup_date) > oneMonthAgo).length,
        totalLogins: customers.reduce((sum, c) => sum + (c.login_count || 0), 0),
        averageLoginCount: customers.length > 0 ? 
          customers.reduce((sum, c) => sum + (c.login_count || 0), 0) / customers.length : 0,
        marketingOptIns: customers.filter(c => c.marketing_consent).length
      };

      return stats;
    } catch (error) {
      console.error('❌ Error getting customer stats:', error);
      return {
        totalCustomers: 0,
        activeCustomers: 0,
        newThisWeek: 0,
        newThisMonth: 0,
        totalLogins: 0,
        averageLoginCount: 0,
        marketingOptIns: 0
      };
    }
  }

  // Export customers for promotional purposes
  async exportCustomersForMarketing(): Promise<string> {
    try {
      const customers = await this.getAllCustomers();
      const marketingCustomers = customers.filter(c => c.marketing_consent && c.status === 'active');

      const csvHeader = 'Email,Full Name,Mobile Number,Signup Date,Last Login,Login Count,Total Orders,Total Spent,Status\n';
      const csvData = marketingCustomers.map(customer => 
        `"${customer.email}","${customer.full_name}","${customer.mobile_number || 'N/A'}","${customer.signup_date}","${customer.last_login_at}","${customer.login_count}","${customer.total_orders || 0}","₹${customer.total_spent || 0}","${customer.status}"`
      ).join('\n');

      return csvHeader + csvData;
    } catch (error) {
      console.error('❌ Error exporting customers:', error);
      return 'Error exporting customer data';
    }
  }

  // Store locally as backup
  private storeLocallyAsBackup(customerData: CustomerProfile): void {
    try {
      const existingData = JSON.parse(localStorage.getItem('permanent_customers') || '[]');
      const existingIndex = existingData.findIndex((c: CustomerProfile) => c.email === customerData.email);
      
      if (existingIndex >= 0) {
        existingData[existingIndex] = { ...existingData[existingIndex], ...customerData };
      } else {
        existingData.push(customerData);
      }
      
      localStorage.setItem('permanent_customers', JSON.stringify(existingData));
      console.log('💾 Customer data backed up locally');
    } catch (error) {
      console.error('❌ Error storing local backup:', error);
    }
  }

  // Get local customers as fallback
  private getLocalCustomers(): CustomerProfile[] {
    try {
      return JSON.parse(localStorage.getItem('permanent_customers') || '[]');
    } catch (error) {
      console.error('❌ Error getting local customers:', error);
      return [];
    }
  }

  // Get client IP address
  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'Unknown';
    }
  }

  // Get device information
  private getDeviceInfo(): string {
    const userAgent = navigator.userAgent;
    let device = 'Unknown';
    
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      device = 'Mobile';
    } else if (/Tablet/.test(userAgent)) {
      device = 'Tablet';
    } else {
      device = 'Desktop';
    }
    
    return device;
  }

  // Update customer order information
  async updateCustomerOrderInfo(email: string, orderAmount: number): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('customer_profiles')
        .select('total_orders, total_spent')
        .eq('email', email)
        .single();

      if (!error && data) {
        await supabase
          .from('customer_profiles')
          .update({
            total_orders: (data.total_orders || 0) + 1,
            total_spent: (data.total_spent || 0) + orderAmount,
            updated_at: new Date().toISOString()
          })
          .eq('email', email);
      }
    } catch (error) {
      console.error('❌ Error updating customer order info:', error);
    }
  }

  // Get customers by criteria for targeted marketing
  async getCustomersForTargetedMarketing(criteria: {
    minOrders?: number;
    minSpent?: number;
    signupAfter?: string;
    lastLoginAfter?: string;
    categories?: string[];
  }): Promise<CustomerProfile[]> {
    try {
      let query = supabase
        .from('customer_profiles')
        .select('*')
        .eq('marketing_consent', true)
        .eq('status', 'active');

      if (criteria.minOrders) {
        query = query.gte('total_orders', criteria.minOrders);
      }
      
      if (criteria.minSpent) {
        query = query.gte('total_spent', criteria.minSpent);
      }
      
      if (criteria.signupAfter) {
        query = query.gte('signup_date', criteria.signupAfter);
      }
      
      if (criteria.lastLoginAfter) {
        query = query.gte('last_login_at', criteria.lastLoginAfter);
      }

      const { data, error } = await query.order('last_login_at', { ascending: false });

      if (error) {
        console.error('❌ Failed to fetch targeted customers:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Error getting targeted customers:', error);
      return [];
    }
  }
}

export const permanentCustomerService = new PermanentCustomerService();
export default permanentCustomerService;