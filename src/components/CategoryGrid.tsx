import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import StaticCategoryImage from './RotatingCategoryImage';
import { fetchCategoryData, CategoryData } from '@/services/categoryService';
import { ProductService } from '@/services/productService';

// Static category information with descriptions
const categoryDescriptions: Record<string, string> = {
	'Dream Catcher': 'Handcrafted dream catchers',
	'Embroidery': 'Beautiful embroidered items',
	'Lippan Arts': 'Traditional mirror work',
	'Resin Art Work': 'Stunning resin pieces',
	'Illustration': 'Custom illustrations',
	'Candles': 'Handpoured candles',
	'Calligraphy': 'Beautiful lettering art',
	'Hair Accessories': 'Handcrafted accessories',
	'Others': 'Unique handcrafted items',
};

// Default categories
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
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const scroll = (direction: 'left' | 'right') => {
		if (scrollContainerRef.current) {
			const scrollAmount = 300;
			scrollContainerRef.current.scrollBy({
				left: direction === 'left' ? -scrollAmount : scrollAmount,
				behavior: 'smooth'
			});
		}
	};

	const [categories, setCategories] = useState<CategoryData[]>(
		defaultCategories.map(name => ({ name, count: 0, images: [] }))
	);

	useEffect(() => {
		document.title = 'Charmntreats - Handcrafted with Love';
		loadCategoryData();
	}, []);

	const loadCategoryData = () => {
		try {
			const categoriesWithCount = ProductService.getCategoryWithCount();
			// Create a map for easy lookup
			const categoryMap = new Map(categoriesWithCount.map(c => [c.name, c]));

			// Merge with default categories to ensure none are lost
			const mergedCategories = defaultCategories.map(name => {
				const data = categoryMap.get(name);
				return {
					name: name,
					count: data ? data.count : 0,
					images: data ? [data.featured_image] : []
				};
			});
			setCategories(mergedCategories);
		} catch (error) {
			console.error('Error loading category data:', error);
		}
	};

	const handleCategoryClick = (categoryName: string) => {
		navigate(`/products?category=${encodeURIComponent(categoryName)}`);
	};

	return (
		<section className="py-8 bg-transparent relative overflow-hidden">
			{/* Minimal Background */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
				<div className="absolute top-10 left-10 w-64 h-64 bg-pink-200/40 rounded-full blur-3xl"></div>
				<div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl"></div>
			</div>

			<div className="container mx-auto px-4 relative z-10">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-2xl font-black text-slate-900">
							Shop by Category
						</h2>
						<p className="text-sm text-slate-600">Explore our handcrafted collections</p>
					</div>
					<div className="flex gap-2">
						<button
							onClick={() => scroll('left')}
							className="p-2 rounded-full bg-white border border-slate-200 hover:bg-pink-50 hover:border-pink-300 text-slate-700 hover:text-pink-600 transition-all shadow-sm hover:shadow-md active:scale-95"
							aria-label="Scroll left"
						>
							<ChevronLeft className="w-5 h-5" />
						</button>
						<button
							onClick={() => scroll('right')}
							className="p-2 rounded-full bg-white border border-slate-200 hover:bg-pink-50 hover:border-pink-300 text-slate-700 hover:text-pink-600 transition-all shadow-sm hover:shadow-md active:scale-95"
							aria-label="Scroll right"
						>
							<ChevronRight className="w-5 h-5" />
						</button>
					</div>
				</div>

				{/* Compact Category Gallery - Horizontal Scroll */}
				<div ref={scrollContainerRef} className="overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 scroll-smooth">
					<div className="flex gap-4 min-w-max">
						{categories.map((category) => (
							<div
								key={category.name}
								onClick={() => handleCategoryClick(category.name)}
								className="group relative w-36 h-44 md:w-44 md:h-52 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl hover:shadow-pink-100 transition-all duration-300 hover:-translate-y-1 border border-slate-100"
							>
								{/* Background Image */}
								<StaticCategoryImage
									images={category.images}
									categoryName={category.name}
									className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
								/>

								{/* Gradient Overlay - Requested by User */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-all duration-300 z-10"></div>

								{/* Content */}
								<div className="absolute inset-0 z-20 flex flex-col justify-end p-4">
									<div className="transform transition-transform duration-300 group-hover:-translate-y-1">
										<h3 className="text-white font-bold text-sm md:text-base leading-tight mb-1 drop-shadow-md">
											{category.name}
										</h3>
										<div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
											<span className="text-[10px] md:text-xs text-white font-medium bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
												{category.count} items
											</span>
										</div>
									</div>
								</div>

								{/* Hover Border Effect */}
								<div className="absolute inset-0 border-2 border-transparent group-hover:border-pink-400/50 rounded-2xl transition-colors duration-300 z-30 pointer-events-none"></div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default CategoryGrid;
