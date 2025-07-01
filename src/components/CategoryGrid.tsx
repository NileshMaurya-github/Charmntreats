import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
	{
		name: 'Dream Catcher',
		image:
			'https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
		description: 'Handcrafted dream catchers for peaceful sleep',
		itemCount: '15+ items',
	},
	{
		name: 'Embroidery',
		image:
			'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
		description: 'Beautiful embroidered textiles and garments',
		itemCount: '25+ items',
	},
	{
		name: 'Lippan Arts',
		image:
			'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
		description: 'Traditional Lippan mirror work art',
		itemCount: '12+ items',
	},
	{
		name: 'Resin Art Work',
		image:
			'https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
		description: 'Stunning resin art pieces and coasters',
		itemCount: '30+ items',
	},
	{
		name: 'Illustration',
		image:
			'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
		description: 'Custom illustrations and artwork',
		itemCount: '20+ items',
	},
	{
		name: 'Candles',
		image:
			'https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
		description: 'Handpoured scented and decorative candles',
		itemCount: '18+ items',
	},
	{
		name: 'Calligraphy',
		image:
			'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
		description: 'Beautiful calligraphy and lettering art',
		itemCount: '10+ items',
	},
	{
		name: 'Hair Accessories',
		image:
			'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
		description: 'Handcrafted hair clips, bands and accessories',
		itemCount: '22+ items',
	},
	{
		name: 'Others',
		image:
			'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
		description: 'Unique miscellaneous handcrafted items',
		itemCount: '8+ items',
	},
];

const CategoryGrid = () => {
	const navigate = useNavigate();

	const handleCategoryClick = (categoryName: string) => {
		navigate(`/products?category=${encodeURIComponent(categoryName)}`);
	};

	return (
		<section className="py-12 bg-white">
			<div className="container mx-auto px-4">
				<div className="text-center mb-10">
					<h2 className="text-3xl font-bold text-slate-800 mb-3">
						Explore Our{' '}
						<span className="text-amber-600">Craft Categories</span>
					</h2>
					<p className="text-lg text-slate-600 max-w-2xl mx-auto">
						From intricate dream catchers to stunning resin art, discover
						handcrafted treasures in every category
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{categories.map((category) => (
						<Card
							key={category.name}
							className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg overflow-hidden"
							onClick={() => handleCategoryClick(category.name)}
						>
							<div className="relative overflow-hidden">
								<img
									src={category.image}
									alt={category.name}
									className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								<div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<div className="text-sm font-medium">{category.itemCount}</div>
									<div className="text-xs">Click to explore</div>
								</div>
							</div>

							<CardContent className="p-6">
								<h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-amber-600 transition-colors">
									{category.name}
								</h3>
								<p className="text-slate-600">{category.description}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
};

export default CategoryGrid;
