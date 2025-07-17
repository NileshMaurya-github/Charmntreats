// Test different API key formats for Brevo
const SibApiV3Sdk = require('sib-api-v3-sdk');

// Test different key formats
const API_KEYS = [
  'xkeysiba5b517f8682c0e26fb1a0ac4d165c32745a7baf5306eeb07878664facea48017-mOG7Qt6XsUFaXnKU',
  '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'
];

async function testKeyFormat(apiKey, index) {
  try {
    console.log(`\n🧪 Testing API Key Format ${index + 1}:`);
    console.log('📧 API Key (first 30 chars):', apiKey.substring(0, 30) + '...');

    // Configure the API client
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    
    // Configure API key authorization: api-key
    const apiKeyAuth = defaultClient.authentications['api-key'];
    apiKeyAuth.apiKey = apiKey;

    // Create an instance of the AccountApi to test authentication
    const accountApi = new SibApiV3Sdk.AccountApi();

    console.log('📧 Testing account info to verify API key...');
    
    // Get account info (this is a simple way to test if the API key works)
    const accountInfo = await accountApi.getAccount();
    
    console.log('✅ API Key is valid!');
    console.log('📧 Account Email:', accountInfo.email);
    console.log('📧 Account Plan:', accountInfo.plan);
    
    return { success: true, key: apiKey, accountInfo };

  } catch (error) {
    console.error('❌ API Key failed:', error.message);
    
    if (error.response) {
      console.error('❌ Response status:', error.response.status);
      console.error('❌ Response body:', error.response.body);
    }
    
    return { success: false, key: apiKey, error: error.message };
  }
}

async function testAllFormats() {
  console.log('🔑 Testing different API key formats for Brevo...\n');
  
  const results = [];
  
  for (let i = 0; i < API_KEYS.length; i++) {
    const result = await testKeyFormat(API_KEYS[i], i);
    results.push(result);
    
    if (result.success) {
      console.log(`\n🎉 Found working API key format: ${i + 1}`);
      break;
    }
  }
  
  console.log('\n📊 Summary:');
  results.forEach((result, index) => {
    console.log(`Format ${index + 1}: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  });
  
  const workingKey = results.find(r => r.success);
  if (workingKey) {
    console.log('\n🔑 Use this API key format:', workingKey.key.substring(0, 30) + '...');
    return workingKey.key;
  } else {
    console.log('\n💥 No working API key format found!');
    return null;
  }
}

// Run the test
testAllFormats()
  .then(workingKey => {
    if (workingKey) {
      console.log('\n🎉 API key validation completed successfully!');
      process.exit(0);
    } else {
      console.log('\n💥 API key validation failed!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });