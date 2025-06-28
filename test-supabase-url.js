// Test if Supabase URL is accessible at all
const https = require('https');
const http = require('http');

const testSupabaseURL = async () => {
  const supabaseUrl = 'https://kqzuayxqhsrctwljnrci.supabase.co';
  
  console.log('🧪 Testing Supabase URL accessibility...');
  console.log('🔗 URL:', supabaseUrl);
  
  // Try basic HTTP GET to see if URL is reachable
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'kqzuayxqhsrctwljnrci.supabase.co',
      port: 443,
      path: '/rest/v1/',
      method: 'GET',
      headers: {
        'User-Agent': 'Node.js Test'
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      console.log('✅ HTTP Response received!');
      console.log('📡 Status:', res.statusCode);
      console.log('📡 Headers:', res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('📝 Response body (first 200 chars):', data.substring(0, 200));
        resolve({ success: true, status: res.statusCode, data });
      });
    });

    req.on('error', (error) => {
      console.error('❌ HTTP Request failed:', error);
      console.error('❌ Error type:', error.constructor.name);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      resolve({ error: error.message, code: error.code });
    });

    req.on('timeout', () => {
      console.error('❌ Request timed out');
      req.destroy();
      resolve({ error: 'Request timed out' });
    });

    req.end();
  });
};

// Also test basic network connectivity
const testNetworkConnectivity = async () => {
  console.log('🌐 Testing basic network connectivity...');
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'google.com',
      port: 443,
      path: '/',
      method: 'GET',
      timeout: 5000
    };

    const req = https.request(options, (res) => {
      console.log('✅ Network connectivity OK (Google accessible)');
      resolve({ success: true });
    });

    req.on('error', (error) => {
      console.error('❌ Network connectivity FAILED:', error.message);
      resolve({ error: error.message });
    });

    req.on('timeout', () => {
      console.error('❌ Network timeout');
      req.destroy();
      resolve({ error: 'Network timeout' });
    });

    req.end();
  });
};

const runTests = async () => {
  console.log('🚀 Starting network diagnostics...');
  
  // Test 1: Basic network connectivity
  const networkResult = await testNetworkConnectivity();
  console.log('🏁 Network test result:', networkResult);
  
  // Test 2: Supabase URL accessibility
  const supabaseResult = await testSupabaseURL();
  console.log('🏁 Supabase URL test result:', supabaseResult);
  
  console.log('🎯 DIAGNOSIS COMPLETE');
  if (networkResult.error) {
    console.log('❌ ISSUE: No network connectivity');
  } else if (supabaseResult.error) {
    console.log('❌ ISSUE: Supabase URL not accessible');
  } else {
    console.log('✅ Network and Supabase URL both accessible - issue may be elsewhere');
  }
  
  process.exit(0);
};

runTests();
