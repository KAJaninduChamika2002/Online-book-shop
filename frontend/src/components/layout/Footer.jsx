import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletter = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/newsletter', { email });
      toast.success('Subscribed successfully!');
      setEmail('');
    } catch { toast.error('Already subscribed or invalid email'); }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter */}
      <div className="bg-blue-600">
        <div className="container-custom py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white">Stay in the Loop! 📬</h3>
              <p className="text-blue-100 mt-1">Get exclusive deals, new arrivals & back-to-school offers</p>
            </div>
            <form onSubmit={handleNewsletter} className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="flex-1 md:w-72 px-4 py-3 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-white"
              />
              <button type="submit" className="bg-orange-500 hover:bg-orange-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container-custom py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🧸</span>
              <div>
                <span className="text-xl font-bold text-white">ToyShop</span>
                <span className="text-xl font-bold text-orange-400">LK</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Sri Lanka's favourite online store for toys, school bags, stationery, and kids accessories. Making childhood magical since 2020.
            </p>
            <div className="flex gap-3 mt-5">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ['Home', '/'], ['Shop All', '/shop'], ['New Arrivals', '/shop?newArrival=true'],
                ['Best Sellers', '/shop?bestseller=true'], ['Sale', '/shop?sale=true'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-gray-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ['Toys', 'toys'], ['School Bags', 'school-bags'],
                ['Stationery', 'stationery'], ['Books', 'books'],
                ['Art Supplies', 'art-supplies'], ['Water Bottles', 'water-bottles'],
              ].map(([label, slug]) => (
                <li key={slug}>
                  <Link to={`/shop?category=${slug}`} className="text-gray-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5 text-gray-400">
                <MapPin size={16} className="shrink-0 mt-0.5 text-blue-400" />
                123 Main Street, Colombo 03, Sri Lanka
              </li>
              <li className="flex items-center gap-2.5 text-gray-400">
                <Phone size={16} className="text-blue-400" />
                +94 77 123 4567
              </li>
              <li className="flex items-center gap-2.5 text-gray-400">
                <Mail size={16} className="text-blue-400" />
                hello@toyshop.lk
              </li>
            </ul>
            <div className="mt-5 p-3 bg-gray-800 rounded-xl text-xs text-gray-400">
              <div className="font-semibold text-white mb-1">Store Hours</div>
              Mon–Sat: 9am – 7pm<br />
              Sunday: 10am – 5pm
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container-custom py-4 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© 2024 ToyShop LK. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Returns Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
