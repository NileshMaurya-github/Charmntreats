// Test the email API directly
const fetch = require('node-fetch');

async function testEmailAPI() {
  try {
    console.log('📧 Testing order confirmation email API...');

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
          images: ['https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80']
        }
      ],
      totalAmount: 1248, // 599*2 + 50 shipping
      paymentMethod: 'cod',
      orderDate: new Date().toISOString(),
      orderId: 'CT' + Date.now().toString().slice(-6) + 'TEST'
    };

    console.log('🔍 Testing with order ID:', orderData.orderId);
    
    // Test the API endpoint
    const response = await fetch('http://localhost:5173/api/send-order-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Email API success:', result);
    } else {
      const errorText = await response.text();
      console.log('❌ Email API failed:', errorText);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('💡 Make sure the development server is running on localhost:5173');
    console.log('💡 Or try with localhost:3000 if using a different port');
  }
}

testEmailAPI();