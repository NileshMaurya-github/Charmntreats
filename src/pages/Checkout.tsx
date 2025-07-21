import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, CreditCard, Truck, MapPin, Phone, User, Plus, Star } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { sendOrderEmails } from '@/services/simpleEmailService';
import { orderStorageService } from '@/services/orderStorageService';
import addressService, { Address } from '@/services/addressService';

interface OrderData {
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: any[];
  totalAmount: number;
  paymentMethod: 'cod' | 'online';
  orderDate: string;
  orderId: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [saveNewAddress, setSaveNewAddress] = useState(true);
  
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  
  // Update email whenever user changes
  useEffect(() => {
    if (user?.email) {
      setCustomerInfo(prev => ({
        ...prev,
        email: user.email || ''
      }));
    }
  }, [user?.email]);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  useEffect(() => {
    if (user) {
      loadSavedAddresses();
    }
  }, [user]);

  // Load saved addresses from database
  const loadSavedAddresses = async () => {
    if (!user) return;
    
    try {
      console.log('🔍 Fetching saved addresses for user:', user.id);
      
      // Use our permanent address service to get addresses
      const addresses = await addressService.getUserAddresses(user.id);
      
      console.log(`📋 Found ${addresses?.length || 0} saved addresses`);
      
      // Debug log all addresses
      addresses?.forEach((addr, index) => {
        console.log(`Address ${index + 1}: ID=${addr.id}, Name=${addr.name}, Default=${addr.is_default}`);
      });
      
      if (addresses && addresses.length > 0) {
        setSavedAddresses(addresses);
        
        // Auto-select default address if available
        const defaultAddress = addresses.find(addr => addr.is_default);
        if (defaultAddress) {
          console.log('✅ Using default address for checkout:', defaultAddress.id);
          setSelectedAddressId(defaultAddress.id!);
          fillAddressForm(defaultAddress);
          setShowNewAddressForm(false); // Hide new address form when default is available
        } else {
          // If no default, select the most recently used address
          const mostRecentAddress = addresses[0]; // Already sorted by updated_at desc
          console.log('✅ Using most recent address for checkout:', mostRecentAddress.id);
          setSelectedAddressId(mostRecentAddress.id!);
          fillAddressForm(mostRecentAddress);
          setShowNewAddressForm(false); // Hide new address form when addresses are available
        }
      } else {
        // No saved addresses, show new address form
        console.log('ℹ️ No saved addresses found, showing new address form');
        setShowNewAddressForm(true);
      }
    } catch (error) {
      console.error('❌ Error loading addresses:', error);
      setShowNewAddressForm(true); // Show new address form on error
      toast({
        title: "Address Loading Error",
        description: "Could not load your saved addresses. You can still enter a new address.",
        variant: "destructive",
      });
    }
  };

  const fillAddressForm = (address: Address) => {
    console.log('🔄 Filling address form with saved address:', address.id);
    
    // Make sure we're updating all the required fields
    setCustomerInfo(prev => ({
      ...prev,
      fullName: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode
    }));
    
    console.log('✅ Address form filled with saved data');
  };

  const handleAddressSelection = (addressId: string) => {
    console.log('🔍 Selected address ID:', addressId);
    setSelectedAddressId(addressId);
    
    const selectedAddress = savedAddresses.find(addr => addr.id === addressId);
    if (selectedAddress) {
      console.log('✅ Found selected address:', selectedAddress);
      fillAddressForm(selectedAddress);
      setShowNewAddressForm(false);
    } else {
      console.error('❌ Could not find address with ID:', addressId);
    }
  };

