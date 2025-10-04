
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Shield, Quote, Sparkles } from 'lucide-react';
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
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative animate-spin rounded-full h-24 w-24 border-4 border-pink-500/30 border-t-pink-500 mx-auto"></div>
            </div>
            <p className="mt-6 text-white/90 font-bold text-lg">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900">
      {/* Floating Particles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl animate-float-fast"></div>
      </div>

      {/* Sparkle Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header - GOD LEVEL */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-white/10 backdrop-blur-xl px-8 py-3 rounded-2xl border-2 border-white/20">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-pink-400 animate-spin-slow" />
                <span className="text-white/90 font-black text-sm tracking-wider uppercase">Customer Love</span>
                <Sparkles className="w-5 h-5 text-rose-400 animate-spin-slow" />
              </div>
            </div>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-6 relative">
            <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-pink-300 blur-sm">
              What Our Customers Say
            </span>
            <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-pink-400 blur-xs">
              What Our Customers Say
            </span>
            <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-white">
              What Our Customers Say
            </span>
          </h2>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto font-bold leading-relaxed">
            Real reviews from real customers who love our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-pink-400">
              handcrafted masterpieces
            </span>
          </p>
        </div>

        {/* Testimonial Cards - GOD LEVEL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.id} className="group relative">
              {/* Outer Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-all duration-700"></div>
              
              <Card className="relative bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-pink-400/50 transition-all duration-500 hover:scale-105 overflow-hidden rounded-3xl h-full">
                {/* Card Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Floating Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                  <Quote className="w-20 h-20 text-pink-300" strokeWidth={1} />
                </div>

                <CardContent className="p-8 relative z-10">
                  {/* Stars - Premium Style */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <div key={i} className="relative">
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400 drop-shadow-lg animate-pulse" 
                          style={{ animationDelay: `${i * 0.1}s` }} />
                      </div>
                    ))}
                  </div>
                  
                  {/* Review Text */}
                  <p className="text-white/90 mb-8 italic font-medium text-base leading-relaxed">
                    "{testimonial.review_text}"
                  </p>
                  
                  {/* Customer Info - Enhanced */}
                  <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full blur-md opacity-50"></div>
                      <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-xl">
                        <span className="text-white font-black text-xl">
                          {testimonial.customer_name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="font-black text-white text-base">{testimonial.customer_name}</div>
                      <div className="flex items-center gap-2 text-sm text-pink-300">
                        <Shield className="w-3.5 h-3.5" />
                        <span className="font-bold">Verified Customer</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Trust Badges - GOD LEVEL */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '✓', label: '100% Handmade', gradient: 'from-emerald-500 to-teal-500' },
            { icon: '🚚', label: 'Free Shipping', gradient: 'from-blue-500 to-cyan-500' },
            { icon: '✓', label: '100% Authentic', gradient: 'from-violet-500 to-purple-500' },
            { icon: '⭐', label: 'Quality Assured', gradient: 'from-amber-500 to-yellow-500' }
          ].map((badge, index) => (
            <div key={index} className="group relative">
              <div className={`absolute -inset-1 bg-gradient-to-r ${badge.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-all duration-500`}></div>
              <div className="relative bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-white/40 rounded-2xl p-6 transition-all duration-500 hover:scale-110 text-center">
                <div className={`bg-gradient-to-br ${badge.gradient} text-white rounded-2xl p-4 w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-2xl text-2xl font-black transform group-hover:rotate-12 transition-transform duration-500`}>
                  {badge.icon}
                </div>
                <div className="text-sm font-black text-white/90">{badge.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
