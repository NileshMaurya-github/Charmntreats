import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Blog = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            My <span className="text-amber-600">Handmade Journey</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Follow my creative process from making unique handmade gifts to delivering them with love. Here I share stories, behind-the-scenes, and the passion that goes into every piece.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <a href="/blogDetails/DreamCatcher">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-amber-200 transition-shadow cursor-pointer">
              <h2 className="text-2xl font-bold text-amber-600 mb-2">Dream Catcher Creation</h2>
              <p className="text-slate-700 mb-2">From selecting the perfect threads and beads to weaving intricate patterns, each dream catcher is a labor of love. I draw inspiration from traditional designs and add my own modern twist.</p>
              <img src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Dream Catcher Creation" className="w-full h-56 object-cover rounded mb-2" />
              <p className="text-slate-600 text-sm">Handcrafting beautiful dream catchers with traditional techniques.</p>
              <button className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700">Read More</button>
            </div>
          </a>
          <a href="/blogDetails/Embroidery">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-amber-200 transition-shadow cursor-pointer">
              <h2 className="text-2xl font-bold text-amber-600 mb-2">Embroidery Workshop</h2>
              <p className="text-slate-700 mb-2">Embroidery is all about patience and precision. I love experimenting with colors and patterns to create unique pieces on silk and cotton fabrics.</p>
              <img src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Embroidery Workshop" className="w-full h-56 object-cover rounded mb-2" />
              <p className="text-slate-600 text-sm">Detailed embroidery work on silk fabrics.</p>
              <button className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700">Read More</button>
            </div>
          </a>
          <a href="/blogDetails/LippanArt">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-amber-200 transition-shadow cursor-pointer">
              <h2 className="text-2xl font-bold text-amber-600 mb-2">Lippan Art Creation</h2>
              <p className="text-slate-700 mb-2">Lippan art is a traditional craft from Gujarat, India. I use mirrors and clay to create stunning wall pieces that reflect both light and culture.</p>
              <img src="https://images.unsplash.com/photo-1466721591366-2d5fba72006d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Lippan Art Creation" className="w-full h-56 object-cover rounded mb-2" />
              <p className="text-slate-600 text-sm">Traditional mirror work art in progress.</p>
              <button className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700">Read More</button>
            </div>
          </a>
          <a href="/blogDetails/ResinArt">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-amber-200 transition-shadow cursor-pointer">
              <h2 className="text-2xl font-bold text-amber-600 mb-2">Resin Art Workshop</h2>
              <p className="text-slate-700 mb-2">Resin art allows me to play with colors and textures. Each piece is unique, from coasters to wall art, and the process is always exciting!</p>
              <img src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Resin Art Workshop" className="w-full h-56 object-cover rounded mb-2" />
              <p className="text-slate-600 text-sm">Creating stunning resin art pieces and coasters.</p>
              <button className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700">Read More</button>
            </div>
          </a>
          <a href="/blogDetails/CandleMaking">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-amber-200 transition-shadow cursor-pointer">
              <h2 className="text-2xl font-bold text-amber-600 mb-2">Candle Making Process</h2>
              <p className="text-slate-700 mb-2">Hand-poured candles are a customer favorite. I use natural waxes and essential oils to create soothing scents and beautiful designs.</p>
              <img src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Candle Making Process" className="w-full h-56 object-cover rounded mb-2" />
              <p className="text-slate-600 text-sm">Hand-poured scented candles being crafted.</p>
              <button className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700">Read More</button>
            </div>
          </a>
          <a href="/blogDetails/Calligraphy">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-amber-200 transition-shadow cursor-pointer">
              <h2 className="text-2xl font-bold text-amber-600 mb-2">Calligraphy Art</h2>
              <p className="text-slate-700 mb-2">Calligraphy is where art meets words. I enjoy creating personalized notes and cards with beautiful hand lettering.</p>
              <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Calligraphy Art" className="w-full h-56 object-cover rounded mb-2" />
              <p className="text-slate-600 text-sm">Beautiful hand lettering and calligraphy work.</p>
              <button className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700">Read More</button>
            </div>
          </a>
          <a href="/blogDetails/HairAccessories">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-amber-200 transition-shadow cursor-pointer">
              <h2 className="text-2xl font-bold text-amber-600 mb-2">Hair Accessories</h2>
              <p className="text-slate-700 mb-2">From scrunchies to hairbands, I design and sew accessories that are both stylish and practical, using high-quality fabrics and lots of creativity.</p>
              <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Hair Accessories" className="w-full h-56 object-cover rounded mb-2" />
              <p className="text-slate-600 text-sm">Handmade hair accessories for every occasion.</p>
              <button className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700">Read More</button>
            </div>
          </a>
          <a href="/blogDetails/OthersDelivery">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-amber-200 transition-shadow cursor-pointer">
              <h2 className="text-2xl font-bold text-amber-600 mb-2">Others & Delivery</h2>
              <p className="text-slate-700 mb-2">I also create a variety of other handmade gifts and ensure each order is carefully packed and delivered with a personal touch. Every delivery is a special moment for both me and my customers!</p>
              <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Delivery Process" className="w-full h-56 object-cover rounded mb-2" />
              <p className="text-slate-600 text-sm">From creation to delivery, every step is filled with care.</p>
              <button className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700">Read More</button>
            </div>
          </a>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8 mt-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">
            My <span className="text-amber-600">Work Process</span>
          </h2>
          <ol className="list-decimal list-inside text-slate-700 space-y-2">
            <li>Idea & Inspiration: Every piece starts with a spark of inspiration and a sketch.</li>
            <li>Material Selection: I choose the best materials for quality and sustainability.</li>
            <li>Handcrafting: Each item is made by hand, with attention to detail and tradition.</li>
            <li>Finishing Touches: I add unique details and ensure every product is perfect.</li>
            <li>Packing & Delivery: Orders are packed with care and delivered to your doorstep.</li>
          </ol>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
