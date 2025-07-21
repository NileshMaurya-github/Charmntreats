import { v4 as uuidv4 } from 'uuid';
import { permanentStorageService } from './permanentStorageService';
import { addressStorageMonitor } from '@/utils/addressStorageMonitor';

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

const STORAGE_KEY = 'charm_n_treats_addresses';

/**
 * PermanentAddressService - A service for storing addresses permanently in localStorage
 * This ensures address data persistence across sessions and works on the live website
 */
class PermanentAddressService {
  async getUserAddresses(userId: string): Promise<Address[]> {
    try {
      console.log('🔍 Fetching addresses for user from permanent storage:', userId);
      
      // Check storage health before proceeding
      const health = addressStorageMonitor.checkStorageHealth();
      if (health.status === 'corrupted') {
        console.warn('⚠️ Address storage is corrupted, attempting repair...');
        addressStorageMonitor.repairStorage();
      }
      
      const allAddresses = permanentStorageService.retrieve<Address[]>(STORAGE_KEY) || [];
      const userAddresses = allAddresses.filter(addr => addr.user_id === userId);
      
      // Sort by is_default (true first) and then by updated_at (newest first)
      userAddresses.sort((a, b) => {
        if (a.is_default !== b.is_default) {
          return a.is_default ? -1 : 1;
        }
        
        const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
        const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
        return dateB - dateA;
      });
      
      console.log(`✅ Found ${userAddresses.length} addresses in permanent storage for user ${userId}`);
      addressStorageMonitor.addLog('read', 'success', `Retrieved ${userAddresses.length} addresses for user ${userId}`, userAddresses.length);
      return userAddresses;
    } catch (error) {
      console.error('❌ Error in getUserAddresses:', error);
      addressStorageMonitor.addLog('read', 'failure', `Error: ${error}`);
      return [];
    }
  }

  async addAddress(address: Omit<Address, 'id' | 'created_at' | 'updated_at'>): Promise<Address | null> {
    try {
      console.log('📝 Adding new address to permanent storage for user:', address.user_id);
      
      // Check storage health before proceeding
      const health = addressStorageMonitor.checkStorageHealth();
      if (health.status === 'corrupted') {
        console.warn('⚠️ Address storage is corrupted, attempting repair...');
        addressStorageMonitor.repairStorage();
      }
      
      // If this is set as default, unset other defaults first
      if (address.is_default) {
        await this.unsetDefaultAddresses(address.user_id);
      }

      const allAddresses = permanentStorageService.retrieve<Address[]>(STORAGE_KEY) || [];
      
      const now = new Date().toISOString();
      const newAddress: Address = {
        ...address,
        id: uuidv4(),
        created_at: now,
        updated_at: now
      };
      
      allAddresses.push(newAddress);
      const success = permanentStorageService.store(STORAGE_KEY, allAddresses);
      
      if (success) {
        console.log('✅ Address added successfully to permanent storage with ID:', newAddress.id);
        addressStorageMonitor.addLog('write', 'success', `Added address ${newAddress.id} for user ${address.user_id}`);
        return newAddress;
      } else {
        throw new Error('Failed to store address in permanent storage');
      }
    } catch (error) {
      console.error('❌ Error in addAddress:', error);
      addressStorageMonitor.addLog('write', 'failure', `Error: ${error}`);
      return null;
    }
  }

