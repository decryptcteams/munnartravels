import React from 'react';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import BookingModal from '../components/BookingModal';
import { AnyItem } from '../types';

const Cottages: React.FC = () => {
  const { state } = useApp();
  const [selectedItem, setSelectedItem] = React.useState<AnyItem | null>(null);

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Cottage Stays</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
             Experience tranquility in our handpicked nature resorts and cottages.
          </p>
        </div>
        
        {state.cottages.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {state.cottages.map((cot) => (
              <Card key={cot.id} item={cot} onBook={setSelectedItem} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
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