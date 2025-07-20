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
	const [categories, setCategories] = useState<CategoryData[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Show default categories immediately for faster perceived loading
		setCategories(defaultCategories.map(name => ({ name, count: 0, images: [] })));
		setLoading(false);
		
		// Load real data in background
		loadCategoryData();
	}, []);

	const loadCategoryData = async () => {
		try {
			const categoryData = await fetchCategoryData();
			
			// Create a map of existing category data
			const categoryMap = new Map(categoryData.map(cat => [cat.name, cat]));
			
			// Ensure all default categories are included
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

	if (loading) {
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
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
						{[...Array(9)].map((_, index) => (
							<Card key={index} className="card-floral border-0 overflow-hidden">
								<div className="w-full h-48 bg-gray-200 animate-pulse" />
								<CardContent className="p-5">
									<div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
									<div className="h-4 bg-gray-200 rounded animate-pulse" />
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>
		);
	}

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
							className="group cursor-pointer card-optimized hover-optimized ultra-smooth border-0 overflow-hidden layout-stable"
							onClick={() => handleCategoryClick(category.name)}
							style={{ animationDelay: `${index * 50}ms` }}
						>
							<div className="relative overflow-hidden premium-image-wrapper category-image-container">
								<StaticCategoryImage
									images={category.images}
									categoryName={category.name}
									className="w-full h-48 premium-category-image"
								/>
								<div className="premium-image-overlay" />
								<div className="absolute inset-0 bg-gradient-to-t from-orange-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
								<div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-3 group-hover:translate-y-0 premium-text-overlay">
									<div className="text-sm font-bold premium-count-text premium-text-reveal">
										{category.count > 0 ? `${category.count}+ items` : 'Coming Soon'}
									</div>
									<div className="text-xs font-medium premium-text-reveal">Click to explore</div>
								</div>
							</div>

							<CardContent className="p-5 premium-card-content relative z-10">
								<h3 className="text-lg font-bold text-black-primary mb-2 group-hover:text-pink-primary transition-all duration-500 premium-category-title premium-text-reveal">
									{category.name}
								</h3>
								<p className="text-gray-700 text-sm font-medium premium-category-description premium-text-reveal">
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
