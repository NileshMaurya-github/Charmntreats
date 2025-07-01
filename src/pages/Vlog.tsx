
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Vlog = () => {
  const galleryImages = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      title: 'Dream Catcher Creation Process',
      description: 'Handcrafting beautiful dream catchers with traditional techniques'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      title: 'Embroidery Workshop',
      description: 'Detailed embroidery work on silk fabrics'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      title: 'Lippan Art Creation',
      description: 'Traditional mirror work art in progress'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      title: 'Candle Making Process',
      description: 'Hand-poured scented candles being crafted'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      title: 'Calligraphy Art',
      description: 'Beautiful hand lettering and calligraphy work'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      title: 'Resin Art Workshop',
      description: 'Creating stunning resin art pieces and coasters'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Our <span className="text-amber-600">Gallery</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Take a behind-the-scenes look at our creative process and see how we bring handcrafted treasures to life
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {galleryImages.map((image) => (
            <Card key={image.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative overflow-hidden">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-64 object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {image.title}
                </h3>
                <p className="text-slate-600">
                  {image.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* About Our Work */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">
            About Our <span className="text-amber-600">Craft</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Our Story</h3>
              <p className="text-slate-600 mb-4">
                Charmntreats was born from a passion for preserving traditional crafts while creating contemporary pieces that bring joy to modern homes. Each piece in our collection is carefully handcrafted by skilled artisans who have inherited these techniques through generations.
              </p>
              <p className="text-slate-600">
                We believe that handmade items carry a special energy and story that mass-produced goods simply cannot match. Every product tells a tale of dedication, skill, and love for the craft.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Our Process</h3>
              <p className="text-slate-600 mb-4">
                From selecting the finest materials to the final finishing touches, every step of our creation process is done with meticulous care. We source sustainable materials and work with local artisans to ensure both quality and ethical practices.
              </p>
              <p className="text-slate-600">
                Our workshop is a place where creativity meets tradition, where ancient techniques are used to create pieces that fit perfectly in contemporary spaces.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Vlog;
