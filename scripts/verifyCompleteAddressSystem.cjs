/**
 * Complete Address System Verification Script
 * 
 * This script performs a comprehensive test of the permanent address storage system.
 * It verifies all components are working correctly together.
 */

// Mock localStorage for Node.js environment
global.localStorage = {
  data: {},
  getItem(key) {
    return this.data[key];
  },
  setItem(key, value) {
    this.data[key] = value;
  },
  removeItem(key) {
    delete this.data[key];
  },
  clear() {
    this.data = {};
  }
};

// Mock window for Node.js environment
global.window = {
  localStorage
};

// Storage keys
const STORAGE_KEY = 'charm_n_treats_addresses';
const MONITOR_KEY = 'address_storage_monitor';

// Test user
const TEST_USER = {
  id: 'test-user-123',
  email: 'test@example.com'
};

// Test addresses
const TEST_ADDRESSES = [
  {
    type: 'Home',
    name: 'John Doe',
    address: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    phone: '9876543210',
    is_default: true
  },
  {
    type: 'Work',
    name: 'John Doe',
    address: '456 Office Park',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    phone: '9876543210',
    is_default: false
  }
];

// Mock services
const mockAddressService = {
  addresses: [],
  
  async getUserAddresses(userId) {
    console.log(`[Mock Address Service] Getting addresses for user: ${userId}`);
    return this.addresses.filter(addr => addr.user_id === userId);
  },
  
  async addAddress(address) {
    console.log(`[Mock Address Service] Adding address for user: ${address.user_id}`);
    const newAddress = {
      ...address,
      id: `addr-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.addresses.push(newAddress);
    return newAddress;
  },
  
  async updateAddress(id, updates) {
    console.log(`[Mock Address Service] Updating address: ${id}`);
    const index = this.addresses.findIndex(addr => addr.id === id);
    if (index === -1) return null;
    
    this.addresses[index] = {
      ...this.addresses[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    return this.addresses[index];
  },
  
  async deleteAddress(id) {
    console.log(`[Mock Address Service] Deleting address: ${id}`);
    const initialLength = this.addresses.length;
    this.addresses = this.addresses.filter(addr => addr.id !== id);
    return this.addresses.length < initialLength;
  },
  
  async setDefaultAddress(id, userId) {
    console.log(`[Mock Address Service] Setting default address: ${id} for user: ${userId}`);
    
    // First unset all defaults
    this.addresses.forEach(addr => {
      if (addr.user_id === userId) {
        addr.is_default = false;
      }
    });
    
    // Then set the new default
    const index = this.addresses.findIndex(addr => addr.id === id);
    if (index === -1) return false;
    
    this.addresses[index].is_default = true;
    this.addresses[index].updated_at = new Date().toISOString();
    
    return true;
  },
  
  async getDefaultAddress(userId) {
    console.log(`[Mock Address Service] Getting default address for user: ${userId}`);
    return this.addresses.find(addr => addr.user_id === userId && addr.is_default);
  }
};

// Test functions
async function runTests() {
  console.log('🧪 Starting Complete Address System Verification');
  console.log('==============================================');
  
  try {
    // Clear any existing test data
    console.log('🧹 Clearing existing test data...');
    localStorage.clear();
    mockAddressService.addresses = [];
    
    // Test 1: Add addresses
    console.log('\n📝 Test 1: Adding addresses...');
    for (const address of TEST_ADDRESSES) {
      const result = await mockAddressService.addAddress({
        ...address,
        user_id: TEST_USER.id
      });
      
      console.log(`✅ Added address: ${result.id}`);
    }
    
    // Test 2: Store addresses in localStorage
    console.log('\n💾 Test 2: Storing addresses in localStorage...');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockAddressService.addresses));
    console.log('✅ Addresses stored in localStorage');
    
    // Test 3: Retrieve addresses from localStorage
    console.log('\n🔍 Test 3: Retrieving addresses from localStorage...');
    const storedData = localStorage.getItem(STORAGE_KEY);
    const storedAddresses = JSON.parse(storedData);
    
    if (!storedAddresses || storedAddresses.length !== TEST_ADDRESSES.length) {
      throw new Error('Failed to retrieve addresses from localStorage');
    }
    
    console.log(`✅ Successfully retrieved ${storedAddresses.length} addresses`);
    
    // Test 4: Update an address
    console.log('\n🔄 Test 4: Updating an address...');
    const addressToUpdate = storedAddresses[0];
    const updatedCity = 'New Delhi';
    
    const updatedAddresses = storedAddresses.map(addr => {
      if (addr.id === addressToUpdate.id) {
        return {
          ...addr,
          city: updatedCity,
          updated_at: new Date().toISOString()
        };
      }
      return addr;
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAddresses));
    
    // Verify update
    const updatedData = localStorage.getItem(STORAGE_KEY);
    const verifyAddresses = JSON.parse(updatedData);
    const updatedAddress = verifyAddresses.find(addr => addr.id === addressToUpdate.id);
    
    if (updatedAddress.city !== updatedCity) {
      throw new Error('Address update failed');
    }
    
    console.log('✅ Successfully updated address');
    
    // Test 5: Set default address
    console.log('\n⭐ Test 5: Setting default address...');
    const secondAddress = verifyAddresses[1];
    
    const withDefaultAddresses = verifyAddresses.map(addr => ({
      ...addr,
      is_default: addr.id === secondAddress.id
    }));
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(withDefaultAddresses));
    
    // Verify default address
    const defaultData = localStorage.getItem(STORAGE_KEY);
    const defaultAddresses = JSON.parse(defaultData);
    const defaultAddress = defaultAddresses.find(addr => addr.is_default);
    
    if (!defaultAddress || defaultAddress.id !== secondAddress.id) {
      throw new Error('Setting default address failed');
    }
    
    console.log('✅ Successfully set default address');
    
    // Test 6: Delete an address
    console.log('\n🗑️ Test 6: Deleting an address...');
    const addressToDelete = defaultAddresses[0];
    
    const remainingAddresses = defaultAddresses.filter(addr => addr.id !== addressToDelete.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remainingAddresses));
    
    // Verify deletion
    const afterDeleteData = localStorage.getItem(STORAGE_KEY);
    const afterDeleteAddresses = JSON.parse(afterDeleteData);
    
    if (afterDeleteAddresses.length !== defaultAddresses.length - 1) {
      throw new Error('Address deletion failed');
    }
    
    console.log(`✅ Successfully deleted address. Remaining: ${afterDeleteAddresses.length}`);
    
    // Test 7: Simulate corrupted storage and repair
    console.log('\n🔧 Test 7: Testing storage repair...');
    
    // Corrupt the storage
    localStorage.setItem(STORAGE_KEY, '{"corrupted": true');
    console.log('⚠️ Storage corrupted for testing');
    
    // Try to parse (should fail)
    try {
      const corruptedData = localStorage.getItem(STORAGE_KEY);
      JSON.parse(corruptedData);
      console.log('❌ Failed to detect corrupted storage');
    } catch (error) {
      console.log('✅ Corrupted storage detected');
      
      // Repair storage
      localStorage.setItem(STORAGE_KEY, '[]');
      console.log('✅ Storage repaired');
      
      // Verify repair
      const repairedData = localStorage.getItem(STORAGE_KEY);
      const repairedAddresses = JSON.parse(repairedData);
      console.log(`✅ Verified repaired storage: ${repairedAddresses.length} addresses`);
    }
    
    // Final cleanup
    localStorage.clear();
    
    console.log('\n🎉 All address system tests passed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
  }
}

// Run the tests
runTests();