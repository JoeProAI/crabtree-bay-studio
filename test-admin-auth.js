// Test admin auth API locally
const testAdminAuth = async () => {
  try {
    console.log('🧪 Testing admin auth API locally...');
    
    const response = await fetch('http://localhost:3000/api/admin/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: 'adminnimda' })
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);

    const responseText = await response.text();
    console.log('📝 Response body:', responseText);

    if (response.ok) {
      console.log('✅ Admin auth API works locally!');
      try {
        const jsonData = JSON.parse(responseText);
        console.log('📊 Parsed response:', jsonData);
      } catch (e) {
        console.log('⚠️ Response is not JSON');
      }
    } else {
      console.log('❌ Admin auth API failed locally');
    }

    return { status: response.status, body: responseText };
  } catch (error) {
    console.error('💥 Error testing admin auth:', error);
    return { error: error.message };
  }
};

testAdminAuth().then(result => {
  console.log('🏁 Test completed:', result);
  process.exit(0);
});
