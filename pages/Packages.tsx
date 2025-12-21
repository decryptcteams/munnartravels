import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import BookingModal from '../components/BookingModal';
import SEO from '../components/SEO';
import { AnyItem } from '../types';

const Packages: React.FC = () => {
  const { state } = useApp();
  const [selectedItem, setSelectedItem] = useState<AnyItem | null>(null);
  const [filter, setFilter] = useState('All');

  const filters = ['All', '1 Day', '2 Days', '3+ Days'];

  const filteredPackages = state.packages.filter((pkg) => {
    if (filter === 'All') return true;
    if (filter === '1 Day') return pkg.duration.includes('1 Day');
    if (filter === '2 Days') return pkg.duration.includes('2 Days');
    if (filter === '3+ Days') {
      const days = parseInt(pkg.duration.split(' ')[0]);
      return !isNaN(days) && days >= 3;
    }
    return true;
  });

  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-amber-50 min-h-screen pt-28 pb-16">
      <SEO 
        title="Tour Packages" 
        description="Discover our best-selling Munnar tour packages. Honeymoon, family, and adventure trips tailored for you."
      />
      <div className="container mx-auto px-6">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Tour Packages</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover the magic of Munnar with our best-selling tour packages.
          </p>
        </motion.div>

        {/* Filter Bar */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-12"
        >
          <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 inline-flex">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  filter === f
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>
        
        {filteredPackages.length > 0 ? (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                }
            }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredPackages.map((pkg) => (
              <Card key={pkg.id} item={pkg} onBook={setSelectedItem} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500">No packages found for this duration.</p>
            <button 
                onClick={() => setFilter('All')} 
                className="mt-4 text-primary font-bold hover:underline"
            >
                View all packages
            </button>
          </div>
        )}
      </div>
      
      {selectedItem && (
        <BookingModal 
          isOpen={!!selectedItem} 
          onClose={() => setSelectedItem(null)} 
          item={selectedItem} 
        />
      )}
    </div>
  );
};

export default Packages;