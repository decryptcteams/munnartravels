import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import BookingModal from '../components/BookingModal';
import SEO from '../components/SEO';
import { AnyItem } from '../types';

const Home: React.FC = () => {
  const { state } = useApp();
  const [selectedItem, setSelectedItem] = React.useState<AnyItem | null>(null);

  const featuredPackages = state.packages.slice(0, 3);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12 overflow-hidden">
      <SEO 
        title="Home" 
        description="Your trusted partner for exploring Munnar. We offer the best tour packages, cab services, and cottage stays."
      />
      <section className="relative h-[600px] bg-gray-900 flex items-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1593693397690-362cb9666c64?q=80&w=1920&auto=format&fit=crop" 
            alt="Kerala Houseboat" 
            className="w-full h-full object-cover opacity-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center md:text-left">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-7xl font-bold text-white mb-6 shadow-black drop-shadow-2xl tracking-tight leading-tight"
            >
              Explore Munnar's <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-amber-300">Natural Beauty</span>
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-200 mb-10 max-w-xl shadow-black drop-shadow-md leading-relaxed"
            >
              Best tour packages, reliable cab services, and cozy stays for your perfect getaway in God's Own Country.
            </motion.p>
            <motion.div variants={fadeInUp}>
                <Link 
                  to="/packages" 
                  className="inline-block bg-secondary text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-amber-600 transition shadow-lg shadow-amber-600/30 transform hover:-translate-y-1"
                >
                  View All Packages
                </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-6 -mt-24 relative z-20 mb-20">
        <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
        >
            {[
                { title: 'Tour Packages', desc: 'Curated itineraries for families and couples.', link: '/packages', color: 'primary', linkText: 'Explore Packages' },
                { title: 'Cab Booking', desc: 'Professional drivers for sightseeing.', link: '/fleet', color: 'secondary', linkText: 'Book a Cab' },
                { title: 'Cottage Stays', desc: 'Comfortable stays with great views.', link: '/cottages', color: 'primary', linkText: 'Find Stays' }
            ].map((service, idx) => (
                <motion.div 
                    key={idx}
                    variants={fadeInUp}
                    whileHover={{ y: -10 }}
                    className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-xl border-t-4 border-gray-100"
                    style={{ borderTopColor: service.color === 'primary' ? '#15803d' : '#d97706' }}
                >
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-6 text-sm leading-relaxed">{service.desc}</p>
                    <Link to={service.link} className={`text-${service.color} font-bold text-sm flex items-center gap-2 group`}>
                        {service.linkText} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>
            ))}
        </motion.div>
      </section>

      <section className="container mx-auto px-6 mb-24">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-200 pb-4"
        >
            <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Popular Packages</h2>
                <p className="text-gray-500 mt-2 text-lg">Most booked experiences by travelers</p>
            </div>
            <Link to="/packages" className="hidden md:flex items-center text-primary font-bold hover:text-primary/80 transition group">
                View all <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPackages.map((pkg) => (
              <Card key={pkg.id} item={pkg} onBook={setSelectedItem} />
            ))}
        </div>
         <div className="mt-12 text-center md:hidden">
            <Link to="/packages" className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-white transition">
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