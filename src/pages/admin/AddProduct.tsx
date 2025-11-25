import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Upload, X, Save } from 'lucide-react';

const CATEGORIES = [
    'Dream Catcher',
    'Embroidery',
    'Lippan Arts',
    'Resin Art Work',
    'Illustration',
    'Candles',
    'Calligraphy',
    'Hair Accessories'
];

const AddProduct = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        stock_quantity: '',
        catalogNumber: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (value: string) => {
        setFormData(prev => ({ ...prev, category: value }));
    };

    const handleImageAdd = () => {
        const url = prompt('Enter image URL (or leave empty for placeholder):');
        if (url) {
            setImages(prev => [...prev, url]);
        } else {
            setImages(prev => [...prev, 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80']);
        }
    };

    const handleImageRemove = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.price || !formData.category || !formData.catalogNumber) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (images.length === 0) {
            toast.error('Please add at least one image');
            return;
        }

        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Product added successfully!');
            navigate('/admin/dashboard');
        } catch (error) {
            toast.error('Failed to add product');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 font-sans selection:bg-pink-500/30">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex items-center justify-between animate-fade-in">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/admin/dashboard')}
                            className="text-slate-400 hover:text-white hover:bg-white/10"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <h1 className="text-3xl font-black text-white">Add New Product</h1>
                    </div>
                </div>

                <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl animate-slide-up">
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label htmlFor="name" className="text-slate-300 font-bold">Product Name *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Mystic Dream Catcher"
                                        className="bg-slate-900/50 border-white/10 focus:border-pink-500/50 text-white placeholder:text-slate-600 h-12 rounded-xl"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="catalogNumber" className="text-slate-300 font-bold">Catalog Number (SKU) *</Label>
                                    <Input
                                        id="catalogNumber"
                                        name="catalogNumber"
                                        value={formData.catalogNumber}
                                        onChange={handleInputChange}
                                        placeholder="e.g., DC-001"
                                        className="bg-slate-900/50 border-white/10 focus:border-pink-500/50 text-white placeholder:text-slate-600 h-12 rounded-xl"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="category" className="text-slate-300 font-bold">Category *</Label>
                                    <Select onValueChange={handleCategoryChange} value={formData.category}>
                                        <SelectTrigger className="bg-slate-900/50 border-white/10 text-white h-12 rounded-xl">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                                            {CATEGORIES.map(cat => (
                                                <SelectItem key={cat} value={cat} className="focus:bg-pink-600 focus:text-white">{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <Label htmlFor="price" className="text-slate-300 font-bold">Price (₹) *</Label>
                                        <Input
                                            id="price"
                                            name="price"
                                            type="number"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            placeholder="0.00"
                                            className="bg-slate-900/50 border-white/10 focus:border-pink-500/50 text-white placeholder:text-slate-600 h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="stock_quantity" className="text-slate-300 font-bold">Stock</Label>
                                        <Input
                                            id="stock_quantity"
                                            name="stock_quantity"
                                            type="number"
                                            value={formData.stock_quantity}
                                            onChange={handleInputChange}
                                            placeholder="0"
                                            className="bg-slate-900/50 border-white/10 focus:border-pink-500/50 text-white placeholder:text-slate-600 h-12 rounded-xl"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-3">
                                <Label htmlFor="description" className="text-slate-300 font-bold">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe your product..."
                                    className="bg-slate-900/50 border-white/10 focus:border-pink-500/50 text-white placeholder:text-slate-600 min-h-[150px] rounded-xl"
                                />
                            </div>

                            {/* Images */}
                            <div className="space-y-4">
                                <Label className="text-slate-300 font-bold">Product Images *</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {images.map((img, index) => (
                                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border border-white/10">
                                            <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => handleImageRemove(index)}
                                                className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={handleImageAdd}
                                        className="aspect-square rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-slate-400 hover:border-pink-500 hover:text-pink-500 hover:bg-pink-500/10 transition-all duration-300"
                                    >
                                        <Upload className="w-8 h-8 mb-2" />
                                        <span className="text-sm font-bold">Add Image</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end pt-8 border-t border-white/10">
                                <Button
                                    type="submit"
                                    className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white min-w-[180px] h-12 rounded-xl font-bold shadow-lg shadow-pink-600/20 hover:shadow-pink-600/40 transition-all hover:scale-105"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Adding...' : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Product
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AddProduct;
