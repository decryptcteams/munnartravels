import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import BookingModal from '../components/BookingModal';
import { AnyItem } from '../types';

const Home: React.FC = () => {
  const { state } = useApp();
  const [selectedItem, setSelectedItem] = React.useState<AnyItem | null>(null);

  const featuredPackages = state.packages.slice(0, 3);

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-gray-900 flex items-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1920&auto=format&fit=crop" 
            alt="Kerala Houseboat" 
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 shadow-black drop-shadow-lg">
            Explore Munnar's Beauty
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-xl shadow-black drop-shadow-md">
            Best tour packages, reliable cab services, and cozy stays for your perfect getaway.
          </p>
          <Link 
            to="/packages" 
            className="inline-block bg-secondary text-white px-8 py-3 rounded-md text-lg font-bold hover:bg-secondary/90 transition shadow-lg"
          >
            View All Packages
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-6 -mt-16 relative z-20 mb-16">
        <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-primary">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tour Packages</h3>
                <p className="text-gray-600 mb-4 text-sm">Curated itineraries for families and couples.</p>
                <Link to="/packages" className="text-primary font-bold text-sm hover:underline">Explore Packages &rarr;</Link>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-secondary">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cab Booking</h3>
                <p className="text-gray-600 mb-4 text-sm">Professional drivers for sightseeing.</p>
                <Link to="/fleet" className="text-secondary font-bold text-sm hover:underline">Book a Cab &rarr;</Link>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-primary">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cottage Stays</h3>
                <p className="text-gray-600 mb-4 text-sm">Comfortable stays with great views.</p>
                <Link to="/cottages" className="text-primary font-bold text-sm hover:underline">Find Stays &rarr;</Link>
            </div>
        </div>
      </section>

      {/* Popular Packages */}
      <section className="container mx-auto px-6 mb-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-200 pb-4">
            <div>
                <h2 className="text-3xl font-bold text-gray-800">Popular Packages</h2>
                <p className="text-gray-500 mt-1">Most booked experiences by travelers</p>
            </div>
            <Link to="/packages" className="hidden md:flex items-center text-primary font-semibold hover:text-primary/80">
                View all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPackages.map((pkg) => (
              <Card key={pkg.id} item={pkg} onBook={setSelectedItem} />
            ))}
        </div>
         <div className="mt-8 text-center md:hidden">
            <Link to="/packages" className="inline-flex items-center justify-center px-6 py-2 border border-primary text-primary font-bold rounded-md hover:bg-primary hover:text-white transition">
                View all Packages
            </Link>
        </div>
      </section>

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

export default Home;