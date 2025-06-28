// Test Supabase connection locally
const { createClient } = require('@supabase/supabase-js');

const testSupabaseConnection = async () => {
  try {
    console.log('🧪 Testing Supabase connection...');
    
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('🔑 SUPABASE_URL exists:', !!supabaseUrl);
    console.log('🔑 SUPABASE_SERVICE_ROLE_KEY exists:', !!supabaseKey);
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('❌ Missing environment variables!');
      return { error: 'Missing environment variables' };
    }
    
    console.log('🔗 Supabase URL:', supabaseUrl);
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test basic connection
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Supabase connection failed:', error);
      return { error: error.message };
    }
    
    console.log('✅ Supabase connection works!');
    console.log('📊 Query result:', data);
    
    // Try to get actual products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active');
    
    if (productsError) {
      console.log('❌ Products query failed:', productsError);
      return { error: productsError.message };
    }
    
    console.log('✅ Products query works!');
    console.log('📊 Number of products:', products?.length || 0);
    console.log('📊 Products:', products);
    
    return { success: true, products };
    
  } catch (error) {
    console.error('💥 Error testing Supabase:', error);
    return { error: error.message };
  }
};

// Load environment variables
require('dotenv').config({ path: '.env.local' });

testSupabaseConnection().then(result => {
  console.log('🏁 Test completed:', result);
  process.exit(0);
});
