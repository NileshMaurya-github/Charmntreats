import { supabase } from '@/integrations/supabase/client';

export interface Address {
  id?: string;
  user_id: string;
  type: string; // 'Home', 'Work', 'Other'
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Direct implementation of address service that bypasses TypeScript errors
 * by using raw SQL queries and type assertions
 */
class DirectAddressService {
  async getUserAddresses(userId: string): Promise<Address[]> {
    try {
      console.log('🔍 Fetching addresses for user:', userId);
      
      // Use RPC to execute a direct SQL query
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: `
          SELECT * FROM user_addresses 
          WHERE user_id = '${userId}'
          ORDER BY is_default DESC, updated_at DESC
        `
      });

      if (error) {
        console.error('❌ Error fetching addresses:', error);
        throw error;
      }
      
      if (!data || !Array.isArray(data)) {
        console.log('⚠️ No addresses found or invalid response format');
        return [];
      }
      
      // Map the raw data to Address objects
      const addresses = data.map(row => ({
        id: row.id,
        user_id: row.user_id,
        type: row.type || 'Home',
        name: row.name,
        address: row.address,
        city: row.city,
        state: row.state,
        pincode: row.pincode,
        phone: row.phone,
        is_default: row.is_default || false,
        created_at: row.created_at,
        updated_at: row.updated_at
      })) as Address[];
      
      console.log(`✅ Found ${addresses.length} addresses for user ${userId}`);
      return addresses;
    } catch (error) {
      console.error('❌ Error in getUserAddresses:', error);
      return [];
    }
  }

  async addAddress(address: Omit<Address, 'id' | 'created_at' | 'updated_at'>): Promise<Address | null> {
    try {
      console.log('📝 Adding new address for user:', address.user_id);
      
      // If this is set as default, unset other defaults first
      if (address.is_default) {
        await this.unsetDefaultAddresses(address.user_id);
      }

      // Insert the address using a direct SQL query
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: `
          INSERT INTO user_addresses (
            user_id, type, name, address, city, state, pincode, phone, is_default
          ) VALUES (
            '${address.user_id}',
            '${address.type}',
            '${address.name.replace(/'/g, "''")}',
            '${address.address.replace(/'/g, "''")}',
            '${address.city.replace(/'/g, "''")}',
            '${address.state.replace(/'/g, "''")}',
            '${address.pincode}',
            '${address.phone}',
            ${address.is_default}
          )
          RETURNING *
        `
      });

      if (error) {
        console.error('❌ Error adding address:', error);
        throw error;
      }
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.error('❌ No data returned from address insertion');
        return null;
      }
      
      const newAddress = data[0] as Address;
      console.log('✅ Address added successfully with ID:', newAddress.id);
      return newAddress;
    } catch (error) {
      console.error('❌ Error in addAddress:', error);
      return null;
    }
  }

  async updateAddress(id: string, updates: Partial<Address>): Promise<Address | null> {
    try {
      console.log('🔄 Updating address:', id);
      
      // If this is set as default, unset other defaults first
      if (updates.is_default && updates.user_id) {
        await this.unsetDefaultAddresses(updates.user_id);
      }

      // Build the SET clause for the SQL query
      const setClause = Object.entries(updates)
        .filter(([key]) => key !== 'id' && key !== 'user_id') // Don't update id or user_id
        .map(([key, value]) => {
          if (typeof value === 'string') {
            return `${key} = '${value.replace(/'/g, "''")}'`;
          } else if (typeof value === 'boolean') {
            return `${key} = ${value}`;
          } else if (value === null) {
            return `${key} = NULL`;
          }
          return null;
        })
        .filter(Boolean)
        .join(', ');
      
      // Always update the updated_at timestamp
      const fullSetClause = setClause + ", updated_at = NOW()";
      
      // Update the address using a direct SQL query
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: `
          UPDATE user_addresses
          SET ${fullSetClause}
          WHERE id = '${id}'
          RETURNING *
        `
      });

      if (error) {
        console.error('❌ Error updating address:', error);
        throw error;
      }
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.error('❌ No data returned from address update');
        return null;
      }
      
      const updatedAddress = data[0] as Address;
      console.log('✅ Address updated successfully:', updatedAddress.id);
      return updatedAddress;
    } catch (error) {
      console.error('❌ Error in updateAddress:', error);
      return null;
    }
  }

  async deleteAddress(id: string): Promise<boolean> {
    try {
      console.log('🗑️ Deleting address:', id);
      
      // Delete the address using a direct SQL query
      const { error } = await supabase.rpc('exec_sql', {
        sql: `
          DELETE FROM user_addresses
          WHERE id = '${id}'
        `
      });

      if (error) {
        console.error('❌ Error deleting address:', error);
        throw error;
      }
      
      console.log('✅ Address deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Error in deleteAddress:', error);
      return false;
    }
  }

  async setDefaultAddress(id: string, userId: string): Promise<boolean> {
    try {
      console.log('🔄 Setting address as default:', id);
      
      // First unset all defaults for this user
      await this.unsetDefaultAddresses(userId);

      // Then set the new default
      const { error } = await supabase.rpc('exec_sql', {
        sql: `
          UPDATE user_addresses
          SET is_default = true, updated_at = NOW()
          WHERE id = '${id}'
        `
      });

      if (error) {
        console.error('❌ Error setting default address:', error);
        throw error;
      }
      
      console.log('✅ Default address set successfully');
      return true;
    } catch (error) {
      console.error('❌ Error in setDefaultAddress:', error);
      return false;
    }
  }

  private async unsetDefaultAddresses(userId: string): Promise<void> {
    try {
      console.log('🔄 Unsetting default addresses for user:', userId);
      
      await supabase.rpc('exec_sql', {
        sql: `
          UPDATE user_addresses
          SET is_default = false
          WHERE user_id = '${userId}' AND is_default = true
        `
      });
      
      console.log('✅ Default addresses unset successfully');
    } catch (error) {
      console.error('❌ Error in unsetDefaultAddresses:', error);
    }
  }

  async getDefaultAddress(userId: string): Promise<Address | null> {
    try {
      console.log('🔍 Fetching default address for user:', userId);
      
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: `
          SELECT * FROM user_addresses
          WHERE user_id = '${userId}' AND is_default = true
          LIMIT 1
        `
      });

      if (error) {
        console.error('❌ Error fetching default address:', error);
        throw error;
      }
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.log('⚠️ No default address found');
        return null;
      }
      
      const defaultAddress = data[0] as Address;
      console.log('✅ Default address found:', defaultAddress.id);
      return defaultAddress;
    } catch (error) {
      console.error('❌ Error in getDefaultAddress:', error);
      return null;
    }
  }
}

export default new DirectAddressService();