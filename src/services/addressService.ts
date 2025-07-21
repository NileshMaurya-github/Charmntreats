import { supabase } from '@/integrations/supabase/client';
import localStorageAddressService from './localStorageAddressService';
import directAddressService from './directAddressService';
import permanentAddressService from './permanentAddressService';

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

// Flag to track if we should use permanent storage
// We're setting this to true by default to ensure permanent storage
let usePermanentStorage = true;

class AddressService {
  // Method to check if we should use permanent storage
  private shouldUsePermanentStorage(): boolean {
    return usePermanentStorage;
  }
  
  // Method to set permanent storage mode
  setPermanentStorageMode(usePermanent: boolean): void {
    usePermanentStorage = usePermanent;
    console.log(`🔄 Address service permanent storage mode ${usePermanent ? 'enabled' : 'disabled'}`);
  }
  async getUserAddresses(userId: string): Promise<Address[]> {
    // If using permanent storage, use that implementation
    if (this.shouldUsePermanentStorage()) {
      console.log('🔄 Using permanent storage for getUserAddresses');
      return permanentAddressService.getUserAddresses(userId);
    }
    
    try {
      // Try to get addresses from Supabase
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching addresses from Supabase:', error);
        console.log('🔄 Trying direct SQL approach...');
        
        // Try direct SQL approach
        const directResult = await directAddressService.getUserAddresses(userId);
        if (directResult.length > 0) {
          // Import these addresses to permanent storage for future use
          await permanentAddressService.importAddresses(directResult);
          return directResult;
        }
        
        // If direct approach fails, switch to permanent storage
        this.setPermanentStorageMode(true);
        return permanentAddressService.getUserAddresses(userId);
      }
      
      if (data && data.length > 0) {
        // Import these addresses to permanent storage for future use
        await permanentAddressService.importAddresses(data as Address[]);
        return data as Address[];
      }
      
      // If no data from Supabase, try permanent storage
      console.log('No addresses found in Supabase, checking permanent storage');
      const permanentAddresses = await permanentAddressService.getUserAddresses(userId);
      if (permanentAddresses.length > 0) {
        return permanentAddresses;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching addresses:', error);
      
      // Switch to permanent storage
      this.setPermanentStorageMode(true);
      return permanentAddressService.getUserAddresses(userId);
    }
  }

  async addAddress(address: Omit<Address, 'id' | 'created_at' | 'updated_at'>): Promise<Address | null> {
    // If using permanent storage, use that implementation
    if (this.shouldUsePermanentStorage()) {
      console.log('🔄 Using permanent storage for addAddress');
      return permanentAddressService.addAddress(address);
    }
    
    try {
      // If this is set as default, unset other defaults first
      if (address.is_default) {
        await this.unsetDefaultAddresses(address.user_id);
      }

      const { data, error } = await supabase
        .from('user_addresses')
        .insert([address])
        .select()
        .single();

      if (error) {
        console.error('Error adding address to Supabase:', error);
        // Fall back to permanent storage
        this.setPermanentStorageMode(true);
        return permanentAddressService.addAddress(address);
      }
      
      // Also save to permanent storage for redundancy
      const addressData = data as Address;
      await permanentAddressService.addAddress(address);
      
      return addressData;
    } catch (error) {
      console.error('Error adding address:', error);
      // Fall back to permanent storage
      this.setPermanentStorageMode(true);
      return permanentAddressService.addAddress(address);
    }
  }

