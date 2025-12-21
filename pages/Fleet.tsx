import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import BookingModal from '../components/BookingModal';
import SEO from '../components/SEO';
import { AnyItem } from '../types';

const Fleet: React.FC = () => {
  const { state } = useApp();
  const [selectedItem, setSelectedItem] = React.useState<AnyItem | null>(null);

  return (
    <div className="bg-gradient-to-br from-amber-50 via-white to-gray-50 min-h-screen pt-28 pb-16">
      <SEO 
        title="Cab Booking" 
        description="Book reliable and comfortable cabs in Munnar. Sightseeing, pickup, and drop services available."
      />
      <div className="container mx-auto px-6">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Cab Booking</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Reliable and comfortable rides for your Munnar sightseeing and transfers.
          </p>
        </motion.div>
        
        {state.cars.length > 0 ? (
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
            {state.cars.map((car) => (
              <Card key={car.id} item={car} onBook={setSelectedItem} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500">No cabs currently available.</p>
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

export default Fleet;