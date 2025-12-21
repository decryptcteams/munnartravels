import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, Plus, Settings, Package, Car as CarIcon, Home, Lock, LogOut, Search, X, Calendar, Users, Fuel, Upload, CalendarCheck } from 'lucide-react';
import { Category, AnyItem, TravelPackage, Car, Cottage, Booking } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface ListItemProps {
  item: AnyItem;
  category: Category;
  onDelete: (id: string, category: Category) => void;
}

const ListItem: React.FC<ListItemProps> = ({ item, category, onDelete }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:shadow-md transition-shadow group relative">
      <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden shrink-0">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="flex-grow min-w-0">
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
              <h4 className="font-bold text-gray-900 text-lg truncate">{item.title}</h4>
              <div className="flex gap-2 flex-wrap">
                  {category === 'package' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                          <Calendar className="w-3 h-3" /> {(item as TravelPackage).duration}
                      </span>
                  )}
                  {category === 'car' && (
                      <>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                              <Users className="w-3 h-3" /> {(item as Car).passengers} Pax
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                              <Fuel className="w-3 h-3" /> {(item as Car).fuelType}
                          </span>
                      </>
                  )}
                  {category === 'cottage' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          <Users className="w-3 h-3" /> {(item as Cottage).guests} Guests
                      </span>
                  )}
              </div>
          </div>
          <p className="text-sm text-gray-500 line-clamp-2 max-w-2xl">{item.description}</p>
      </div>
      <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4 sm:gap-1 w-full sm:w-auto justify-between sm:justify-center border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0 mt-2 sm:mt-0">
          <span className="font-bold text-gray-900 text-lg">₹{item.price.toLocaleString()}</span>
          <button 
              type="button"
              onClick={() => onDelete(item.id, category)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition cursor-pointer"
          >
              <Trash2 className="w-5 h-5" />
          </button>
      </div>
  </div>
);

