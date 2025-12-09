import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import BookingModal from '../components/BookingModal';
import { AnyItem, TravelPackage } from '../types';

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
    <div className="bg-gray-50 min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Tour Packages</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the magic of Munnar with our best-selling tour packages.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-200 inline-flex">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                  filter === f
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        
        {filteredPackages.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg) => (
              <Card key={pkg.id} item={pkg} onBook={setSelectedItem} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
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