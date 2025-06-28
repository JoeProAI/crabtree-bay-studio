// Test products API locally
const testProductsAPI = async () => {
  try {
    console.log('🧪 Testing products API locally...');
    
    const response = await fetch('http://localhost:3000/api/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);

    const responseText = await response.text();
    console.log('📝 Response body:', responseText);

    if (response.ok) {
      console.log('✅ Products API works locally!');
      try {
        const jsonData = JSON.parse(responseText);
        console.log('📊 Number of products:', jsonData.length);
        console.log('📊 Products:', jsonData);
      } catch (e) {
        console.log('⚠️ Response is not JSON');
      }
    } else {
      console.log('❌ Products API failed locally');
    }

    return { status: response.status, body: responseText };
  } catch (error) {
    console.error('💥 Error testing products API:', error);
    return { error: error.message };
  }
};

testProductsAPI().then(result => {
  console.log('🏁 Test completed:', result);
  process.exit(0);
});
