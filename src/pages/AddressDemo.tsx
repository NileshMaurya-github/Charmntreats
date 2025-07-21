import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import addressService, { Address } from '@/services/addressService';
import { permanentStorageService } from '@/services/permanentStorageService';
import { addressStorageMonitor } from '@/utils/addressStorageMonitor';

const AddressDemo = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [storageStatus, setStorageStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [monitoringEnabled, setMonitoringEnabled] = useState(false);
  const [monitorLogs, setMonitorLogs] = useState<any[]>([]);
  const [storageHealth, setStorageHealth] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const [demoAddress, setDemoAddress] = useState({
    name: 'Demo User',
    address: '123 Demo Street',
    city: 'Demo City',
    state: 'Demo State',
    pincode: '123456',
    phone: '9876543210',
    type: 'Home',
    is_default: true
  });

  useEffect(() => {
    checkStorageAvailability();
    if (user) {
      loadAddresses();
    } else {
      setLoading(false);
    }
    
    // Check if monitoring is already enabled
    setMonitoringEnabled(addressStorageMonitor.isMonitoringEnabled());
    
    // Check storage health
    const health = addressStorageMonitor.checkStorageHealth();
    setStorageHealth(health);
    
    // Update monitor logs
    updateMonitorLogs();
    
    // Set up interval to refresh monitor logs
    const interval = setInterval(updateMonitorLogs, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const checkStorageAvailability = () => {
    try {
      localStorage.setItem('storage_test', 'test');
      localStorage.removeItem('storage_test');
      setStorageStatus('available');
    } catch (e) {
      setStorageStatus('unavailable');
    }
  };

  const loadAddresses = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userAddresses = await addressService.getUserAddresses(user.id);
      setAddresses(userAddresses);
    } catch (error) {
      console.error('Error loading addresses:', error);
      toast({
        title: "Error",
        description: "Failed to load addresses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddDemoAddress = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add addresses",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const newAddress: Omit<Address, 'id' | 'created_at' | 'updated_at'> = {
        ...demoAddress,
        user_id: user.id
      };
      
      const result = await addressService.addAddress(newAddress);
      
      if (result) {
        toast({
          title: "Success",
          description: "Demo address added successfully",
        });
        loadAddresses();
      }
    } catch (error) {
      console.error('Error adding demo address:', error);
      toast({
        title: "Error",
        description: "Failed to add demo address",
        variant: "destructive",
      });
    }
  };

  const handleClearAddresses = async () => {
    if (!user) return;
    
    try {
      // Get all addresses
      const userAddresses = await addressService.getUserAddresses(user.id);
      
      // Delete each address
      for (const address of userAddresses) {
        if (address.id) {
          await addressService.deleteAddress(address.id);
        }
      }
      
      toast({
        title: "Success",
        description: "All addresses cleared successfully",
      });
      
      loadAddresses();
    } catch (error) {
      console.error('Error clearing addresses:', error);
      toast({
        title: "Error",
        description: "Failed to clear addresses",
        variant: "destructive",
      });
    }
  };

  const updateMonitorLogs = () => {
    if (addressStorageMonitor.isMonitoringEnabled()) {
      setMonitorLogs(addressStorageMonitor.getLogs());
    }
  };

  const handleViewRawStorage = () => {
    try {
      const rawData = localStorage.getItem('charm_n_treats_addresses');
      console.log('Raw address storage data:', rawData ? JSON.parse(rawData) : null);
      
      toast({
        title: "Storage Data",
        description: "Raw storage data logged to console",
      });
    } catch (error) {
      console.error('Error viewing raw storage:', error);
      toast({
        title: "Error",
        description: "Failed to view raw storage data",
        variant: "destructive",
      });
    }
  };
  
  const handleToggleMonitoring = () => {
    if (monitoringEnabled) {
      addressStorageMonitor.disable();
      setMonitoringEnabled(false);
      toast({
        title: "Monitoring Disabled",
        description: "Address storage monitoring has been disabled",
      });
    } else {
      addressStorageMonitor.enable();
      setMonitoringEnabled(true);
      updateMonitorLogs();
      toast({
        title: "Monitoring Enabled",
        description: "Address storage monitoring has been enabled",
      });
    }
  };
  
  const handleClearMonitorLogs = () => {
    addressStorageMonitor.clearLogs();
    setMonitorLogs([]);
    toast({
      title: "Logs Cleared",
      description: "Monitor logs have been cleared",
    });
  };
  
  const handleCheckStorageHealth = () => {
    const health = addressStorageMonitor.checkStorageHealth();
    setStorageHealth(health);
    toast({
      title: "Storage Health",
      description: health.message,
    });
  };
  
  const handleRepairStorage = () => {
    const repaired = addressStorageMonitor.repairStorage();
    if (repaired) {
      toast({
        title: "Storage Repaired",
        description: "Address storage has been repaired",
      });
    } else {
      toast({
        title: "No Repair Needed",
        description: "Address storage is already healthy",
      });
    }
    handleCheckStorageHealth();
  };

  return (
    <div className="min-h-screen bg-floral-gradient">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Address Storage Demo</h1>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-center">
          <p className="text-sm text-blue-700 mb-2">For developers: Run the verification script to test the complete address system</p>
          <code className="bg-blue-100 px-3 py-1 rounded text-blue-800 text-xs">node scripts/verifyCompleteAddressSystem.cjs</code>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Storage Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Local Storage:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    storageStatus === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : storageStatus === 'unavailable'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {storageStatus === 'available' 
                      ? 'Available' 
                      : storageStatus === 'unavailable'
                        ? 'Unavailable'
                        : 'Checking...'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>User Logged In:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user ? 'Yes' : 'No'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Addresses Loaded:</span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {loading ? 'Loading...' : `${addresses.length} addresses`}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <Button 
                  onClick={handleViewRawStorage}
                  className="w-full"
                  variant="outline"
                >
                  View Raw Storage Data (Console)
                </Button>
                
                <Button 
                  onClick={loadAddresses}
                  className="w-full"
                  disabled={!user || loading}
                >
                  Refresh Addresses
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Add Demo Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={demoAddress.name}
                    onChange={(e) => setDemoAddress({...demoAddress, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={demoAddress.address}
                    onChange={(e) => setDemoAddress({...demoAddress, address: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={demoAddress.city}
                      onChange={(e) => setDemoAddress({...demoAddress, city: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={demoAddress.state}
                      onChange={(e) => setDemoAddress({...demoAddress, state: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={demoAddress.pincode}
                      onChange={(e) => setDemoAddress({...demoAddress, pincode: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={demoAddress.phone}
                      onChange={(e) => setDemoAddress({...demoAddress, phone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={demoAddress.is_default}
                    onChange={(e) => setDemoAddress({...demoAddress, is_default: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="is_default">Set as default</Label>
                </div>
                
                <div className="pt-4 space-y-2">
                  <Button 
                    onClick={handleAddDemoAddress}
                    className="w-full bg-pink-600 hover:bg-pink-700"
                    disabled={!user}
                  >
                    Add Demo Address
                  </Button>
                  
                  <Button 
                    onClick={handleClearAddresses}
                    className="w-full"
                    variant="destructive"
                    disabled={!user || addresses.length === 0}
                  >
                    Clear All Addresses
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Addresses</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
                  <p className="mt-4 text-slate-600">Loading addresses...</p>
                </div>
              ) : addresses.length > 0 ? (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div 
                      key={address.id} 
                      className={`p-4 border rounded-lg ${address.is_default ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}`}
                    >
                      <div className="flex justify-between">
                        <div className="font-medium">{address.name}</div>
                        <div className="text-sm">
                          {address.is_default && (
                            <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        <div>{address.address}</div>
                        <div>{address.city}, {address.state} - {address.pincode}</div>
                        <div>Phone: {address.phone}</div>
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        ID: {address.id}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-600">
                  {user ? 'No addresses found. Add a demo address to get started.' : 'Please login to view your addresses.'}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Storage Monitor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Monitoring Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    monitoringEnabled 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {monitoringEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Storage Health:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    storageHealth?.status === 'healthy' 
                      ? 'bg-green-100 text-green-800' 
                      : storageHealth?.status === 'empty'
                        ? 'bg-yellow-100 text-yellow-800'
                        : storageHealth?.status === 'corrupted'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                  }`}>
                    {storageHealth?.status || 'Unknown'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={handleToggleMonitoring}
                    variant={monitoringEnabled ? "destructive" : "default"}
                    className="w-full"
                  >
                    {monitoringEnabled ? 'Disable Monitoring' : 'Enable Monitoring'}
                  </Button>
                  
                  <Button 
                    onClick={handleCheckStorageHealth}
                    variant="outline"
                    className="w-full"
                  >
                    Check Health
                  </Button>
                  
                  <Button 
                    onClick={handleClearMonitorLogs}
                    variant="outline"
                    className="w-full"
                    disabled={!monitoringEnabled || monitorLogs.length === 0}
                  >
                    Clear Logs
                  </Button>
                  
                  <Button 
                    onClick={handleRepairStorage}
                    variant="outline"
                    className="w-full"
                  >
                    Repair Storage
                  </Button>
                </div>
                
                {monitoringEnabled && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Monitor Logs</h3>
                    <div className="bg-gray-50 p-3 rounded-lg max-h-60 overflow-y-auto text-xs">
                      {monitorLogs.length > 0 ? (
                        <div className="space-y-2">
                          {monitorLogs.slice().reverse().map((log, index) => (
                            <div 
                              key={index} 
                              className={`p-2 rounded ${
                                log.status === 'success' 
                                  ? 'bg-green-50 border-l-2 border-green-500' 
                                  : 'bg-red-50 border-l-2 border-red-500'
                              }`}
                            >
                              <div className="flex justify-between">
                                <span className="font-medium">{log.operation}</span>
                                <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                              </div>
                              <div className="mt-1">{log.details}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No logs available
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {storageHealth && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Storage Details</h3>
                    <div className="text-xs space-y-1">
                      <div><span className="font-medium">Status:</span> {storageHealth.status}</div>
                      <div><span className="font-medium">Message:</span> {storageHealth.message}</div>
                      {storageHealth.count !== undefined && (
                        <div><span className="font-medium">Address Count:</span> {storageHealth.count}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AddressDemo;