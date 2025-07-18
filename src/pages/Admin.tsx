import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Package, Users, ShoppingCart, Star, MessageSquare } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageUpload from '@/components/ImageUpload';
import HomepageImageUpload from '@/components/HomepageImageUpload';
import EditProductDialog from '@/components/EditProductDialog';
import CustomerDataSection from '@/components/CustomerDataSection';
import OrderManagement from '@/components/OrderManagement';
import CustomerManagement from '@/components/CustomerManagement';
import BlogManagement from '@/components/BlogManagement';
import customerDataService from '@/services/customerDataService';

const Admin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsCount, setTestimonialsCount] = useState(0);
  const [homepageContent, setHomepageContent] = useState(null);
  const [customerData, setCustomerData] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    catalog_number: '',
    images: [],
    in_stock: true,
    featured: false,
    rating: '',
    reviews: '',
    stock_quantity: ''
  });

  // New testimonial form state
  const [newTestimonial, setNewTestimonial] = useState({
    customer_name: '',
    customer_email: '',
    rating: '',
    review_text: '',
    is_featured: true
  });

  // Homepage content form state
  const [newHomepageContent, setNewHomepageContent] = useState({
    hero_title: '',
    hero_subtitle: '',
    hero_description: '',
    hero_image_url: ''
  });

  const categories = [
    'Dream Catcher',
    'Embroidery', 
    'Lippan Arts',
    'Resin Art Work',
    'Illustration',
    'Candles',
    'Calligraphy',
    'Hair Accessories',
    'Others'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;
      setProducts(productsData || []);

      // Fetch orders (last 3 months)
      console.log('🔍 Fetching orders...');
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .gte('created_at', threeMonthsAgo.toISOString())
        .order('created_at', { ascending: false });

      console.log('📊 Orders result:', { data: ordersData, error: ordersError });
      
      if (ordersError) {
        console.error('❌ Orders error:', ordersError);
        throw ordersError;
      }
      
      console.log('✅ Setting orders:', ordersData?.length || 0);
      setOrders(ordersData || []);

      // Fetch customer profiles (all logged-in users)
      console.log('🔍 Fetching customer profiles...');
      try {
        const { data: customersData, error: customersError } = await supabase
          .from('customer_profiles')
          .select('*')
          .order('last_login_at', { ascending: false });

        console.log('📊 Customers result:', { data: customersData, error: customersError });
        
        if (customersError && !customersError.message.includes('does not exist')) {
          console.error('❌ Customers error:', customersError);
          throw customersError;
        }
        
        console.log('✅ Setting customers:', customersData?.length || 0);
        setUsers(customersData || []);
      } catch (customerError) {
        console.log('⚠️ Customer profiles table not found, using empty array');
        setUsers([]);
      }

      // Fetch testimonials
      console.log('🔍 Fetching testimonials...');
      const { data: testimonialsData, error: testimonialsError } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('📊 Testimonials result:', { data: testimonialsData, error: testimonialsError });
      
      if (testimonialsError) {
        console.error('❌ Testimonials error:', testimonialsError);
        throw testimonialsError;
      }
      
      console.log('✅ Setting testimonials:', testimonialsData?.length || 0);
      setTestimonials(testimonialsData || []);
      setTestimonialsCount(testimonialsData?.length || 0);

      // Fetch homepage content
      const { data: homepageData, error: homepageError } = await supabase
        .from('homepage_content')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (homepageError && homepageError.code !== 'PGRST116') {
        console.error('Error fetching homepage content:', homepageError);
      } else if (homepageData) {
        setHomepageContent(homepageData);
        setNewHomepageContent({
          hero_title: homepageData.hero_title,
          hero_subtitle: homepageData.hero_subtitle,
          hero_description: homepageData.hero_description,
          hero_image_url: homepageData.hero_image_url
        });
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        catalog_number: newProduct.catalog_number,
        images: newProduct.images.length > 0 ? newProduct.images : ['https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'],
        in_stock: newProduct.in_stock,
        featured: newProduct.featured,
        rating: newProduct.rating ? parseFloat(newProduct.rating) : null,
        reviews: newProduct.reviews ? parseInt(newProduct.reviews) : 0,
        stock_quantity: newProduct.stock_quantity ? parseInt(newProduct.stock_quantity) : 0
      };

      const { error } = await supabase
        .from('products')
        .insert([productData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product added successfully!",
      });

      // Reset form
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        catalog_number: '',
        images: [],
        in_stock: true,
        featured: false,
        rating: '',
        reviews: '',
        stock_quantity: ''
      });

      fetchData();
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddTestimonial = async () => {
    try {
      const testimonialData = {
        customer_name: newTestimonial.customer_name,
        customer_email: newTestimonial.customer_email,
        rating: parseInt(newTestimonial.rating),
        review_text: newTestimonial.review_text,
        is_featured: newTestimonial.is_featured
      };

      const { error } = await supabase
        .from('testimonials')
        .insert([testimonialData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Testimonial added successfully!",
      });

      // Reset form
      setNewTestimonial({
        customer_name: '',
        customer_email: '',
        rating: '',
        review_text: '',
        is_featured: true
      });

      fetchData();
    } catch (error) {
      console.error('Error adding testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to add testimonial. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTestimonial = async (testimonialId) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', testimonialId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Testimonial deleted successfully!",
      });

      fetchData();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to delete testimonial. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleTestimonialFeatured = async (testimonialId, currentFeatured) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_featured: !currentFeatured })
        .eq('id', testimonialId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Testimonial ${!currentFeatured ? 'featured' : 'unfeatured'} successfully!`,
      });

      fetchData();
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to update testimonial. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product deleted successfully!",
      });

      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order status updated successfully!",
      });

      fetchData();
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateHomepageContent = async () => {
    try {
      if (homepageContent) {
        // Update existing content
        const { error } = await supabase
          .from('homepage_content')
          .update({
            hero_title: newHomepageContent.hero_title,
            hero_subtitle: newHomepageContent.hero_subtitle,
            hero_description: newHomepageContent.hero_description,
            hero_image_url: newHomepageContent.hero_image_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', homepageContent.id);

        if (error) throw error;
      } else {
        // Create new content
        const { error } = await supabase
          .from('homepage_content')
          .insert([{
            hero_title: newHomepageContent.hero_title,
            hero_subtitle: newHomepageContent.hero_subtitle,
            hero_description: newHomepageContent.hero_description,
            hero_image_url: newHomepageContent.hero_image_url,
            is_active: true
          }]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Homepage content updated successfully!",
      });

      fetchData();
    } catch (error) {
      console.error('Error updating homepage content:', error);
      toast({
        title: "Error",
        description: "Failed to update homepage content. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard - Charmntreats</h1>
          <p className="text-gray-600">Manage your store products, orders, customers, testimonials, and homepage content</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-amber-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-amber-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{orders.length || 'Loading...'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-amber-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-amber-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Testimonials</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {testimonialsCount || testimonials.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="homepage">Homepage</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {/* Add Product Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Product
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      placeholder="Enter price"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="catalog_number">Catalog Number</Label>
                    <Input
                      id="catalog_number"
                      value={newProduct.catalog_number}
                      onChange={(e) => setNewProduct({...newProduct, catalog_number: e.target.value})}
                      placeholder="Enter catalog number"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      placeholder="Enter product description"
                      rows={3}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <ImageUpload
                      images={newProduct.images}
                      onImagesChange={(images) => setNewProduct({...newProduct, images})}
                      maxImages={5}
                    />
                  </div>

                  <div>
                    <Label htmlFor="rating">Rating (1-5)</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={newProduct.rating}
                      onChange={(e) => setNewProduct({...newProduct, rating: e.target.value})}
                      placeholder="Enter rating"
                    />
                  </div>

                  <div>
                    <Label htmlFor="stock_quantity">Stock Quantity</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      min="0"
                      value={newProduct.stock_quantity}
                      onChange={(e) => setNewProduct({...newProduct, stock_quantity: e.target.value})}
                      placeholder="Enter stock quantity"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="in_stock"
                        checked={newProduct.in_stock}
                        onCheckedChange={(checked) => setNewProduct({...newProduct, in_stock: checked})}
                      />
                      <Label htmlFor="in_stock">In Stock</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={newProduct.featured}
                        onCheckedChange={(checked) => setNewProduct({...newProduct, featured: checked})}
                      />
                      <Label htmlFor="featured">Featured</Label>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleAddProduct} 
                  className="mt-4 bg-amber-600 hover:bg-amber-700"
                  disabled={!newProduct.name || !newProduct.price || !newProduct.category}
                >
                  Add Product
                </Button>
              </CardContent>
            </Card>

            {/* Products List */}
            <Card>
              <CardHeader>
                <CardTitle>Products ({products.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.category}</p>
                          <p className="text-sm font-medium">₹{product.price}</p>
                          <p className="text-xs text-gray-500">Stock: {product.stock_quantity || 0}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={product.in_stock ? "default" : "destructive"}>
                          {product.in_stock ? "In Stock" : "Out of Stock"}
                        </Badge>
                        {product.featured && <Badge className="bg-amber-500">Featured</Badge>}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <CustomerDataSection />
          </TabsContent>

          <TabsContent value="blog" className="space-y-6">
            <BlogManagement />
          </TabsContent>

          <TabsContent value="testimonials" className="space-y-6">
            {/* Add Testimonial Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Testimonial
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer_name">Customer Name</Label>
                    <Input
                      id="customer_name"
                      value={newTestimonial.customer_name}
                      onChange={(e) => setNewTestimonial({...newTestimonial, customer_name: e.target.value})}
                      placeholder="Enter customer name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customer_email">Customer Email (Optional)</Label>
                    <Input
                      id="customer_email"
                      type="email"
                      value={newTestimonial.customer_email}
                      onChange={(e) => setNewTestimonial({...newTestimonial, customer_email: e.target.value})}
                      placeholder="Enter customer email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="rating">Rating (1-5)</Label>
                    <Select value={newTestimonial.rating} onValueChange={(value) => setNewTestimonial({...newTestimonial, rating: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Star</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={newTestimonial.is_featured}
                      onCheckedChange={(checked) => setNewTestimonial({...newTestimonial, is_featured: checked})}
                    />
                    <Label htmlFor="is_featured">Featured</Label>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="review_text">Review Text</Label>
                    <Textarea
                      id="review_text"
                      value={newTestimonial.review_text}
                      onChange={(e) => setNewTestimonial({...newTestimonial, review_text: e.target.value})}
                      placeholder="Enter review text"
                      rows={3}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleAddTestimonial} 
                  className="mt-4 bg-amber-600 hover:bg-amber-700"
                  disabled={!newTestimonial.customer_name || !newTestimonial.rating || !newTestimonial.review_text}
                >
                  Add Testimonial
                </Button>
              </CardContent>
            </Card>

            {/* Testimonials List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Testimonials ({testimonials.length})</span>
                  <Button 
                    onClick={fetchData} 
                    variant="outline" 
                    size="sm"
                    className="ml-2"
                  >
                    🔄 Refresh Data
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{testimonial.customer_name}</h3>
                          <div className="flex items-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-600">{testimonial.review_text}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={testimonial.is_featured ? "default" : "secondary"}>
                            {testimonial.is_featured ? "Featured" : "Not Featured"}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleTestimonialFeatured(testimonial.id, testimonial.is_featured)}
                          >
                            {testimonial.is_featured ? 'Unfeature' : 'Feature'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTestimonial(testimonial.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Created: {new Date(testimonial.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="homepage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Homepage Content Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="hero_title">Hero Title</Label>
                    <Input
                      id="hero_title"
                      value={newHomepageContent.hero_title}
                      onChange={(e) => setNewHomepageContent({...newHomepageContent, hero_title: e.target.value})}
                      placeholder="Enter hero title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                    <Input
                      id="hero_subtitle"
                      value={newHomepageContent.hero_subtitle}
                      onChange={(e) => setNewHomepageContent({...newHomepageContent, hero_subtitle: e.target.value})}
                      placeholder="Enter hero subtitle"
                    />
                  </div>

                  <div>
                    <Label htmlFor="hero_description">Hero Description</Label>
                    <Textarea
                      id="hero_description"
                      value={newHomepageContent.hero_description}
                      onChange={(e) => setNewHomepageContent({...newHomepageContent, hero_description: e.target.value})}
                      placeholder="Enter hero description"
                      rows={3}
                    />
                  </div>

                  <HomepageImageUpload
                    imageUrl={newHomepageContent.hero_image_url}
                    onImageChange={(url) => setNewHomepageContent({...newHomepageContent, hero_image_url: url})}
                  />

                  <Button 
                    onClick={handleUpdateHomepageContent} 
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    Update Homepage Content
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Product Dialog */}
        <EditProductDialog
          product={editingProduct}
          isOpen={isEditDialogOpen}
          onClose={handleCloseEditDialog}
          onProductUpdated={fetchData}
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default Admin;