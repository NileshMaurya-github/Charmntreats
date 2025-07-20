import { supabase } from '@/integrations/supabase/client';

export interface CategoryData {
  name: string;
  count: number;
  images: string[];
}

export const fetchCategoryData = async (): Promise<CategoryData[]> => {
  try {
    // Get first product from each category for instant loading
    const { data: products, error } = await supabase
      .from('products')
      .select('category, images')
      .eq('in_stock', true)
      .not('images', 'is', null)
      .limit(100); // Limit for faster query

    if (error) {
      console.error('Error fetching category data:', error);
      return [];
    }

    // Group products by category and get first image from each
    const categoryMap = new Map<string, { count: number; images: string[] }>();

    products?.forEach((product) => {
      const category = product.category;
      const productImages = Array.isArray(product.images) ? product.images : [product.images];
      
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { count: 0, images: [] });
      }
      
      const categoryData = categoryMap.get(category)!;
      categoryData.count += 1;
      
      // Only add the first image from the first product for instant loading
      if (categoryData.images.length === 0 && productImages.length > 0) {
        categoryData.images.push(productImages[0]);
      }
    });

    // Convert map to array format
    const categoryData: CategoryData[] = Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      images: data.images
    }));

    return categoryData;
  } catch (error) {
    console.error('Error in fetchCategoryData:', error);
    return [];
  }
};