import { v4 as uuidv4 } from 'uuid';

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
 * LocalStorage implementation of address service for offline/fallback usage
 */
class LocalStorageAddressService {
  private getAddressesFromStorage(): Address[] {
    try {
      const storedAddresses = localStorage.getItem(STORAGE_KEY);
      return storedAddresses ? JSON.parse(storedAddresses) : [];
    } catch (error) {
      console.error('❌ Error reading addresses from localStorage:', error);
      return [];
    }
  }

  private saveAddressesToStorage(addresses: Address[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
    } catch (error) {
      console.error('❌ Error saving addresses to localStorage:', error);
    }
  }

  async getUserAddresses(userId: string): Promise<Address[]> {
    try {
      console.log('🔍 Fetching addresses for user from localStorage:', userId);
      
      const allAddresses = this.getAddressesFromStorage();
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
      
      console.log(`✅ Found ${userAddresses.length} addresses in localStorage for user ${userId}`);
      return userAddresses;
    } catch (error) {
      console.error('❌ Error in getUserAddresses:', error);
      return [];
    }
  }

  async addAddress(address: Omit<Address, 'id' | 'created_at' | 'updated_at'>): Promise<Address | null> {
    try {
      console.log('📝 Adding new address to localStorage for user:', address.user_id);
      
      // If this is set as default, unset other defaults first
      if (address.is_default) {
        await this.unsetDefaultAddresses(address.user_id);
      }

      const allAddresses = this.getAddressesFromStorage();
      
      const now = new Date().toISOString();
      const newAddress: Address = {
        ...address,
        id: uuidv4(),
        created_at: now,
        updated_at: now
      };
      
      allAddresses.push(newAddress);
      this.saveAddressesToStorage(allAddresses);
      
      console.log('✅ Address added successfully to localStorage with ID:', newAddress.id);
      return newAddress;
    } catch (error) {
      console.error('❌ Error in addAddress:', error);
      return null;
    }
  }

  async updateAddress(id: string, updates: Partial<Address>): Promise<Address | null> {
    try {
      console.log('🔄 Updating address in localStorage:', id);
      
      // If this is set as default, unset other defaults first
      if (updates.is_default && updates.user_id) {
        await this.unsetDefaultAddresses(updates.user_id);
      }

      const allAddresses = this.getAddressesFromStorage();
      const addressIndex = allAddresses.findIndex(addr => addr.id === id);
      
      if (addressIndex === -1) {
        console.error('❌ Address not found in localStorage:', id);
        return null;
      }
      
      const updatedAddress: Address = {
        ...allAddresses[addressIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      allAddresses[addressIndex] = updatedAddress;
      this.saveAddressesToStorage(allAddresses);
      
      console.log('✅ Address updated successfully in localStorage:', updatedAddress.id);
      return updatedAddress;
    } catch (error) {
      console.error('❌ Error in updateAddress:', error);
      return null;
    }
  }

  async deleteAddress(id: string): Promise<boolean> {
    try {
      console.log('🗑️ Deleting address from localStorage:', id);
      
      const allAddresses = this.getAddressesFromStorage();
      const filteredAddresses = allAddresses.filter(addr => addr.id !== id);
      
      if (filteredAddresses.length === allAddresses.length) {
        console.error('❌ Address not found in localStorage:', id);
        return false;
      }
      
      this.saveAddressesToStorage(filteredAddresses);
      
      console.log('✅ Address deleted successfully from localStorage');
      return true;
    } catch (error) {
      console.error('❌ Error in deleteAddress:', error);
      return false;
    }
  }

  async setDefaultAddress(id: string, userId: string): Promise<boolean> {
    try {
      console.log('🔄 Setting address as default in localStorage:', id);
      
      // First unset all defaults for this user
      await this.unsetDefaultAddresses(userId);

      const allAddresses = this.getAddressesFromStorage();
      const addressIndex = allAddresses.findIndex(addr => addr.id === id);
      
      if (addressIndex === -1) {
        console.error('❌ Address not found in localStorage:', id);
        return false;
      }
      
      allAddresses[addressIndex] = {
        ...allAddresses[addressIndex],
        is_default: true,
        updated_at: new Date().toISOString()
      };
      
      this.saveAddressesToStorage(allAddresses);
      
      console.log('✅ Default address set successfully in localStorage');
      return true;
    } catch (error) {
      console.error('❌ Error in setDefaultAddress:', error);
      return false;
    }
  }

  private async unsetDefaultAddresses(userId: string): Promise<void> {
    try {
      console.log('🔄 Unsetting default addresses in localStorage for user:', userId);
      
      const allAddresses = this.getAddressesFromStorage();
      
      const updatedAddresses = allAddresses.map(addr => {
        if (addr.user_id === userId && addr.is_default) {
          return { ...addr, is_default: false };
        }
        return addr;
      });
      
      this.saveAddressesToStorage(updatedAddresses);
      
      console.log('✅ Default addresses unset successfully in localStorage');
    } catch (error) {
      console.error('❌ Error in unsetDefaultAddresses:', error);
    }
  }

  async getDefaultAddress(userId: string): Promise<Address | null> {
    try {
      console.log('🔍 Fetching default address from localStorage for user:', userId);
      
      const allAddresses = this.getAddressesFromStorage();
      const defaultAddress = allAddresses.find(addr => addr.user_id === userId && addr.is_default);
      
      if (!defaultAddress) {
        console.log('⚠️ No default address found in localStorage');
        return null;
      }
      
      console.log('✅ Default address found in localStorage:', defaultAddress.id);
      return defaultAddress;
    } catch (error) {
      console.error('❌ Error in getDefaultAddress:', error);
      return null;
    }
  }
}

export default new LocalStorageAddressService();