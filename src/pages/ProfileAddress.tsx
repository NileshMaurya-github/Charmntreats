import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowLeft, Plus, Edit, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import addressService, { Address } from '@/services/addressService';
import { useToast } from '@/hooks/use-toast';

const ProfileAddress = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    is_default: false
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    if (!user) return;

    try {
      console.log('🔍 Fetching addresses for user:', user.id);
      const userAddresses = await addressService.getUserAddresses(user.id);
      console.log(`📋 Found ${userAddresses.length} addresses`);
      setAddresses(userAddresses);
    } catch (error) {
      console.error('❌ Error fetching addresses:', error);
      toast({
        title: "Error",
        description: "Failed to load addresses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      console.log('🗑️ Deleting address:', id);
      const success = await addressService.deleteAddress(id);
      if (success) {
        setAddresses(prev => prev.filter(addr => addr.id !== id));
        toast({
          title: "Success",
          description: "Address deleted successfully.",
        });
        console.log('✅ Address deleted successfully');
      } else {
        throw new Error('Failed to delete address');
      }
    } catch (error) {
      console.error('❌ Error deleting address:', error);
      toast({
        title: "Error",
        description: "Failed to delete address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;

    try {
      console.log('🔄 Setting address as default:', id);
      const success = await addressService.setDefaultAddress(id, user.id);
      if (success) {
        setAddresses(prev => prev.map(addr => ({
          ...addr,
          is_default: addr.id === id
        })));
        toast({
          title: "Success",
          description: "Default address updated successfully.",
        });
        console.log('✅ Default address updated successfully');
      } else {
        throw new Error('Failed to set default address');
      }
    } catch (error) {
      console.error('❌ Error setting default address:', error);
      toast({
        title: "Error",
        description: "Failed to update default address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddAddress = async () => {
    if (!user) return;

    try {
      console.log('📝 Adding new address');

      // Check if this is the first address (make it default)
      const makeDefault = addresses.length === 0 || newAddress.is_default;

      const addressData: Omit<Address, 'id' | 'created_at' | 'updated_at'> = {
        user_id: user.id,
        type: newAddress.type,
        name: newAddress.name,
        address: newAddress.address,
        city: newAddress.city,
        state: newAddress.state,
        pincode: newAddress.pincode,
        phone: newAddress.phone,
        is_default: makeDefault
      };

      console.log('📝 New address data:', addressData);

      const result = await addressService.addAddress(addressData);
      if (result) {
        console.log('✅ Address added successfully with ID:', result.id);
        toast({
          title: "Success",
          description: "Address added successfully.",
        });
        setIsAddDialogOpen(false);
        setNewAddress({
          type: 'Home',
          name: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          phone: '',
          is_default: false
        });
        fetchAddresses();
      } else {
        throw new Error('Failed to add address');
      }
    } catch (error) {
      console.error('❌ Error adding address:', error);
      toast({
        title: "Error",
        description: "Failed to add address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setNewAddress({
      type: address.type,
      name: address.name,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      phone: address.phone,
      is_default: address.is_default
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateAddress = async () => {
    if (!user || !editingAddress) return;

    try {
      console.log('🔄 Updating address:', editingAddress.id);

      const updates = {
        type: newAddress.type,
        name: newAddress.name,
        address: newAddress.address,
        city: newAddress.city,
        state: newAddress.state,
        pincode: newAddress.pincode,
        phone: newAddress.phone,
        is_default: newAddress.is_default,
        user_id: user.id
      };

      console.log('📝 Address update data:', updates);

      const result = await addressService.updateAddress(editingAddress.id!, updates);

      if (result) {
        console.log('✅ Address updated successfully');
        toast({
          title: "Success",
          description: "Address updated successfully.",
        });
        setIsEditDialogOpen(false);
        setEditingAddress(null);
        setNewAddress({
          type: 'Home',
          name: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          phone: '',
          is_default: false
        });
        fetchAddresses();
      } else {
        throw new Error('Failed to update address');
      }
    } catch (error) {
      console.error('❌ Error updating address:', error);
      toast({
        title: "Error",
        description: "Failed to update address. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center border border-slate-200">
              <MapPin className="h-16 w-16 text-pink-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Please Login</h2>
              <p className="text-slate-900 mb-6">
                You need to be logged in to manage your addresses.
              </p>
              <Link to="/auth">
                <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600 mx-auto"></div>
              <p className="mt-4 text-slate-900">Loading addresses...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-slate-900 hover:text-slate-900">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">My Addresses</h1>
                <p className="text-slate-900">Manage your delivery addresses</p>
                <Link to="/address-demo" className="text-xs text-pink-600 hover:underline">
                  View Address Storage Demo
                </Link>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Address
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white text-slate-900 border-slate-200">
                <DialogHeader>
                  <DialogTitle>Add New Address</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        placeholder="Enter your full name"
                        className="bg-slate-50 border-slate-200"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        placeholder="Enter your phone number"
                        className="bg-slate-50 border-slate-200"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={newAddress.address}
                        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                        placeholder="Enter your complete address"
                        rows={3}
                        className="bg-slate-50 border-slate-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        placeholder="City"
                        className="bg-slate-50 border-slate-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        placeholder="State"
                        className="bg-slate-50 border-slate-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        placeholder="Pincode"
                        className="bg-slate-50 border-slate-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Address Type</Label>
                      <Select value={newAddress.type} onValueChange={(value) => setNewAddress({ ...newAddress, type: value })}>
                        <SelectTrigger className="bg-slate-50 border-slate-200">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200">
                          <SelectItem value="Home">Home</SelectItem>
                          <SelectItem value="Work">Work</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2 flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_default"
                        checked={newAddress.is_default}
                        onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                        className="rounded border-slate-300"
                      />
                      <Label htmlFor="is_default">Set as default address</Label>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-slate-200 text-slate-800">Cancel</Button>
                    <Button onClick={handleAddAddress} className="bg-pink-600 hover:bg-pink-700 text-white">Save Address</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Address List */}
          {addresses.length > 0 ? (
            <div className="space-y-4">
              {addresses.map((address) => (
                <Card key={address.id} className="bg-white border border-slate-200 shadow-sm">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                        <MapPin className="h-5 w-5 text-pink-600" />
                        {address.type}
                        {address.is_default && (
                          <span className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 border border-pink-200">
                            <Star className="h-3 w-3 fill-current" />
                            Default
                          </span>
                        )}
                      </CardTitle>
                      <div className="flex gap-2">
                        {!address.is_default && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSetDefault(address.id!)}
                            className="text-slate-700 hover:text-pink-600 hover:bg-pink-50"
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAddress(address)}
                          className="text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-700 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteAddress(address.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <p className="font-bold text-slate-900">{address.name}</p>
                      <p className="text-slate-900">{address.address}</p>
                      <p className="text-slate-900">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                      <p className="text-slate-900">Phone: {address.phone}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-lg shadow-lg p-8 text-center border border-slate-200">
              <MapPin className="h-16 w-16 text-pink-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">No addresses saved</h2>
              <p className="text-slate-900 mb-6">
                Add your delivery addresses to make checkout faster and easier.
              </p>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Address
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          )}
        </div>
      </div>

      {/* Edit Address Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white text-slate-900 border-slate-200">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="bg-slate-50 border-slate-200"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  className="bg-slate-50 border-slate-200"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-address">Address</Label>
                <Textarea
                  id="edit-address"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  placeholder="Enter your complete address"
                  rows={3}
                  className="bg-slate-50 border-slate-200"
                />
              </div>
              <div>
                <Label htmlFor="edit-city">City</Label>
                <Input
                  id="edit-city"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  placeholder="City"
                  className="bg-slate-50 border-slate-200"
                />
              </div>
              <div>
                <Label htmlFor="edit-state">State</Label>
                <Input
                  id="edit-state"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  placeholder="State"
                  className="bg-slate-50 border-slate-200"
                />
              </div>
              <div>
                <Label htmlFor="edit-pincode">Pincode</Label>
                <Input
                  id="edit-pincode"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                  placeholder="Pincode"
                  className="bg-slate-50 border-slate-200"
                />
              </div>
              <div>
                <Label htmlFor="edit-type">Address Type</Label>
                <Select value={newAddress.type} onValueChange={(value) => setNewAddress({ ...newAddress, type: value })}>
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-is_default"
                  checked={newAddress.is_default}
                  onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                  className="rounded border-slate-300"
                />
                <Label htmlFor="edit-is_default">Set as default address</Label>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-slate-200 text-slate-800">Cancel</Button>
              <Button onClick={handleUpdateAddress} className="bg-pink-600 hover:bg-pink-700 text-white">Update Address</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ProfileAddress;