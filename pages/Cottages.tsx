import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import BookingModal from '../components/BookingModal';
import SEO from '../components/SEO';
import { AnyItem } from '../types';

const Cottages: React.FC = () => {
  const { state } = useApp();
  const [selectedItem, setSelectedItem] = React.useState<AnyItem | null>(null);

  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-green-50 min-h-screen pt-28 pb-16">
      <SEO 
        title="Cottage Stays" 
        description="Stay in the best cottages and resorts in Munnar. Experience luxury and nature combined."
      />
      <div className="container mx-auto px-6">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Cottage Stays</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
             Experience tranquility in our handpicked nature resorts and cottages.
          </p>
        </motion.div>
        
        {state.cottages.length > 0 ? (
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
            {state.cottages.map((cot) => (
              <Card key={cot.id} item={cot} onBook={setSelectedItem} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500">No cottages currently available.</p>
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

export default Cottages;