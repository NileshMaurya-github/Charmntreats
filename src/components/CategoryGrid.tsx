import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import StaticCategoryImage from './RotatingCategoryImage';
import { fetchCategoryData, CategoryData } from '@/services/categoryService';

// Static category information with descriptions
const categoryDescriptions: Record<string, string> = {
	'Dream Catcher': 'Handcrafted dream catchers for peaceful sleep',
	'Embroidery': 'Beautiful embroidered textiles and garments',
	'Lippan Arts': 'Traditional Lippan mirror work art',
	'Resin Art Work': 'Stunning resin art pieces and coasters',
	'Illustration': 'Custom illustrations and artwork',
	'Candles': 'Handpoured scented and decorative candles',
	'Calligraphy': 'Beautiful calligraphy and lettering art',
	'Hair Accessories': 'Handcrafted hair clips, bands and accessories',
	'Others': 'Unique miscellaneous handcrafted items',
};

// Default categories to show even if no products exist
const defaultCategories = [
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

const CategoryGrid = () => {
	const navigate = useNavigate();
	const [categories, setCategories] = useState<CategoryData[]>(
		// Initialize with default categories immediately
		defaultCategories.map(name => ({ name, count: 0, images: [] }))
	);

	useEffect(() => {
		// Update document title to remove loading state
		document.title = 'Charmntreats - Handcrafted with Love';
		
		// Load real data in background and update
		loadCategoryData();
	}, []);

	const loadCategoryData = async () => {
		try {
			const categoryData = await fetchCategoryData();
			
			// Create a map of existing category data
			const categoryMap = new Map(categoryData.map(cat => [cat.name, cat]));
			
			// Update categories with real product images
			const allCategories = defaultCategories.map(categoryName => {
				const existingData = categoryMap.get(categoryName);
				return {
					name: categoryName,
					count: existingData?.count || 0,
					images: existingData?.images || []
				};
			});
			
			setCategories(allCategories);
		} catch (error) {
			console.error('Error loading category data:', error);
			// Keep default categories if error occurs
		}
	};

	const handleCategoryClick = (categoryName: string) => {
		navigate(`/products?category=${encodeURIComponent(categoryName)}`);
	};

	// Remove loading state - show categories immediately

	return (
		<section className="py-12 bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 relative overflow-hidden">
			{/* Premium Animated Background Elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{/* Large Glowing Orbs */}
				<div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-full animate-float blur-3xl"></div>
				<div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full animate-float blur-3xl" style={{ animationDelay: '4s' }}></div>
				
				{/* Floating Particles */}
				<div className="absolute top-[15%] left-[20%] w-2 h-2 bg-pink-400 rounded-full animate-twinkle"></div>
				<div className="absolute top-[35%] right-[30%] w-3 h-3 bg-rose-400 rounded-full animate-twinkle" style={{ animationDelay: '1.2s' }}></div>
				<div className="absolute bottom-[25%] left-[40%] w-2 h-2 bg-purple-400 rounded-full animate-twinkle" style={{ animationDelay: '2.4s' }}></div>
				<div className="absolute top-[55%] right-[20%] w-2 h-2 bg-pink-300 rounded-full animate-twinkle" style={{ animationDelay: '3.6s' }}></div>
				
				{/* Grid Pattern */}
				<div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40"></div>
			</div>

			<div className="container mx-auto px-4 relative z-10">
				{/* God-Level Header */}
				<div className="text-center mb-12">
					{/* Premium Badge */}
					<div className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-pink-500/30 mb-6 animate-fade-in-up hover:scale-105 transition-transform duration-300">
						<div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent rounded-full shadow-[0_0_15px_rgba(244,114,182,0.8)]"></div>
						<span className="text-sm font-black tracking-[0.3em] uppercase bg-gradient-to-r from-pink-200 via-rose-200 to-pink-100 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(244,114,182,0.6)]">
							Collections
						</span>
						<div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-rose-400 to-transparent rounded-full shadow-[0_0_15px_rgba(244,114,182,0.8)]"></div>
					</div>
					
					{/* 3D Title with Multiple Layers */}
					<h2 className="text-4xl md:text-6xl font-black mb-6 animate-fade-in-up animate-delay-200">
						<span className="block mb-2 bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]" style={{ textShadow: '0 0 40px rgba(255,182,193,0.5)' }}>
							Explore Our{' '}
						</span>
						<span className="block relative inline-block group">
							<span className="relative z-10 bg-gradient-to-r from-pink-300 via-rose-400 to-pink-500 bg-clip-text text-transparent animate-shimmer font-extrabold" style={{ textShadow: '0 0 60px rgba(236,72,153,0.9), 0 0 100px rgba(244,114,182,0.7), 0 0 140px rgba(251,207,232,0.5)' }}>
								Craft Categories
							</span>
							{/* 3D Shadow Layers */}
							<span className="absolute top-1 left-1 bg-gradient-to-r from-pink-600 via-rose-700 to-pink-800 bg-clip-text text-transparent opacity-30 blur-sm" aria-hidden="true">
								Craft Categories
							</span>
							<span className="absolute top-2 left-2 bg-gradient-to-r from-pink-800 via-rose-900 to-pink-900 bg-clip-text text-transparent opacity-20 blur-md" aria-hidden="true">
								Craft Categories
							</span>
							{/* Massive Glow */}
							<div className="absolute -inset-8 bg-gradient-to-r from-pink-500/30 via-rose-500/40 to-pink-500/30 rounded-3xl blur-3xl group-hover:blur-2xl transition-all duration-500 -z-10"></div>
						</span>
					</h2>
					
          
          <p className="text-lg text-white max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-400 font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            ✨ Discover handcrafted treasures across all categories ✨
          </p>
        </div>				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{categories.map((category, index) => (
						<Card
							key={category.name}
							className="group cursor-pointer bg-white/10 backdrop-blur-xl border border-white/20 hover:border-pink-400/60 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-pink-500/30 transition-all duration-500 hover:-translate-y-2 animate-fade-in-up hover:scale-105"
							style={{ animationDelay: `${(index * 0.1) + 0.6}s` }}
							onClick={() => handleCategoryClick(category.name)}
						>
							<div className="relative overflow-hidden rounded-t-2xl">
								{/* Premium Gradient Overlay */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-all duration-500 z-10"></div>
								
								{/* Glowing Border Effect */}
								<div className="absolute inset-0 border-2 border-transparent group-hover:border-pink-400/50 rounded-t-2xl transition-all duration-500 z-20 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.6)]"></div>
								
								{/* Category image with enhanced zoom */}
								<StaticCategoryImage
									images={category.images}
									categoryName={category.name}
									className="w-full h-48 object-cover group-hover:scale-125 transition-transform duration-700 ease-out filter brightness-90 group-hover:brightness-110"
								/>
								
								{/* Premium Floating Badge */}
								<div className="absolute top-3 right-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full px-4 py-1.5 shadow-2xl shadow-pink-500/50 z-30 border-2 border-white/40 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
									<span className="text-xs font-black text-white drop-shadow-lg tracking-wide">
										{category.count > 0 ? `${category.count}+ items` : '✨ New'}
									</span>
								</div>
								
								{/* God-Level Hover Overlay */}
								<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
									<div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
										<div className="relative inline-block mb-3">
											{/* Outer Glow Ring */}
											<div className="absolute -inset-4 bg-gradient-to-r from-pink-500/40 via-rose-500/60 to-pink-500/40 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
											{/* Icon Container */}
											<div className="relative w-16 h-16 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border-2 border-white/50 shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
												<svg className="w-7 h-7 text-white drop-shadow-2xl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
												</svg>
											</div>
										</div>
										<p className="text-sm font-black uppercase tracking-wider drop-shadow-2xl">View Collection</p>
										<div className="w-20 h-1 bg-gradient-to-r from-transparent via-white to-transparent rounded-full mx-auto mt-2 shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
									</div>
								</div>
							</div>

							<CardContent className="p-5 bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-lg border-t border-white/20">
								<div className="space-y-3">
									<h3 className="text-xl font-black text-white group-hover:text-pink-200 transition-all duration-300 drop-shadow-[0_0_10px_rgba(244,114,182,0.5)]">
										{category.name}
									</h3>
									<p className="text-sm text-white/80 leading-relaxed font-medium drop-shadow-lg">
										{categoryDescriptions[category.name] || 'Handcrafted items'}
									</p>
									
									{/* Premium Animated Arrow */}
									<div className="flex items-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0 pt-2">
										<span className="text-xs font-bold mr-2 drop-shadow-lg tracking-wide">Explore Collection</span>
										<svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
										</svg>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
};

export default CategoryGrid;
