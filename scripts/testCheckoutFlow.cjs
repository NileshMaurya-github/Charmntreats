// Test the complete checkout flow
const fetch = require('node-fetch');

async function testCheckoutFlow() {
  try {
    console.log('🧪 Testing checkout flow...');

    // Sample order data
    const orderData = {
      customerInfo: {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '9876543210',
        address: '123 Test Street, Test Area',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      items: [
        {
          id: 'test-product-1',
          name: 'Handcrafted Dream Catcher',
          price: 599,
          quantity: 2,
          category: 'Home Decor',
          catalogNumber: 'DC001',
          images: ['https://example.com/dreamcatcher.jpg']
        },
        {
          id: 'test-product-2',
          name: 'Embroidered Wall Hanging',
          price: 799,
          quantity: 1,
          category: 'Wall Art',
          catalogNumber: 'WH002',
          images: ['https://example.com/wallhanging.jpg']
        }
      ],
      totalAmount: 1997,
      paymentMethod: 'cod',
      orderDate: new Date().toISOString(),
      orderId: 'CT' + Date.now().toString().slice(-6) + 'TEST'
    };

    console.log('📧 Testing order confirmation emails...');
    
    // Test order confirmation email API
    const emailResponse = await fetch('http://localhost:3000/api/send-order-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    if (emailResponse.ok) {
      const emailResult = await emailResponse.json();
      console.log('✅ Order confirmation emails sent successfully:', emailResult);
    } else {
      console.log('❌ Email API failed:', emailResponse.status, await emailResponse.text());
    }

    console.log('💾 Testing order storage...');
    
    // Test order storage API
    const storeResponse = await fetch('http://localhost:3000/api/store-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    if (storeResponse.ok) {
      const storeResult = await storeResponse.json();
      console.log('✅ Order stored successfully:', storeResult);
    } else {
      console.log('❌ Storage API failed:', storeResponse.status, await storeResponse.text());
    }

    console.log('🎉 Checkout flow test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('💡 Make sure the development server is running on localhost:3000');
  }
}

testCheckoutFlow();