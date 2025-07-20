import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ImageUpload from './ImageUpload';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  catalog_number: string;
  images: string[];
  in_stock: boolean;
  featured: boolean;
  rating?: number;
  reviews?: number;
  stock_quantity?: number;
}

interface EditProductDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProduct: Product) => Promise<void>;
}

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

const EditProductDialog: React.FC<EditProductDialogProps> = ({
  product,
  isOpen,
  onClose,
  onSave
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    catalog_number: '',
    images: [] as string[],
    in_stock: true,
    featured: false,
    rating: '',
    reviews: '',
    stock_quantity: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        category: product.category,
        catalog_number: product.catalog_number,
        images: product.images || [],
        in_stock: product.in_stock,
        featured: product.featured || false,
        rating: product.rating?.toString() || '',
        reviews: product.reviews?.toString() || '',
        stock_quantity: product.stock_quantity?.toString() || ''
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || loading) return;

    setLoading(true);

    try {
      console.log('📝 Submitting product update form...');
      console.log('📦 Original product:', product);
      console.log('📝 Form data:', formData);

      // Validate form data
      if (!formData.name.trim()) {
        toast({
          title: "Validation Error",
          description: "Product name is required.",
          variant: "destructive",
        });
        return;
      }

      if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
        toast({
          title: "Validation Error",
          description: "Please enter a valid price greater than 0.",
          variant: "destructive",
        });
        return;
      }

      if (!formData.category) {
        toast({
          title: "Validation Error",
          description: "Please select a category.",
          variant: "destructive",
        });
        return;
      }

      const updatedProduct = {
        ...product,
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        catalog_number: formData.catalog_number.trim(),
        images: formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'],
        in_stock: formData.in_stock,
        featured: formData.featured,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        reviews: formData.reviews ? parseInt(formData.reviews) : 0,
        stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : 0
      };

      console.log('🔄 Calling onSave with updated product:', updatedProduct);
      await onSave(updatedProduct);
      console.log('✅ Product update completed successfully');
    } catch (error) {
      console.error('❌ Error in form submission:', error);
      toast({
        title: "Update Failed",
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-name">Product Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-price">Price (₹)</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="Enter price"
                required
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
              <Label htmlFor="edit-catalog">Catalog Number</Label>
              <Input
                id="edit-catalog"
                value={formData.catalog_number}
                onChange={(e) => handleInputChange('catalog_number', e.target.value)}
                placeholder="Enter catalog number"
                required
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
              <Label htmlFor="edit-stock">Stock Quantity</Label>
              <Input
                id="edit-stock"
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                placeholder="Enter stock quantity"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          <ImageUpload
            images={formData.images}
            onImagesChange={(images) => handleInputChange('images', images)}
            maxImages={5}
          />

          <div className="flex items-center space-x-6">
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

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700"
              disabled={loading || !formData.name || !formData.price || !formData.category}
            >
              {loading ? 'Updating...' : 'Update Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;