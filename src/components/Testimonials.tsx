
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Testimonial {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  is_featured: boolean;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            What Our <span className="text-amber-600">Customers Say</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Real reviews from real customers who love our handcrafted products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-slate-600 mb-6 italic">
                  "{testimonial.review_text}"
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-amber-600 font-semibold text-lg">
                      {testimonial.customer_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{testimonial.customer_name}</div>
                    <div className="text-sm text-amber-600">Verified Customer</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
          <div className="text-center">
            <div className="bg-green-100 text-green-600 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-2">
              ✓
            </div>
            <div className="text-sm font-medium">100% Handmade</div>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 text-blue-600 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-2">
              🚚
            </div>
            <div className="text-sm font-medium">Free Shipping</div>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 text-purple-600 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-2">
              ↩
            </div>
            <div className="text-sm font-medium">Easy Returns</div>
          </div>
          <div className="text-center">
            <div className="bg-amber-100 text-amber-600 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-2">
              ⭐
            </div>
            <div className="text-sm font-medium">Quality Assured</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
