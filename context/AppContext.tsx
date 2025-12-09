import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, TravelPackage, Car, Cottage, AdminConfig, AnyItem, Category } from '../types';

interface AppContextType {
  state: AppState;
  addItem: (item: AnyItem) => void;
  deleteItem: (id: string, category: Category) => void;
  updateConfig: (newConfig: Partial<AdminConfig>) => void;
  isAdminLoggedIn: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const defaultState: AppState = {
  config: {
    password: 'admin',
    whatsappNumber: '919843373885',
  },
  packages: [
    {
      id: 'p1',
      category: 'package',
      title: 'Munnar Honeymoon Bliss',
      description: 'Experience the romance of the misty hills with our exclusive honeymoon package. Includes candle-light dinner and private trekking.',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=800&auto=format&fit=crop',
      duration: '3 Days / 2 Nights',
      location: 'Munnar Top Station'
    },
    {
      id: 'p2',
      category: 'package',
      title: 'Tea Garden Explorer',
      description: 'A guided tour through the century-old tea plantations of Munnar. Learn about tea processing and enjoy premium tea tasting.',
      price: 8500,
      image: 'https://images.unsplash.com/photo-1598155523122-3842334d6c10?q=80&w=800&auto=format&fit=crop',
      duration: '2 Days / 1 Night',
      location: 'Kolukkumalai'
    },
    {
      id: 'p3',
      category: 'package',
      title: 'Adventure in the Hills',
      description: 'For the thrill-seekers. Includes off-road jeep safari, camping, and trekking to Meesapulimala.',
      price: 12000,
      image: 'https://images.unsplash.com/photo-1533630764720-d338ce2c9748?q=80&w=800&auto=format&fit=crop',
      duration: '3 Days / 2 Nights',
      location: 'Meesapulimala'
    }
  ],
  cars: [
    {
      id: 'c1',
      category: 'car',
      title: 'Toyota Innova Crysta',
      description: 'Spacious 7-seater, perfect for families visiting Munnar sights comfortably. AC available.',
      price: 3500,
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=800&auto=format&fit=crop',
      passengers: 7,
      transmission: 'Manual',
      fuelType: 'Diesel'
    },
    {
      id: 'c2',
      category: 'car',
      title: 'Mahindra Thar',
      description: 'Ideal for jeep safari and off-road sightseeing locations in Munnar. Open top experience available.',
      price: 4500,
      image: 'https://images.unsplash.com/photo-1605218427306-022248ce8926?q=80&w=800&auto=format&fit=crop',
      passengers: 4,
      transmission: 'Automatic',
      fuelType: 'Diesel'
    }
  ],
  cottages: [
    {
      id: 'cot1',
      category: 'cottage',
      title: 'Cloud Valley Resort',
      description: 'Wake up above the clouds. Panoramic views of the valley from your bedroom window.',
      price: 6000,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop',
      guests: 2,
      beds: 1,
      amenities: ['Wi-Fi', 'Breakfast', 'Heater', 'Balcony']
    },
    {
      id: 'cot2',
      category: 'cottage',
      title: 'Forest Hideaway',
      description: 'A secluded cottage surrounded by dense forest. Complete privacy and tranquility.',
      price: 8000,
      image: 'https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?q=80&w=800&auto=format&fit=crop',
      guests: 4,
      beds: 2,
      amenities: ['Kitchen', 'Bonfire', 'Parking', 'Caretaker']
    }
  ]
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    // Changed key to force refresh of data with new images
    const saved = localStorage.getItem('munner_data_v4');
    return saved ? JSON.parse(saved) : defaultState;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    localStorage.setItem('munner_data_v4', JSON.stringify(state));
  }, [state]);

  const addItem = (item: AnyItem) => {
    setState(prev => {
      if (item.category === 'package') return { ...prev, packages: [...prev.packages, item as TravelPackage] };
      if (item.category === 'car') return { ...prev, cars: [...prev.cars, item as Car] };
      if (item.category === 'cottage') return { ...prev, cottages: [...prev.cottages, item as Cottage] };
      return prev;
    });
  };

  const deleteItem = (id: string, category: Category) => {
    setState(prev => {
      if (category === 'package') return { ...prev, packages: prev.packages.filter(i => i.id !== id) };
      if (category === 'car') return { ...prev, cars: prev.cars.filter(i => i.id !== id) };
      if (category === 'cottage') return { ...prev, cottages: prev.cottages.filter(i => i.id !== id) };
      return prev;
    });
  };

  const updateConfig = (newConfig: Partial<AdminConfig>) => {
    setState(prev => ({ ...prev, config: { ...prev.config, ...newConfig } }));
  };

  const login = (password: string) => {
    if (password === state.config.password) {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
  };

  return (
    <AppContext.Provider value={{ state, addItem, deleteItem, updateConfig, isAdminLoggedIn, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};