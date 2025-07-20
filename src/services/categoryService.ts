import { supabase } from '@/integrations/supabase/client';

export interface CategoryData {
  name: string;
  count: number;
  images: string[];
}

export const fetchCategoryData = async (): Promise<CategoryData[]> => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('category, images')
      .eq('in_stock', true);

    if (error) {
      console.error('Error fetching category data:', error);
      return [];
    }

    // Group products by category
    const categoryMap = new Map<string, { count: number; images: string[] }>();

    products?.forEach((product) => {
      const category = product.category;
      const productImages = product.images || [];
      
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { count: 0, images: [] });
      }
      
      const categoryData = categoryMap.get(category)!;
      categoryData.count += 1;
      
      // Add product images to category images (avoid duplicates)
      productImages.forEach((image: string) => {
        if (!categoryData.images.includes(image)) {
          categoryData.images.push(image);
        }
      });
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