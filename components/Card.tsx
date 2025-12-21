import React, { useState } from 'react';
import { MapPin, Users, Gauge, Zap, Bed, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnyItem, TravelPackage, Car, Cottage } from '../types';

interface CardProps {
  item: AnyItem;
  onBook: (item: AnyItem) => void;
}

const Card: React.FC<CardProps> = ({ item, onBook }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getImages = () => {
    const mainImage = item.image;
    let others: string[] = [];
    if (item.category === 'cottage' && (item as Cottage).additionalImages) {
        others = (item as Cottage).additionalImages || [];
    }
    return [mainImage, ...others];
  };

  const images = getImages();
  const hasMultipleImages = images.length > 1;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const renderDetails = () => {
    if (item.category === 'package') {
      const p = item as TravelPackage;
      return (
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-primary" />
            <span>{p.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="truncate">{p.location}</span>
          </div>
        </div>
      );
    } else if (item.category === 'car') {
      const c = item as Car;
      return (
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
          <div className="flex flex-col items-center">
            <Users className="w-4 h-4 text-primary mb-1" />
            <span>{c.passengers} Pax</span>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="flex flex-col items-center">
            <Gauge className="w-4 h-4 text-primary mb-1" />
            <span>{c.transmission}</span>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="flex flex-col items-center">
            <Zap className="w-4 h-4 text-primary mb-1" />
            <span>{c.fuelType}</span>
          </div>
        </div>
      );
    } else if (item.category === 'cottage') {
      const c = item as Cottage;
      return (
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-primary" />
            <span>{c.guests} Guests</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-primary" />
            <span>{c.beds} Beds</span>
          </div>
        </div>
      );
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-primary/5 flex flex-col h-full group"
    >
      <div className="relative h-60 bg-gray-200 overflow-hidden">
        <motion.img
          src={images[currentImageIndex]}
          alt={item.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        />
        
        {hasMultipleImages && (
            <>
                <button 
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm transition-all z-10 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm transition-all z-10 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {images.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all ${idx === currentImageIndex ? 'bg-white w-3' : 'bg-white/50'}`}
                        />
                    ))}
                </div>
            </>
        )}

        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-bold text-gray-900 shadow-lg z-10">
           ₹{item.price.toLocaleString()} <span className="text-xs font-normal text-gray-500">{item.category === 'package' ? '' : '/ day'}</span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow relative bg-white">
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-1">{item.title}</h3>
        {renderDetails()}
        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2 flex-grow">
          {item.description}
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onBook(item)}
          className="w-full bg-gradient-to-r from-primary to-green-600 text-white py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-primary/30 transition-all"
        >
          Book Now
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Card;