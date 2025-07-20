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
	const [loading, setLoading] = useState(false); // No loading state

	useEffect(() => {
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
		<section className="compact-section bg-rose-light">
			<div className="container mx-auto compact-container">
				<div className="text-center mb-8">
					<h2 className="text-2xl md:text-3xl font-bold text-black-primary mb-3">
						Explore Our{' '}
						<span className="heading-craft">Craft Categories</span>
					</h2>
					<p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto font-medium">
						From intricate dream catchers to stunning resin art, discover
						handcrafted treasures in every category
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 grid-optimized">
					{categories.map((category, index) => (
						<Card
							key={category.name}
							className="group cursor-pointer card-floral border-0 overflow-hidden performance-optimized"
							onClick={() => handleCategoryClick(category.name)}
						>
							<div className="relative overflow-hidden">
								<StaticCategoryImage
									images={category.images}
									categoryName={category.name}
									className="w-full h-48 ultra-fast-image"
								/>
								<div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<div className="text-sm font-bold">
										{category.count > 0 ? `${category.count}+ items` : 'Coming Soon'}
									</div>
									<div className="text-xs font-medium">Click to explore</div>
								</div>
							</div>

							<CardContent className="p-5">
								<h3 className="text-lg font-bold text-black-primary mb-2 group-hover:text-pink-primary transition-colors duration-200">
									{category.name}
								</h3>
								<p className="text-gray-700 text-sm font-medium">
									{categoryDescriptions[category.name] || 'Handcrafted items'}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
};

export default CategoryGrid;
