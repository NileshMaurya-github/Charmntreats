import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Calligraphy = () => (
  <div className="min-h-screen bg-slate-50">
    <Header />
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-amber-600 mb-6">Calligraphy Art</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Calligraphy 1" className="rounded shadow-lg w-full h-64 object-cover" />
        <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Calligraphy 2" className="rounded shadow-lg w-full h-64 object-cover" />
        <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Calligraphy 3" className="rounded shadow-lg w-full h-64 object-cover" />
        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Calligraphy 4" className="rounded shadow-lg w-full h-64 object-cover" />
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">About the Process</h2>
        <p className="text-slate-700 mb-2">Calligraphy is where art meets words. I enjoy creating personalized notes and cards with beautiful hand lettering. More details and stories about the process will be shared here.</p>
      </div>
    </div>
    <Footer />
  </div>
);

export default Calligraphy;
