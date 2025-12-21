import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4 text-white">
              <MapPin className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">Munnar<span className="text-primary">Travel</span></span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              Your trusted partner for exploring the beautiful hills of Munnar. Packages, cabs, and stays tailored for you.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 uppercase text-sm tracking-wider">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/packages" className="hover:text-primary transition">Tour Packages</Link></li>
              <li><Link to="/fleet" className="hover:text-primary transition">Cab Services</Link></li>
              <li><Link to="/cottages" className="hover:text-primary transition">Cottage Stays</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 uppercase text-sm tracking-wider">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" /> +91 98433 73885, +91 96777 74607
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" /> info.munnartravels@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> Munnar, Kerala, India
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2025 Decryptc.com All rights reserved.</p>
          <div className="flex items-center gap-6">
             <Link to="/terms" className="hover:text-white transition">Terms & Conditions</Link>
             <Link to="/admin" className="hover:text-white transition">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;