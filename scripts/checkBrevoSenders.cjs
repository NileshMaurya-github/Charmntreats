// Check current validated senders in Brevo account
const SibApiV3Sdk = require('sib-api-v3-sdk');

const API_KEY = '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';

async function checkSenders() {
  try {
    console.log('🔍 Checking validated senders in your Brevo account...');

    // Configure the API client
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = API_KEY;

    // Get account info first
    const accountApi = new SibApiV3Sdk.AccountApi();
    const accountInfo = await accountApi.getAccount();
    
    console.log('📧 Account Email:', accountInfo.email);
    console.log('📊 Plan:', accountInfo.plan[0].type);
    console.log('📊 Email Credits:', accountInfo.plan[0].credits);

    // Try to get senders (this might not be available in free plan)
    try {
      const sendersApi = new SibApiV3Sdk.SendersApi();
      const senders = await sendersApi.getSenders();
      
      console.log('\n✅ Validated Senders:');
      if (senders.senders && senders.senders.length > 0) {
        senders.senders.forEach((sender, index) => {
          console.log(`${index + 1}. ${sender.name} <${sender.email}>`);
          console.log(`   Status: ${sender.active ? 'Active' : 'Inactive'}`);
        });
      } else {
        console.log('No validated senders found.');
      }
    } catch (senderError) {
      console.log('\n⚠️  Cannot retrieve senders list (may require paid plan)');
      console.log('Error:', senderError.message);
    }

    // Suggest using account email as sender
    console.log('\n💡 Recommended Solution:');
    console.log(`Use your account email as sender: ${accountInfo.email}`);
    console.log('This email is automatically validated when you create the account.');

    return accountInfo.email;

  } catch (error) {
    console.error('❌ Error checking account:', error);
    if (error.response) {
      console.error('Response:', error.response.body);
    }
    return null;
  }
}

checkSenders()
  .then(accountEmail => {
    if (accountEmail) {
      console.log(`\n🔧 Update your sender email to: ${accountEmail}`);
    }
  });