const BookingListItem: React.FC<{booking: Booking; onDelete: (id: string) => void}> = ({ booking, onDelete }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                        booking.category === 'car' ? 'bg-amber-100 text-amber-800' :
                        booking.category === 'cottage' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                    }`}>
                        {booking.category}
                    </span>
                    <span className="text-xs text-gray-400">
                        {new Date(booking.timestamp).toLocaleString()}
                    </span>
                </div>
                <h4 className="font-bold text-gray-900 text-lg">{booking.itemTitle}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-3 text-sm text-gray-600">
                    <p className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" /> {booking.customerName}</p>
                    <p className="flex items-center gap-2 font-medium"><Users className="w-4 h-4 text-primary" /> {booking.phone}</p>
                    <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /> {booking.startDate} {booking.endDate ? ` to ${booking.endDate}` : ''}</p>
                    {booking.pickupLocation && (
                        <p className="flex items-center gap-2 font-medium text-amber-700 bg-amber-50 px-2 rounded w-fit">📍 Pickup: {booking.pickupLocation}</p>
                    )}
                </div>
            </div>
             <button 
                type="button"
                onClick={() => onDelete(booking.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition cursor-pointer"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
    </div>
);

const Admin: React.FC = () => {
  const { state, login, logout, isAdminLoggedIn, addItem, deleteItem, updateConfig, deleteBooking } = useApp();
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<Category | 'settings' | 'bookings'>('bookings');
  const [loginError, setLoginError] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookingFilter, setBookingFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const [newItem, setNewItem] = useState<Partial<AnyItem> & { additionalImages?: string[] }>({
    title: '', description: '', price: 0, image: '', category: 'package', additionalImages: []
  });

  const [settingsForm, setSettingsForm] = useState({
    newPassword: '',
    whatsapp: state.config.whatsappNumber
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(passwordInput)) {
      setLoginError(false);
      setPasswordInput('');
    } else {
      setLoginError(true);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.image) {
        alert("Please upload an image");
        return;
    }
    const itemToAdd = { ...newItem, id: Date.now().toString(), category: activeTab as Category } as AnyItem;
    addItem(itemToAdd);
    setIsAddModalOpen(false);
    setNewItem({ title: '', description: '', price: 0, image: '', category: activeTab as Category, additionalImages: [] });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setNewItem({ ...newItem, image: reader.result as string });
        reader.readAsDataURL(file);
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
            <p className="text-sm text-gray-500 mt-1">Munnar Travel Management</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-lg outline-none transition text-lg ${loginError ? 'border-red-300' : 'border-gray-200'}`}
              value={passwordInput}
              onChange={e => { setPasswordInput(e.target.value); setLoginError(false); }}
              autoFocus
            />
            <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 transition shadow-lg mt-2">Access Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-primary text-white h-16 shadow-lg z-20 sticky top-0">
            <div className="container mx-auto px-6 h-full flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-white" />
                    <div>
                        <h1 className="font-bold text-lg leading-tight">Munnar Travel</h1>
                        <p className="text-[10px] uppercase tracking-wider font-semibold opacity-70">Admin Dashboard</p>
                    </div>
                </div>
                <button onClick={logout} className="flex items-center gap-2 text-sm font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition">
                    <LogOut className="w-4 h-4" /> <span>Logout</span>
                </button>
            </div>
        </header>

        <div className="bg-white border-b border-gray-200 sticky top-16 z-10 shadow-sm">
            <div className="container mx-auto px-6 flex gap-8 overflow-x-auto no-scrollbar">
                {['bookings', 'package', 'car', 'cottage', 'settings'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-1 ${
                            activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800'
                        }`}
                    >
                        {tab === 'bookings' ? 'Inquiries' : tab === 'package' ? 'Tour Packages' : tab === 'car' ? 'Cab Fleet' : tab === 'cottage' ? 'Cottages' : 'Settings'}
                    </button>
                ))}
            </div>
        </div>

        <main className="flex-grow container mx-auto px-6 py-8">
            {activeTab === 'settings' ? (
                <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Settings className="w-5 h-5 text-gray-500" /> System Configuration</h2>
                    <form onSubmit={(e) => { e.preventDefault(); updateConfig({whatsappNumber: settingsForm.whatsapp, password: settingsForm.newPassword || state.config.password}); alert('Updated!'); }} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp Number</label>
                            <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none" value={settingsForm.whatsapp} onChange={e => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">New Admin Password</label>
                            <input type="password" placeholder="Leave blank to keep current" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none" value={settingsForm.newPassword} onChange={e => setSettingsForm({ ...settingsForm, newPassword: e.target.value })} />
                        </div>
                        <button type="submit" className="w-full bg-secondary text-white py-3 rounded-lg font-bold hover:bg-secondary/90 transition shadow-md">Save Changes</button>
                    </form>
                </div>
            ) : (
                <>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input 
                                type="text"
                                placeholder={`Search...`}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {activeTab !== 'bookings' && (
                            <button onClick={() => setIsAddModalOpen(true)} className="w-full md:w-auto flex items-center justify-center gap-2 bg-secondary text-white px-6 py-2.5 rounded-lg font-bold hover:bg-secondary/90 transition shadow-md">
                                <Plus className="w-5 h-5" /> Add New
                            </button>
                        )}
                    </div>

                    <div className="space-y-4">
                        {activeTab === 'bookings' ? (
                            state.bookings.map(b => <BookingListItem key={b.id} booking={b} onDelete={deleteBooking} />)
                        ) : (
                            (() => {
                                const items = activeTab === 'package' ? state.packages : activeTab === 'car' ? state.cars : state.cottages;
                                return items.filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase())).map(item => <ListItem key={item.id} item={item} category={activeTab as Category} onDelete={deleteItem} />);
                            })()
                        )}
                    </div>
                </>
            )}
        </main>
    </div>
  );
};

export default Admin;