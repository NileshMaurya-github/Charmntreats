
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin, Instagram, Facebook, Twitter, Youtube, MessageCircle, PinIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  // Social media links
  const socialLinks = [
    {
      name: 'WhatsApp Channel',
      icon: MessageCircle,
      url: 'https://whatsapp.com/channel/0029VavSP4f1iUxrfWW2Jl3x',
      color: 'from-green-500 to-emerald-500',
      hoverColor: 'hover:from-green-400 hover:to-emerald-400'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://www.instagram.com/charmntreats/',
      color: 'from-pink-500 to-purple-500',
      hoverColor: 'hover:from-pink-400 hover:to-purple-400'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://www.facebook.com/charmntreats',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-400 hover:to-blue-500'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://youtube.com/@charmntreats',
      color: 'from-red-500 to-red-600',
      hoverColor: 'hover:from-red-400 hover:to-red-500'
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      url: 'https://twitter.com/charmntreats',
      color: 'from-slate-700 to-slate-900',
      hoverColor: 'hover:from-slate-600 hover:to-slate-800'
    },
    {
      name: 'Pinterest',
      icon: PinIcon,
      url: 'https://pinterest.com/charmntreats',
      color: 'from-red-600 to-rose-600',
      hoverColor: 'hover:from-red-500 hover:to-rose-500'
    }
  ];

  return (
    <footer className="bg-slate-50 text-slate-900 relative overflow-hidden border-t border-slate-200">
      {/* GOD-LEVEL Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-pink-100/50 rounded-full animate-float blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-purple-100/50 rounded-full animate-float blur-3xl" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-100/30 rounded-full animate-pulse"></div>

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-pink-300 rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-40"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand - GOD LEVEL */}
          <div className="col-span-1 md:col-span-2 animate-fade-in-up">
            <div className="bg-white/60 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 hover:border-pink-200 transition-all duration-500 shadow-lg shadow-slate-200/50">
              <div className="mb-6">
                <h3 className="text-4xl font-black mb-3">
                  <span className="bg-gradient-to-r from-pink-600 via-rose-600 to-pink-500 bg-clip-text text-transparent">
                    Charmntreats
                  </span>
                </h3>
                <div className="w-24 h-1.5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-full shadow-md shadow-pink-200"></div>
              </div>

              <p className="text-slate-800 mb-6 leading-relaxed text-lg font-medium">
                Bringing you unique handcrafted treasures that celebrate the beauty of traditional artistry.
                Each piece tells a story of passion, skill, and cultural heritage.
              </p>

              <div className="flex items-center text-slate-800 group mb-8">
                <span className="font-bold">Made with</span>
                <Heart className="h-6 w-6 text-red-500 mx-2 animate-pulse group-hover:animate-bounce transition-all duration-300 drop-shadow-sm" />
                <span className="font-bold">by skilled artisans</span>
              </div>

              {/* GOD-LEVEL Social Media Buttons */}
              <div className="space-y-4">
                <h4 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-4">
                  Connect With Us:
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <Button
                        key={social.name}
                        asChild
                        className={`bg-gradient-to-r ${social.color} ${social.hoverColor} text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-bold animate-fade-in-up`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 py-3"
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-sm">{social.name}</span>
                        </a>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links - GOD LEVEL */}
          <div className="animate-fade-in-up animate-delay-200">
            <div className="bg-white/60 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 hover:border-pink-200 transition-all duration-500 h-full shadow-lg shadow-slate-200/50">
              <h4 className="text-2xl font-black mb-6 text-slate-900">
                Quick Links
              </h4>
              <ul className="space-y-4">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/products', label: 'All Products' },
                  { to: '/about', label: 'About Us' },
                  { to: '/blog', label: 'Blog' },
                  { to: '/auth', label: 'Login' }
                ].map((link, index) => (
                  <li key={link.to} className="animate-slide-in-left" style={{ animationDelay: `${(index + 3) * 0.1}s` }}>
                    <Link
                      to={link.to}
                      className="text-slate-700 hover:text-pink-600 transition-all duration-300 hover:translate-x-2 flex items-center gap-3 group font-bold"
                    >
                      <div className="w-2 h-2 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info - GOD LEVEL */}
          <div className="animate-fade-in-up animate-delay-400">
            <div className="bg-white/60 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 hover:border-pink-200 transition-all duration-500 h-full shadow-lg shadow-slate-200/50">
              <h4 className="text-2xl font-black mb-6 text-slate-900">
                Get in Touch
              </h4>
              <div className="space-y-4">
                {[
                  { icon: Phone, text: '+917355451081', href: 'tel:+917355451081' },
                  { icon: Mail, text: 'charmntreats@gmail.com', href: 'mailto:charmntreats@gmail.com' },
                  { icon: MapPin, text: 'Bengaluru, Karnataka, India', href: '#' }
                ].map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-center text-slate-700 hover:text-pink-600 transition-all duration-300 cursor-pointer group animate-slide-in-right"
                    style={{ animationDelay: `${(index + 6) * 0.1}s` }}
                  >
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300 border border-slate-200 shadow-md">
                      <item.icon className="h-5 w-5 text-pink-500" />
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform duration-300 font-bold text-sm">{item.text}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Thank You Message - GOD LEVEL */}
        <div className="mt-12 p-8 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl hover:border-pink-200 transition-all duration-500 shadow-xl shadow-slate-200/50 animate-fade-in-up animate-delay-600">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6">
              <h5 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-pink-600 via-rose-600 to-pink-500 bg-clip-text text-transparent">
                Thank You for Choosing Charmntreats! 💖
              </h5>
              <div className="w-32 h-1.5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-full mx-auto shadow-md shadow-pink-200"></div>
            </div>

            <div className="space-y-4 text-slate-800 text-lg font-medium leading-relaxed">
              <p>
                We're delighted to have you here! Each handcrafted piece in our collection is made with
                <span className="text-pink-600 font-black"> love, passion, and dedication </span>
                by skilled artisans who pour their heart into every creation.
              </p>

              <p>
                Your trust means the world to us, and we're committed to bringing you
                <span className="text-pink-600 font-black"> unique treasures </span>
                that add charm and beauty to your special moments.
              </p>

              <div className="pt-4">
                <p className="text-2xl font-black bg-gradient-to-r from-pink-600 via-rose-600 to-pink-500 bg-clip-text text-transparent">
                  Happy Shopping! ✨
                </p>
                <p className="text-base text-slate-600 mt-2 font-bold">
                  We hope you enjoy exploring our collection and find something truly special!
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-pink-500 rounded-full"></div>
              <Heart className="h-6 w-6 text-pink-500 animate-pulse drop-shadow-sm" />
              <div className="w-16 h-0.5 bg-gradient-to-r from-pink-500 via-pink-400 to-transparent rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in-up animate-delay-800">
            <p className="text-slate-600 text-center md:text-left font-bold">
              © 2024 Charmntreats. All rights reserved. | Handcrafted with love for art enthusiasts worldwide.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-slate-600 hover:text-pink-600 transition-colors duration-300 font-bold">Privacy Policy</a>
              <a href="#" className="text-slate-600 hover:text-pink-600 transition-colors duration-300 font-bold">Terms of Service</a>
              <a href="#" className="text-slate-600 hover:text-pink-600 transition-colors duration-300 font-bold">Shipping Info</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
