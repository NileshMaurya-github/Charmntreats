
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Truck, RotateCcw, Heart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            About <span className="text-amber-600">Charmntreats</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Discover our story, values, and commitment to bringing you the finest handcrafted treasures
          </p>
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">
            Our <span className="text-amber-600">Story</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-slate-600 mb-4">
                Founded with a passion for preserving traditional crafts, Charmntreats brings together skilled artisans and craft enthusiasts to create unique, handmade treasures. Our journey began with a simple belief: that handcrafted items carry a soul that mass-produced goods cannot replicate.
              </p>
              <p className="text-slate-600 mb-4">
                Every piece in our collection is carefully crafted by talented artisans who have mastered their craft through years of dedication. We work directly with creators to ensure fair compensation and sustainable practices.
              </p>
              <p className="text-slate-600">
                From dream catchers that protect your sleep to intricate embroidery that tells stories, each item is a testament to human creativity and skill.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                alt="Artisan at work"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <Shield className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Quality Assured</h3>
              <p className="text-slate-600">Every item undergoes strict quality checks to ensure perfection</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Heart className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Handmade with Love</h3>
              <p className="text-slate-600">Each piece is crafted with care and attention to detail</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Truck className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Fast Delivery</h3>
              <p className="text-slate-600">Quick and secure shipping to your doorstep</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <RotateCcw className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Easy Returns</h3>
              <p className="text-slate-600">Hassle-free returns and exchanges</p>
            </CardContent>
          </Card>
        </div>

        {/* Policies Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Return Policy */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Return Policy</h3>
              <div className="space-y-3 text-slate-600">
                <p><strong>30-Day Return Window:</strong> You can return items within 30 days of delivery.</p>
                <p><strong>Condition:</strong> Items must be in original condition, unused, and with original packaging.</p>
                <p><strong>Process:</strong> Contact our customer service team to initiate a return.</p>
                <p><strong>Refund:</strong> Refunds will be processed within 5-7 business days after we receive the returned item.</p>
                <p><strong>Shipping:</strong> Return shipping costs are covered by us for defective items.</p>
              </div>
            </CardContent>
          </Card>

          {/* Product Policy */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Product Policy</h3>
              <div className="space-y-3 text-slate-600">
                <p><strong>Handmade Nature:</strong> Slight variations in color, texture, and design are natural characteristics.</p>
                <p><strong>Materials:</strong> We use only high-quality, sustainable materials in our products.</p>
                <p><strong>Care Instructions:</strong> Each product comes with detailed care instructions.</p>
                <p><strong>Quality Guarantee:</strong> We stand behind the quality of our products.</p>
                <p><strong>Custom Orders:</strong> Some items can be customized - contact us for details.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="bg-amber-50 rounded-lg p-8 mt-12 text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Get in Touch</h3>
          <p className="text-slate-600 mb-6">
            Have questions about our products or policies? We're here to help!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-600">
            <div>
              <strong>Phone:</strong><br />
              +91 8279393939
            </div>
            <div>
              <strong>Email:</strong><br />
              charmntreats@gmail.com
            </div>
            <div>
              <strong>Location:</strong><br />
              Bhilwara, Rajasthan, India
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
