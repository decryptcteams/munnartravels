import React from 'react';
import { MapPin, Users, Gauge, Zap, Bed, Clock } from 'lucide-react';
import { AnyItem, TravelPackage, Car, Cottage } from '../types';

interface CardProps {
  item: AnyItem;
  onBook: (item: AnyItem) => void;
}

const Card: React.FC<CardProps> = ({ item, onBook }) => {
  const renderDetails = () => {
    if (item.category === 'package') {
      const p = item as TravelPackage;
      return (
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 bg-gray-50 p-2 rounded">
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
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4 bg-gray-50 p-2 rounded">
          <div className="flex flex-col items-center">
            <Users className="w-4 h-4 text-primary mb-1" />
            <span>{c.passengers} Seater</span>
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
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 bg-gray-50 p-2 rounded">
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
    <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <div className="relative h-56 bg-gray-200">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-sm font-bold text-gray-900 shadow-sm">
           ₹{item.price.toLocaleString()} <span className="text-xs font-normal text-gray-500">{item.category === 'package' ? '' : '/ day'}</span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{item.title}</h3>
        
        {renderDetails()}
        
        <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-2 flex-grow">
          {item.description}
        </p>

        <button
          onClick={() => onBook(item)}
          className="w-full bg-primary text-white py-2.5 rounded-md font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default Card;