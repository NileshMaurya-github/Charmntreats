
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
      <section className="compact-section bg-rose-light">
        <div className="container mx-auto compact-container">
          <div className="text-center">
            <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-700 font-medium">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="compact-section bg-rose-light">
      <div className="container mx-auto compact-container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-black-primary mb-3">
            What Our <span className="heading-craft">Customers Say</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium">
            Real reviews from real customers who love our handcrafted products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="card-floral hover-lift floral-hover border-0">
              <CardContent className="p-5">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-5 italic font-medium">
                  "{testimonial.review_text}"
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                    <span className="text-pink-primary font-bold text-sm">
                      {testimonial.customer_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-black-primary text-sm">{testimonial.customer_name}</div>
                    <div className="text-xs text-orange-dark">Verified Customer</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          <div className="text-center floral-hover">
            <div className="bg-pink-100 text-pink-primary rounded-full p-2 w-10 h-10 flex items-center justify-center mx-auto mb-2">
              ✓
            </div>
            <div className="text-xs font-bold text-black-primary">100% Handmade</div>
          </div>
          <div className="text-center floral-hover">
            <div className="bg-pink-100 text-pink-primary rounded-full p-2 w-10 h-10 flex items-center justify-center mx-auto mb-2">
              🚚
            </div>
            <div className="text-xs font-bold text-black-primary">Free Shipping</div>
          </div>
          <div className="text-center floral-hover">
            <div className="bg-pink-100 text-pink-primary rounded-full p-2 w-10 h-10 flex items-center justify-center mx-auto mb-2">
              ✓
            </div>
            <div className="text-xs font-bold text-black-primary">100% Authentic</div>
          </div>
          <div className="text-center floral-hover">
            <div className="bg-pink-100 text-pink-primary rounded-full p-2 w-10 h-10 flex items-center justify-center mx-auto mb-2">
              ⭐
            </div>
            <div className="text-xs font-bold text-black-primary">Quality Assured</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