  async updateAddress(id: string, updates: Partial<Address>): Promise<Address | null> {
    // If using permanent storage, use that implementation
    if (this.shouldUsePermanentStorage()) {
      console.log('🔄 Using permanent storage for updateAddress');
      return permanentAddressService.updateAddress(id, updates);
    }
    
    try {
      // If this is set as default, unset other defaults first
      if (updates.is_default && updates.user_id) {
        await this.unsetDefaultAddresses(updates.user_id);
      }

      const { data, error } = await supabase
        .from('user_addresses')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating address in Supabase:', error);
        // Fall back to permanent storage
        this.setPermanentStorageMode(true);
        return permanentAddressService.updateAddress(id, updates);
      }
      
      // Also update in permanent storage for redundancy
      const addressData = data as Address;
      await permanentAddressService.updateAddress(id, updates);
      
      return addressData;
    } catch (error) {
      console.error('Error updating address:', error);
      // Fall back to permanent storage
      this.setPermanentStorageMode(true);
      return permanentAddressService.updateAddress(id, updates);
    }
  }

  async deleteAddress(id: string): Promise<boolean> {
    // If using permanent storage, use that implementation
    if (this.shouldUsePermanentStorage()) {
      console.log('🔄 Using permanent storage for deleteAddress');
      return permanentAddressService.deleteAddress(id);
    }
    
    try {
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting address from Supabase:', error);
        // Fall back to permanent storage
        this.setPermanentStorageMode(true);
        return permanentAddressService.deleteAddress(id);
      }
      
      // Also delete from permanent storage for consistency
      await permanentAddressService.deleteAddress(id);
      
      return true;
    } catch (error) {
      console.error('Error deleting address:', error);
      // Fall back to permanent storage
      this.setPermanentStorageMode(true);
      return permanentAddressService.deleteAddress(id);
    }
  }

  async setDefaultAddress(id: string, userId: string): Promise<boolean> {
    // If using permanent storage, use that implementation
    if (this.shouldUsePermanentStorage()) {
      console.log('🔄 Using permanent storage for setDefaultAddress');
      return permanentAddressService.setDefaultAddress(id, userId);
    }
    
    try {
      // First unset all defaults for this user
      await this.unsetDefaultAddresses(userId);

      // Then set the new default
      const { error } = await supabase
        .from('user_addresses')
        .update({ is_default: true, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error setting default address in Supabase:', error);
        // Fall back to permanent storage
        this.setPermanentStorageMode(true);
        return permanentAddressService.setDefaultAddress(id, userId);
      }
      
      // Also update in permanent storage for consistency
      await permanentAddressService.setDefaultAddress(id, userId);
      
      return true;
    } catch (error) {
      console.error('Error setting default address:', error);
      // Fall back to permanent storage
      this.setPermanentStorageMode(true);
      return permanentAddressService.setDefaultAddress(id, userId);
    }
  }

  private async unsetDefaultAddresses(userId: string): Promise<void> {
    // If using permanent storage, use that implementation
    if (this.shouldUsePermanentStorage()) {
      console.log('🔄 Using permanent storage for unsetDefaultAddresses');
      await permanentAddressService['unsetDefaultAddresses'](userId);
      return;
    }
    
    try {
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', userId)
        .eq('is_default', true);
        
      // Also update in permanent storage for consistency
      await permanentAddressService['unsetDefaultAddresses'](userId);
    } catch (error) {
      console.error('Error unsetting default addresses:', error);
      // Fall back to permanent storage
      this.setPermanentStorageMode(true);
      await permanentAddressService['unsetDefaultAddresses'](userId);
    }
  }

  async getDefaultAddress(userId: string): Promise<Address | null> {
    // If using permanent storage, use that implementation
    if (this.shouldUsePermanentStorage()) {
      console.log('🔄 Using permanent storage for getDefaultAddress');
      return permanentAddressService.getDefaultAddress(userId);
    }
    
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', userId)
        .eq('is_default', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching default address from Supabase:', error);
        // Fall back to permanent storage
        this.setPermanentStorageMode(true);
        return permanentAddressService.getDefaultAddress(userId);
      }
      
      if (data) {
        // Also ensure it's in permanent storage
        const addresses = await permanentAddressService.getUserAddresses(userId);
        if (!addresses.some(addr => addr.id === data.id)) {
          await permanentAddressService.importAddresses([data as Address]);
        }
        return data as Address;
      }
      
      // If not found in Supabase, check permanent storage
      return permanentAddressService.getDefaultAddress(userId);
    } catch (error) {
      console.error('Error fetching default address:', error);
      // Fall back to permanent storage
      this.setPermanentStorageMode(true);
      return permanentAddressService.getDefaultAddress(userId);
    }
  }
}

const addressService = new AddressService();

// Expose to window for debugging and migration scripts
if (typeof window !== 'undefined') {
  (window as any).addressService = addressService;
}

export default addressService;