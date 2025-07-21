// This script helps migrate addresses from the database to permanent storage
// It can be run in the browser console on the live website

function migrateAddressesToPermanentStorage() {
  console.log('🔄 Starting address migration to permanent storage...');
  
  // Check if we have access to the required services
  if (!window.addressService || !window.permanentAddressService) {
    console.error('❌ Required services not found. Run this script on a page where address services are loaded.');
    return;
  }
  
  // Get the current user
  const user = window.auth?.user;
  if (!user) {
    console.error('❌ No user logged in. Please log in first.');
    return;
  }
  
  console.log('👤 User found:', user.id);
  
  // Try to get addresses from database
  console.log('🔍 Attempting to fetch addresses from database...');
  
  // Use a direct approach to get addresses from the database
  window.supabase
    .from('user_addresses')
    .select('*')
    .eq('user_id', user.id)
    .then(({ data, error }) => {
      if (error) {
        console.error('❌ Error fetching addresses from database:', error);
        return;
      }
      
      if (!data || data.length === 0) {
        console.log('ℹ️ No addresses found in database.');
        return;
      }
      
      console.log(`✅ Found ${data.length} addresses in database.`);
      
      // Import addresses to permanent storage
      window.permanentAddressService.importAddresses(data)
        .then(success => {
          if (success) {
            console.log('🎉 Successfully migrated addresses to permanent storage!');
            
            // Verify the migration
            window.permanentAddressService.getUserAddresses(user.id)
              .then(addresses => {
                console.log(`✅ Verification: ${addresses.length} addresses in permanent storage.`);
              });
          } else {
            console.error('❌ Failed to migrate addresses to permanent storage.');
          }
        });
    });
}

// Instructions for running this script
console.log(`
📋 Address Migration Script
==========================
This script helps migrate addresses from the database to permanent storage.

To run this script:
1. Log in to your account on charmntreats.in
2. Navigate to the Profile Address page (/profile/address)
3. Open the browser console (F12 or right-click > Inspect > Console)
4. Copy and paste the following line:

   window.migrateAddressesToPermanentStorage();

5. Press Enter to run the migration
`);

// Export the function for browser use
if (typeof window !== 'undefined') {
  window.migrateAddressesToPermanentStorage = migrateAddressesToPermanentStorage;
}