  async updateAddress(id: string, updates: Partial<Address>): Promise<Address | null> {
    try {
      console.log('🔄 Updating address in permanent storage:', id);
      
      // If this is set as default, unset other defaults first
      if (updates.is_default && updates.user_id) {
        await this.unsetDefaultAddresses(updates.user_id);
      }

      const allAddresses = permanentStorageService.retrieve<Address[]>(STORAGE_KEY) || [];
      const addressIndex = allAddresses.findIndex(addr => addr.id === id);
      
      if (addressIndex === -1) {
        console.error('❌ Address not found in permanent storage:', id);
        return null;
      }
      
      const updatedAddress: Address = {
        ...allAddresses[addressIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      allAddresses[addressIndex] = updatedAddress;
      permanentStorageService.store(STORAGE_KEY, allAddresses);
      
      console.log('✅ Address updated successfully in permanent storage:', updatedAddress.id);
      return updatedAddress;
    } catch (error) {
      console.error('❌ Error in updateAddress:', error);
      return null;
    }
  }

  async deleteAddress(id: string): Promise<boolean> {
    try {
      console.log('🗑️ Deleting address from permanent storage:', id);
      
      const allAddresses = permanentStorageService.retrieve<Address[]>(STORAGE_KEY) || [];
      const filteredAddresses = allAddresses.filter(addr => addr.id !== id);
      
      if (filteredAddresses.length === allAddresses.length) {
        console.error('❌ Address not found in permanent storage:', id);
        return false;
      }
      
      permanentStorageService.store(STORAGE_KEY, filteredAddresses);
      
      console.log('✅ Address deleted successfully from permanent storage');
      return true;
    } catch (error) {
      console.error('❌ Error in deleteAddress:', error);
      return false;
    }
  }

  async setDefaultAddress(id: string, userId: string): Promise<boolean> {
    try {
      console.log('🔄 Setting address as default in permanent storage:', id);
      
      // First unset all defaults for this user
      await this.unsetDefaultAddresses(userId);

      const allAddresses = permanentStorageService.retrieve<Address[]>(STORAGE_KEY) || [];
      const addressIndex = allAddresses.findIndex(addr => addr.id === id);
      
      if (addressIndex === -1) {
        console.error('❌ Address not found in permanent storage:', id);
        return false;
      }
      
      allAddresses[addressIndex] = {
        ...allAddresses[addressIndex],
        is_default: true,
        updated_at: new Date().toISOString()
      };
      
      permanentStorageService.store(STORAGE_KEY, allAddresses);
      
      console.log('✅ Default address set successfully in permanent storage');
      return true;
    } catch (error) {
      console.error('❌ Error in setDefaultAddress:', error);
      return false;
    }
  }

  private async unsetDefaultAddresses(userId: string): Promise<void> {
    try {
      console.log('🔄 Unsetting default addresses in permanent storage for user:', userId);
      
      const allAddresses = permanentStorageService.retrieve<Address[]>(STORAGE_KEY) || [];
      
      const updatedAddresses = allAddresses.map(addr => {
        if (addr.user_id === userId && addr.is_default) {
          return { ...addr, is_default: false, updated_at: new Date().toISOString() };
        }
        return addr;
      });
      
      permanentStorageService.store(STORAGE_KEY, updatedAddresses);
      
      console.log('✅ Default addresses unset successfully in permanent storage');
    } catch (error) {
      console.error('❌ Error in unsetDefaultAddresses:', error);
    }
  }

  async getDefaultAddress(userId: string): Promise<Address | null> {
    try {
      console.log('🔍 Fetching default address from permanent storage for user:', userId);
      
      const allAddresses = permanentStorageService.retrieve<Address[]>(STORAGE_KEY) || [];
      const defaultAddress = allAddresses.find(addr => addr.user_id === userId && addr.is_default);
      
      if (!defaultAddress) {
        console.log('⚠️ No default address found in permanent storage');
        return null;
      }
      
      console.log('✅ Default address found in permanent storage:', defaultAddress.id);
      return defaultAddress;
    } catch (error) {
      console.error('❌ Error in getDefaultAddress:', error);
      return null;
    }
  }

  // Import addresses from another storage source
  async importAddresses(addresses: Address[]): Promise<boolean> {
    try {
      console.log('📥 Importing addresses to permanent storage');
      
      const existingAddresses = permanentStorageService.retrieve<Address[]>(STORAGE_KEY) || [];
      
      // Merge addresses, avoiding duplicates by ID
      const mergedAddresses = [...existingAddresses];
      
      for (const address of addresses) {
        if (!address.id) continue;
        
        const existingIndex = mergedAddresses.findIndex(a => a.id === address.id);
        if (existingIndex >= 0) {
          // Update existing address
          mergedAddresses[existingIndex] = {
            ...address,
            updated_at: new Date().toISOString()
          };
        } else {
          // Add new address
          mergedAddresses.push({
            ...address,
            updated_at: new Date().toISOString()
          });
        }
      }
      
      permanentStorageService.store(STORAGE_KEY, mergedAddresses);
      
      console.log(`✅ Successfully imported ${addresses.length} addresses to permanent storage`);
      return true;
    } catch (error) {
      console.error('❌ Error importing addresses:', error);
      return false;
    }
  }
}

const permanentAddressService = new PermanentAddressService();

// Expose to window for debugging and migration scripts
if (typeof window !== 'undefined') {
  (window as any).permanentAddressService = permanentAddressService;
}

export default permanentAddressService;