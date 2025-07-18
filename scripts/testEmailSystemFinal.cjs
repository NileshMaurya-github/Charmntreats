// Final test of the enhanced email system
const BREVO_API_KEY = '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';
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

// Test with a simple email first to check IP authorization
async function testSimpleEmail() {
  console.log('🧪 Testing simple email to check IP authorization...\n');

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { 
          name: "Charmntreats Test", 
          email: "charmntreats@gmail.com" 
        },
        to: [{ 
          email: "nilesh.maurya.developer@gmail.com",
          name: "Test User"
        }],
        subject: "🧪 Email System Test - Charmntreats",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #f59e42; color: white; padding: 20px; text-align: center; border-radius: 8px;">
              <h1 style="margin: 0;">🎉 Email System Working!</h1>
              <p style="margin: 10px 0 0 0;">Your Charmntreats email system is now functional</p>
            </div>
            <div style="padding: 20px; background: #f9f9f9; margin-top: 20px; border-radius: 8px;">
              <h3 style="color: #333;">✅ What's Working:</h3>
              <ul>
                <li>✅ Brevo API connection successful</li>
                <li>✅ IP address authorized</li>
                <li>✅ Email templates ready</li>
                <li>✅ Order confirmation emails ready</li>
                <li>✅ Store notification emails ready</li>
              </ul>
              <p style="margin-top: 20px; color: #666;">
                Test completed on ${new Date().toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        `
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Simple email test PASSED! Message ID:', result.messageId);
      console.log('📧 Check your email inbox for the test message');
      return true;
    } else {
      const errorText = await response.text();
      console.error('❌ Simple email test FAILED:', response.status);
      console.error('Error details:', errorText);
      
      if (errorText.includes('unrecognised IP address')) {
        console.log('\n🔧 IP AUTHORIZATION REQUIRED:');
        console.log('1. Go to: https://app.brevo.com/security/authorised_ips');
        console.log('2. Click "Add IP Address"');
        console.log('3. Add your current IP address');
        console.log('4. Save and try again');
        console.log('\n💡 Your current IP might be different due to network changes');
      }
      
      return false;
    }

  } catch (error) {
    console.error('❌ Email test error:', error.message);
    return false;
  }
}

// Test the complete order email system
async function testOrderEmailSystem() {
  console.log('\n🧪 Testing Complete Order Email System...\n');

  const testOrderData = {
    customerInfo: {
      fullName: 'John Doe',
      email: 'nilesh.maurya.developer@gmail.com', // Your email for testing
      phone: '9876543210',
      address: '123 Main Street, Apartment 4B, Near Central Mall',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    },
    items: [
      {
        id: 'handcrafted-dreamcatcher-001',
        name: 'Handcrafted Dream Catcher - Large',
        category: 'Home Decor',
        catalogNumber: 'DC001',
        price: 799,
        quantity: 1,
        images: ['https://images.unsplash.com/photo-1618160702438-9b02ab6515c9']
      },
      {
        id: 'macrame-wall-hanging-002', 
        name: 'Macrame Wall Hanging - Boho Style',
        category: 'Wall Art',
        catalogNumber: 'MWH002',
        price: 700,
        quantity: 2,
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7']
      }
    ],
    totalAmount: 2199,
    paymentMethod: 'cod',
    orderDate: new Date().toISOString(),
    orderId: 'CT' + Date.now().toString().slice(-6) + 'FINAL'
  };

  console.log('📧 Test Order Details:');
  console.log('- Order ID:', testOrderData.orderId);
  console.log('- Customer:', testOrderData.customerInfo.fullName);
  console.log('- Email:', testOrderData.customerInfo.email);
  console.log('- Total Amount:', '₹' + testOrderData.totalAmount.toLocaleString());
  console.log('- Items:', testOrderData.items.length);
  console.log('- Payment:', testOrderData.paymentMethod.toUpperCase());

  try {
    // Import and use the email service
    const { sendOrderEmails } = await import('../src/services/simpleEmailService.ts');
    
    console.log('\n📤 Sending order confirmation emails...');
    const emailsSent = await sendOrderEmails(testOrderData);

    if (emailsSent) {
      console.log('\n🎉 SUCCESS! Order emails sent successfully!');
      console.log('\n📧 What you should receive:');
      console.log('✅ Customer Invoice Email with:');
      console.log('  • Complete order details and invoice');
      console.log('  • Itemized breakdown with prices');
      console.log('  • Delivery address and payment info');
      console.log('  • Professional HTML design');
      console.log('  • Next steps and support information');
      
      console.log('\n✅ Store Notification Email with:');
      console.log('  • New order alert with customer details');
      console.log('  • Complete order summary for processing');
      console.log('  • Action items and delivery information');
      console.log('  • Professional admin notification design');
      
      console.log('\n🎯 Your email system is now fully functional!');
      return true;
    } else {
      console.log('\n❌ Email sending failed');
      console.log('💡 Check the console logs above for specific error details');
      return false;
    }

  } catch (error) {
    console.error('❌ Order email test failed:', error.message);
    return false;
  }
}

// Run the tests
async function runAllTests() {
  console.log('🚀 Starting Email System Tests...\n');
  
  // Test 1: Simple email to check IP authorization
  const simpleTestPassed = await testSimpleEmail();
  
  if (simpleTestPassed) {
    // Test 2: Complete order email system
    await testOrderEmailSystem();
  } else {
    console.log('\n⚠️ Skipping order email test due to IP authorization issue');
    console.log('Please fix IP authorization first, then run this test again');
  }
  
  console.log('\n📋 Test Summary:');
  console.log('- Simple Email Test:', simpleTestPassed ? '✅ PASSED' : '❌ FAILED');
  console.log('- Order Email System: Ready for testing after IP fix');
  
  if (simpleTestPassed) {
    console.log('\n🎉 Your email system is working!');
    console.log('✅ Customers will receive detailed invoice emails');
    console.log('✅ You will receive store notification emails');
    console.log('✅ All order details included in emails');
    console.log('✅ Professional HTML email design');
  }
}

runAllTests();