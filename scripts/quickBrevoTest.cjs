// Quick test to verify Brevo integration after IDE autofix
const SibApiV3Sdk = require('sib-api-v3-sdk');

const API_KEY = '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';

async function quickTest() {
  try {
    console.log('🧪 Quick test after IDE autofix...');

    // Configure the API client
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = API_KEY;

    // Test account access
    const accountApi = new SibApiV3Sdk.AccountApi();
    const accountInfo = await accountApi.getAccount();
    
    console.log('✅ API Key is still valid!');
    console.log('📧 Account:', accountInfo.email);
    console.log('📊 Email Credits:', accountInfo.plan[0].credits);
    
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

quickTest()
  .then(success => {
    if (success) {
      console.log('🎉 Brevo integration is still working after IDE autofix!');
    } else {
      console.log('💥 Integration may have issues after autofix.');
    }
    process.exit(success ? 0 : 1);
  });