  const handleNewAddressClick = () => {
    setSelectedAddressId('');
    setShowNewAddressForm(true);
    setSaveNewAddress(true); // Default to saving the address
    
    // Clear form for new address but keep the email
    setCustomerInfo(prev => ({
      ...prev,
      fullName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: ''
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const required = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!customerInfo[field as keyof typeof customerInfo]) {
        toast({
          title: "Missing Information",
          description: `Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          variant: "destructive",
        });
        return false;
      }
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }
    
    // Validate phone
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(customerInfo.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const generateOrderId = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CT${timestamp.slice(-6)}${random}`;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Handle address saving/updating
      if (user) {
        // Case 1: User is entering a new address and wants to save it
        if (showNewAddressForm && saveNewAddress && customerInfo.fullName && customerInfo.address) {
          try {
            console.log('💾 Saving new address to user profile...');
            
            // Check if this is the first address (make it default)
            const makeDefault = savedAddresses.length === 0;
            
            const newAddress: Omit<Address, 'id' | 'created_at' | 'updated_at'> = {
              user_id: user.id,
              type: 'Home',
              name: customerInfo.fullName,
              address: customerInfo.address,
              city: customerInfo.city,
              state: customerInfo.state,
              pincode: customerInfo.pincode,
              phone: customerInfo.phone,
              is_default: makeDefault
            };
            
            console.log('📝 New address data:', newAddress);
            
            // Use the permanent address service to save the address
            const savedAddress = await addressService.addAddress(newAddress);
              
            if (savedAddress) {
              console.log('✅ New address saved successfully with ID:', savedAddress.id);
              
              // Update local state with the new address
              setSavedAddresses(prev => [savedAddress, ...prev]);
              setSelectedAddressId(savedAddress.id!);
              
              toast({
                title: "Address Saved",
                description: "Your address has been saved for future orders.",
              });
            } else {
              throw new Error('Failed to save address - null response');
            }
          } catch (error) {
            console.error('❌ Error saving address:', error);
            toast({
              title: "Address Save Warning",
              description: "Your order will be processed, but we couldn't save this address for future use.",
              variant: "destructive"
            });
            // Don't block order placement if address saving fails
          }
        } 
        // Case 2: User is using an existing address
        else if (!showNewAddressForm && selectedAddressId) {
          try {
            console.log('🔄 Updating last used timestamp for selected address:', selectedAddressId);
            const selectedAddress = savedAddresses.find(addr => addr.id === selectedAddressId);
            if (selectedAddress) {
              // Update the address to mark it as recently used
              const updatedAddress = await addressService.updateAddress(selectedAddressId, {
                updated_at: new Date().toISOString(),
                user_id: user.id
              });
              
              if (updatedAddress) {
                console.log('✅ Address usage timestamp updated');
              } else {
                console.warn('⚠️ Could not update address timestamp, but continuing with order');
              }
            }
          } catch (error) {
            console.error('❌ Error updating address usage:', error);
            // Don't block order placement if address update fails
          }
        }
        // Case 3: User is entering a new address but doesn't want to save it
        else if (showNewAddressForm && !saveNewAddress) {
          console.log('ℹ️ User chose not to save the new address');
        }
      }
      
      const orderId = generateOrderId();
      const shippingCost = getTotalPrice() >= 500 ? 0 : 50;
      const totalAmount = getTotalPrice() + shippingCost;
      
      const orderData: OrderData = {
        customerInfo,
        items: cartItems,
        totalAmount,
        paymentMethod,
        orderDate: new Date().toISOString(),
        orderId
      };

      // Send order confirmation emails using the email service
      console.log('📧 Sending order confirmation emails...');
      try {
        const emailsSent = await sendOrderEmails(orderData);
        
        if (emailsSent) {
          console.log('✅ Order confirmation emails sent successfully!');
          toast({
            title: "Emails Sent!",
            description: "Order confirmation emails have been sent to you and our store.",
          });
        } else {
          console.error('❌ Failed to send some confirmation emails');
          toast({
            title: "Email Warning",
            description: "Order placed but some confirmation emails may not have been sent.",
            variant: "destructive",
          });
        }
      } catch (emailError) {
        console.error('❌ Email service error:', emailError);
        toast({
          title: "Email Warning", 
          description: "Order placed but confirmation emails may not have been sent.",
          variant: "destructive",
        });
      }

      // Store order using the order storage service
      console.log('💾 Storing order...');
      try {
        const orderStored = await orderStorageService.storeOrder(orderData);
        
        if (orderStored) {
          console.log('✅ Order stored successfully!');
        } else {
          console.error('❌ Failed to store order');
          toast({
            title: "Storage Warning",
            description: "Order placed but may not be saved. Please contact support if needed.",
            variant: "destructive",
          });
        }
      } catch (storeError) {
        console.error('❌ Storage service error:', storeError);
        toast({
          title: "Storage Warning",
          description: "Order placed but may not be saved. Please contact support if needed.",
          variant: "destructive",
        });
      }

      // Clear cart
      clearCart();
      
      // Reload addresses to ensure they're up to date for next order
      if (user) {
        try {
          await loadSavedAddresses();
        } catch (error) {
          console.error('Failed to reload addresses after order:', error);
        }
      }
      
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${orderId} has been confirmed. Check your email for details.`,
      });

      // Navigate to order confirmation page
      navigate(`/order-confirmation/${orderId}`, { 
        state: { orderData } 
      });

    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const shippingCost = getTotalPrice() >= 500 ? 0 : 50;
  const totalAmount = getTotalPrice() + shippingCost;

  return (
    <div className="min-h-screen bg-floral-gradient page-transition">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-slate-600 hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Button>
          <span className="text-slate-400">•</span>
          <span className="text-black font-medium">Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Saved Addresses Selection */}
                {user && savedAddresses.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-lg font-medium">Your Saved Addresses</Label>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        {savedAddresses.length} saved {savedAddresses.length === 1 ? 'address' : 'addresses'} available
                      </span>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2 text-green-700">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm font-medium">Your saved addresses are automatically used for faster checkout</span>
                      </div>
                    </div>
                    
                    <RadioGroup 
                      value={selectedAddressId} 
                      onValueChange={handleAddressSelection}
                      className="space-y-3 mt-2"
                    >
                      {savedAddresses.map((address) => (
                        <div
                          key={address.id}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedAddressId === address.id
                              ? 'border-pink-500 bg-pink-50 shadow-md'
                              : 'border-gray-200 hover:border-pink-300'
                          }`}
                          onClick={() => handleAddressSelection(address.id!)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`font-medium text-sm px-2 py-1 rounded ${
                                address.type === 'Home' ? 'bg-blue-100 text-blue-700' : 
                                address.type === 'Work' ? 'bg-green-100 text-green-700' : 
                                'bg-purple-100 text-purple-700'
                              }`}>{address.type}</div>
                              {address.is_default && (
                                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-current" />
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="flex items-center">
                              {selectedAddressId === address.id && (
                                <span className="text-xs text-pink-600 font-medium mr-2">Selected</span>
                              )}
                              <RadioGroupItem
                                value={address.id!}
                                id={`address-${address.id}`}
                                checked={selectedAddressId === address.id}
                              />
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 mt-2">
                            <div className="font-medium">{address.name}</div>
                            <div className="mt-1">{address.address}</div>
                            <div className="mt-1">{address.city}, {address.state} - {address.pincode}</div>
                            <div className="mt-1 flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {address.phone}
                            </div>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                    
                    <div className="flex gap-2 mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleNewAddressClick}
                        className="flex-1"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Use New Address
                      </Button>
                      
                      <Link to="/profile/address" target="_blank">
                        <Button
                          type="button"
                          variant="secondary"
                          className="bg-pink-100 text-pink-700 hover:bg-pink-200"
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          Manage Addresses
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                {/* New Address Form */}
                {(showNewAddressForm || savedAddresses.length === 0) && (
                  <div className="space-y-4">
                    {savedAddresses.length > 0 && (
                      <div className="border-t pt-4">
                        <Label className="text-base font-medium">New Address</Label>
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={customerInfo.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Enter full name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={customerInfo.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Street Address *</Label>
                      <Textarea
                        id="address"
                        value={customerInfo.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Enter your complete address"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={customerInfo.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={customerInfo.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          value={customerInfo.pincode}
                          onChange={(e) => handleInputChange('pincode', e.target.value)}
                          placeholder="Pincode"
                        />
                      </div>
                    </div>

                    {/* Save Address Option */}
                    {user && (
                      <div className="flex items-center space-x-3 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                        <input
                          type="checkbox"
                          id="saveAddress"
                          checked={saveNewAddress}
                          onChange={(e) => setSaveNewAddress(e.target.checked)}
                          className="rounded text-pink-600 w-6 h-6"
                        />
                        <div>
                          <Label htmlFor="saveAddress" className="text-base font-medium cursor-pointer text-blue-800">
                            Save this address for future orders
                          </Label>
                          <p className="text-sm text-blue-600 mt-1">
                            Your address will be securely saved so you don't have to re-enter it next time.
                            This will also appear in your "My Address" section.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={(value: 'cod' | 'online') => setPaymentMethod(value)}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
                      <Truck className="h-5 w-5 text-black" />
                      Cash on Delivery (COD)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="h-5 w-5 text-black" />
                      Online Payment
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-slate-600">Qty: {item.quantity}</div>
                      </div>
                      <div className="font-medium">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                      {shippingCost === 0 ? 'Free' : `₹${shippingCost}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <Button 
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full btn-dark-pink h-12"
                >
                  {loading ? 'Placing Order...' : `Place Order - ₹${totalAmount.toLocaleString()}`}
                </Button>

                <div className="text-xs text-slate-500 text-center">
                  By placing this order, you agree to our terms and conditions
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;