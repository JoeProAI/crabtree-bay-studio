// Test Supabase connection directly without Next.js env loading
const { createClient } = require('@supabase/supabase-js');

const testSupabaseDirect = async () => {
  try {
    console.log('🧪 Testing Supabase connection directly...');
    
    // Hardcode the values from .env.local to test if env loading is the issue
    const supabaseUrl = 'https://kqzuayxqhsrctwljnrci.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxenVheXhxaHNyY3R3bGpucmNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxOTUxNDYyMCwiZXhwIjoyMDM1MDkwNjIwfQ.VBhvCvC_tMfI9Xsz8WCsHAKGjGQ8NzYOZrYhF_rVgOA';
    
    console.log('🔗 Testing URL:', supabaseUrl);
    console.log('🔑 Service key (first 20 chars):', supabaseKey.substring(0, 20) + '...');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('📡 Testing basic connection...');
    
    // Test basic connection with a simple query
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Supabase connection failed:');
      console.log('  - Error code:', error.code);
      console.log('  - Error message:', error.message);
      console.log('  - Error details:', error.details);
      console.log('  - Full error:', JSON.stringify(error, null, 2));
      return { error: error.message };
    }
    
    console.log('✅ Supabase connection works!');
    console.log('📊 Query result:', data);
    
    // Test products query
    console.log('📡 Testing products query...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .limit(5);
    
    if (productsError) {
      console.log('❌ Products query failed:');
      console.log('  - Error:', JSON.stringify(productsError, null, 2));
      return { error: productsError.message };
    }
    
    console.log('✅ Products query works!');
    console.log('📊 Number of products:', products?.length || 0);
    if (products && products.length > 0) {
      console.log('📊 First product:', products[0]);
    }
    
    return { success: true, products };
    
  } catch (error) {
    console.error('💥 Direct Supabase test failed:', error);
    return { error: error.message };
  }
};

testSupabaseDirect().then(result => {
  console.log('🏁 Direct test completed:', result);
  process.exit(0);
});
