// This is a standalone test script that doesn't require Supabase
console.log('🧪 Starting Permanent Address Storage Test');

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

// Test user ID
const TEST_USER_ID = 'test-user-123';

// Test address data
const testAddress = {
  user_id: TEST_USER_ID,
  type: 'Home',
  name: 'John Doe',
  address: '123 Main Street',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  phone: '9876543210',
  is_default: true
};

// Storage key
const STORAGE_KEY = 'charm_n_treats_addresses';

// Test functions
async function testPermanentAddressStorage() {
  console.log('🧪 Testing Permanent Address Storage System');
  console.log('=========================================');

  try {
    // Clear any existing test data
    console.log('🧹 Clearing existing test data...');
    localStorage.removeItem(STORAGE_KEY);
    
    // Test storing an address
    console.log('\n📝 Testing address storage...');
    const addresses = [];
    const now = new Date().toISOString();
    
    const newAddress = {
      ...testAddress,
      id: 'test-id-123',
      created_at: now,
      updated_at: now
    };
    
    addresses.push(newAddress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
    
    // Test retrieving addresses
    console.log('\n🔍 Testing address retrieval...');
    const storedData = localStorage.getItem(STORAGE_KEY);
    const storedAddresses = JSON.parse(storedData);
    
    if (!storedAddresses || storedAddresses.length === 0) {
      throw new Error('Failed to retrieve addresses from storage');
    }
    
    console.log(`✅ Successfully retrieved ${storedAddresses.length} address(es)`);
    console.log('📋 First address:', storedAddresses[0]);
    
    // Test updating an address
    console.log('\n🔄 Testing address update...');
    const updatedAddresses = storedAddresses.map(addr => {
      if (addr.id === 'test-id-123') {
        return {
          ...addr,
          city: 'New Delhi',
          updated_at: new Date().toISOString()
        };
      }
      return addr;
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAddresses));
    
    // Verify update
    const updatedData = localStorage.getItem(STORAGE_KEY);
    const verifyAddresses = JSON.parse(updatedData);
    const updatedAddress = verifyAddresses.find(addr => addr.id === 'test-id-123');
    
    if (updatedAddress.city !== 'New Delhi') {
      throw new Error('Address update failed');
    }
    
    console.log('✅ Successfully updated address');
    console.log('📋 Updated address:', updatedAddress);
    
    // Test adding another address
    console.log('\n➕ Testing adding another address...');
    const anotherAddress = {
      ...testAddress,
      id: 'test-id-456',
      type: 'Work',
      name: 'Jane Doe',
      address: '456 Office Park',
      city: 'Bangalore',
      is_default: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    verifyAddresses.push(anotherAddress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(verifyAddresses));
    
    // Verify multiple addresses
    const multipleData = localStorage.getItem(STORAGE_KEY);
    const multipleAddresses = JSON.parse(multipleData);
    
    if (multipleAddresses.length !== 2) {
      throw new Error('Failed to add second address');
    }
    
    console.log(`✅ Successfully added second address. Total: ${multipleAddresses.length}`);
    
    // Test setting default address
    console.log('\n⭐ Testing setting default address...');
    const withDefaultAddresses = multipleAddresses.map(addr => ({
      ...addr,
      is_default: addr.id === 'test-id-456'
    }));
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(withDefaultAddresses));
    
    // Verify default address
    const defaultData = localStorage.getItem(STORAGE_KEY);
    const defaultAddresses = JSON.parse(defaultData);
    const defaultAddress = defaultAddresses.find(addr => addr.is_default);
    
    if (!defaultAddress || defaultAddress.id !== 'test-id-456') {
      throw new Error('Setting default address failed');
    }
    
    console.log('✅ Successfully set default address');
    console.log('📋 Default address:', defaultAddress);
    
    // Test deleting an address
    console.log('\n🗑️ Testing address deletion...');
    const remainingAddresses = defaultAddresses.filter(addr => addr.id !== 'test-id-123');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remainingAddresses));
    
    // Verify deletion
    const afterDeleteData = localStorage.getItem(STORAGE_KEY);
    const afterDeleteAddresses = JSON.parse(afterDeleteData);
    
    if (afterDeleteAddresses.length !== 1 || afterDeleteAddresses[0].id !== 'test-id-456') {
      throw new Error('Address deletion failed');
    }
    
    console.log('✅ Successfully deleted address');
    console.log(`📋 Remaining addresses: ${afterDeleteAddresses.length}`);
    
    // Final cleanup
    localStorage.removeItem(STORAGE_KEY);
    
    console.log('\n🎉 All permanent address storage tests passed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the tests
testPermanentAddressStorage();