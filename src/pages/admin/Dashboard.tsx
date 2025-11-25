import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductService } from '@/services/productService';
import { Product } from '@/types/product';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Plus,
    Search,
    Edit,
    Trash2,
    LogOut,
    TrendingUp,
    DollarSign,
    Filter,
    ArrowUpRight,
    Activity
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

const CATEGORIES = [
    'All',
    'Dream Catcher',
    'Embroidery',
    'Lippan Arts',
    'Resin Art Work',
    'Illustration',
    'Candles',
    'Calligraphy',
    'Hair Accessories'
];

// Mock data for charts
const salesData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
];

const AdminDashboard = () => {
    const { user, signOut, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 124,
        totalRevenue: 45290,
        totalCustomers: 89
    });

    useEffect(() => {
        if (!user || !isAdmin) {
            navigate('/auth');
            return;
        }

        // Load products
        const allProducts = ProductService.getAllProducts();
        setProducts(allProducts);
        setStats(prev => ({ ...prev, totalProducts: allProducts.length }));
    }, [user, isAdmin, navigate]);

    const filteredProducts = products.filter(p => {
        const matchesSearch =
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.catalogNumber.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = activeCategory === 'All' || p.category === activeCategory;

        return matchesSearch && matchesCategory;
    });

    const handleDeleteProduct = (id: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            // In real app: ProductService.deleteProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex font-sans selection:bg-pink-500/30">
            {/* Sidebar */}
            <aside className="w-72 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 fixed h-full z-20 hidden md:flex flex-col">
                <div className="p-8 border-b border-white/10">
                    <h2 className="text-2xl font-black bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
                        Charmntreats
                    </h2>
                    <p className="text-xs text-slate-400 mt-2 font-bold tracking-wider uppercase">Admin Dashboard</p>
                </div>

                <nav className="p-6 space-y-2 flex-1">
                    <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/5 h-12 text-base font-medium">
                        <LayoutDashboard className="w-5 h-5 mr-3 text-pink-400" />
                        Overview
                    </Button>
                    <Button variant="ghost" className="w-full justify-start bg-gradient-to-r from-pink-600/20 to-rose-600/20 text-pink-300 border border-pink-500/30 h-12 text-base font-bold">
                        <Package className="w-5 h-5 mr-3" />
                        Products
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/5 h-12 text-base font-medium">
                        <ShoppingCart className="w-5 h-5 mr-3 text-blue-400" />
                        Orders
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/5 h-12 text-base font-medium">
                        <Users className="w-5 h-5 mr-3 text-green-400" />
                        Customers
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/5 h-12 text-base font-medium">
                        <Activity className="w-5 h-5 mr-3 text-purple-400" />
                        Analytics
                    </Button>
                </nav>

                <div className="p-6 border-t border-white/10">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 h-12 font-bold"
                        onClick={() => signOut()}
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-72 p-8 overflow-y-auto h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-fade-in">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2">Product Management</h1>
                        <p className="text-slate-400 text-lg">Manage your inventory, track stock, and update catalog.</p>
                    </div>
                    <Button onClick={() => navigate('/admin/products/add')} className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-lg shadow-pink-600/20 h-12 px-6 rounded-xl font-bold transition-all hover:scale-105">
                        <Plus className="w-5 h-5 mr-2" />
                        Add New Product
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 animate-slide-up">
                    <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl hover:border-pink-500/30 transition-all duration-300 group">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                                    <Package className="w-6 h-6 text-blue-400" />
                                </div>
                                <span className="flex items-center text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                                    +12% <ArrowUpRight className="w-3 h-3 ml-1" />
                                </span>
                            </div>
                            <p className="text-sm font-medium text-slate-400">Total Products</p>
                            <h3 className="text-3xl font-black text-white mt-1">{stats.totalProducts}</h3>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl hover:border-pink-500/30 transition-all duration-300 group">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors">
                                    <ShoppingCart className="w-6 h-6 text-purple-400" />
                                </div>
                                <span className="flex items-center text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                                    +8% <ArrowUpRight className="w-3 h-3 ml-1" />
                                </span>
                            </div>
                            <p className="text-sm font-medium text-slate-400">Total Orders</p>
                            <h3 className="text-3xl font-black text-white mt-1">{stats.totalOrders}</h3>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl hover:border-pink-500/30 transition-all duration-300 group">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-colors">
                                    <DollarSign className="w-6 h-6 text-green-400" />
                                </div>
                                <span className="flex items-center text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                                    +24% <ArrowUpRight className="w-3 h-3 ml-1" />
                                </span>
                            </div>
                            <p className="text-sm font-medium text-slate-400">Total Revenue</p>
                            <h3 className="text-3xl font-black text-white mt-1">₹{stats.totalRevenue.toLocaleString()}</h3>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl hover:border-pink-500/30 transition-all duration-300 group">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-orange-500/20 rounded-xl group-hover:bg-orange-500/30 transition-colors">
                                    <Users className="w-6 h-6 text-orange-400" />
                                </div>
                                <span className="flex items-center text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                                    +5% <ArrowUpRight className="w-3 h-3 ml-1" />
                                </span>
                            </div>
                            <p className="text-sm font-medium text-slate-400">Active Customers</p>
                            <h3 className="text-3xl font-black text-white mt-1">{stats.totalCustomers}</h3>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-white">Revenue Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={salesData}>
                                        <defs>
                                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                        <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} />
                                        <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                                            itemStyle={{ color: '#ec4899' }}
                                        />
                                        <Area type="monotone" dataKey="sales" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-white">Sales by Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={[
                                        { name: 'Dream Catcher', value: 45 },
                                        { name: 'Resin Art', value: 32 },
                                        { name: 'Candles', value: 28 },
                                        { name: 'Embroidery', value: 24 },
                                        { name: 'Others', value: 15 },
                                    ]}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                        <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} />
                                        <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />
                                        <Tooltip
                                            cursor={{ fill: '#334155', opacity: 0.2 }}
                                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                                        />
                                        <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Products Table */}
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <CardHeader className="border-b border-white/10 pb-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <CardTitle className="text-xl font-bold text-white">Product Inventory</CardTitle>

                            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                                {/* Category Filter Tabs */}
                                <Tabs defaultValue="All" value={activeCategory} onValueChange={setActiveCategory} className="w-full md:w-auto">
                                    <TabsList className="bg-slate-900/50 border border-white/10 h-10">
                                        {CATEGORIES.slice(0, 4).map(cat => (
                                            <TabsTrigger
                                                key={cat}
                                                value={cat}
                                                className="text-xs data-[state=active]:bg-pink-600 data-[state=active]:text-white text-slate-400"
                                            >
                                                {cat}
                                            </TabsTrigger>
                                        ))}
                                        <TabsTrigger value="More" className="text-xs data-[state=active]:bg-pink-600 data-[state=active]:text-white text-slate-400 hidden md:inline-flex">More...</TabsTrigger>
                                    </TabsList>
                                </Tabs>

                                <div className="relative w-full md:w-72">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search products..."
                                        className="pl-10 bg-slate-900/50 border-white/10 focus:border-pink-500/50 text-white placeholder:text-slate-500 h-10 rounded-lg"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Extended Category Filter for Mobile/Desktop */}
                        <div className="flex flex-wrap gap-2 mt-6">
                            {CATEGORIES.map(cat => (
                                <Button
                                    key={cat}
                                    variant={activeCategory === cat ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setActiveCategory(cat)}
                                    className={`text-xs rounded-full h-8 px-4 border-white/10 ${activeCategory === cat ? 'bg-pink-600 hover:bg-pink-700 text-white border-transparent' : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    {cat}
                                </Button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/10 hover:bg-white/5">
                                    <TableHead className="text-slate-400 font-bold">Product</TableHead>
                                    <TableHead className="text-slate-400 font-bold">Category</TableHead>
                                    <TableHead className="text-slate-400 font-bold">Price</TableHead>
                                    <TableHead className="text-slate-400 font-bold">Stock Status</TableHead>
                                    <TableHead className="text-right text-slate-400 font-bold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-16 text-slate-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <Package className="w-12 h-12 mb-4 opacity-20" />
                                                <p>No products found matching your criteria.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <TableRow key={product.id} className="border-white/10 hover:bg-white/5 transition-colors">
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10">
                                                        <img
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white">{product.name}</div>
                                                        <div className="text-xs text-slate-500 font-mono">{product.catalogNumber}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="bg-white/10 text-slate-300 hover:bg-white/20 border-transparent font-medium">
                                                    {product.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-bold text-white">₹{product.price.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2.5 h-2.5 rounded-full ${product.in_stock ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></span>
                                                    <span className={`text-sm font-medium ${product.in_stock ? 'text-green-400' : 'text-red-400'}`}>
                                                        {product.in_stock ? `${product.stock_quantity} in stock` : 'Out of stock'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default AdminDashboard;
