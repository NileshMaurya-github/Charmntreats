
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ImageUpload from './ImageUpload';

interface EditProductDialogProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: () => void;
}

const EditProductDialog = ({ product, isOpen, onClose, onProductUpdated }: EditProductDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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
    if (product && isOpen) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        category: product.category || '',
        catalog_number: product.catalog_number || '',
        images: product.images || [],
        in_stock: product.in_stock ?? true,
        featured: product.featured ?? false,
        rating: product.rating?.toString() || '',
        reviews: product.reviews?.toString() || '',
        stock_quantity: product.stock_quantity?.toString() || ''
      });
    }
  }, [product, isOpen]);

  const handleUpdateProduct = async () => {
    if (!product?.id) return;

    setLoading(true);
    try {
      const updateData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        catalog_number: formData.catalog_number,
        images: formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'],
        in_stock: formData.in_stock,
        featured: formData.featured,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        reviews: formData.reviews ? parseInt(formData.reviews) : 0,
        stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : 0,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', product.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product updated successfully!",
      });

      onProductUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div>
            <Label htmlFor="edit-name">Product Name</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter product name"
            />
          </div>

          <div>
            <Label htmlFor="edit-price">Price (₹)</Label>
            <Input
              id="edit-price"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="Enter price"
            />
          </div>

          <div>
            <Label htmlFor="edit-category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
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
            <Label htmlFor="edit-catalog-number">Catalog Number</Label>
            <Input
              id="edit-catalog-number"
              value={formData.catalog_number}
              onChange={(e) => handleInputChange('catalog_number', e.target.value)}
              placeholder="Enter catalog number"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          <div className="md:col-span-2">
            <ImageUpload
              images={formData.images}
              onImagesChange={(images) => handleInputChange('images', images)}
              maxImages={5}
            />
          </div>

          <div>
            <Label htmlFor="edit-rating">Rating (1-5)</Label>
            <Input
              id="edit-rating"
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={(e) => handleInputChange('rating', e.target.value)}
              placeholder="Enter rating"
            />
          </div>

          <div>
            <Label htmlFor="edit-reviews">Number of Reviews</Label>
            <Input
              id="edit-reviews"
              type="number"
              min="0"
              value={formData.reviews}
              onChange={(e) => handleInputChange('reviews', e.target.value)}
              placeholder="Enter number of reviews"
            />
          </div>

          <div>
            <Label htmlFor="edit-stock-quantity">Stock Quantity</Label>
            <Input
              id="edit-stock-quantity"
              type="number"
              min="0"
              value={formData.stock_quantity}
              onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
              placeholder="Enter stock quantity"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-in-stock"
                checked={formData.in_stock}
                onCheckedChange={(checked) => handleInputChange('in_stock', checked)}
              />
              <Label htmlFor="edit-in-stock">In Stock</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange('featured', checked)}
              />
              <Label htmlFor="edit-featured">Featured</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateProduct} 
            className="bg-amber-600 hover:bg-amber-700"
            disabled={loading || !formData.name || !formData.price || !formData.category}
          >
            {loading ? 'Updating...' : 'Update Product'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
