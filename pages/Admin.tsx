
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Trash2, Plus, Settings, Package, Car as CarIcon, Home, Lock, LogOut, Search, X, 
  Calendar, Users, Fuel, Upload, Send, MapPin, Clock, Gauge, Zap, 
  CalendarCheck, ImagePlus, XCircle, ChevronRight, MessageSquare
} from 'lucide-react';
import { Category, AnyItem, TravelPackage, Car, Cottage, Booking } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const Admin: React.FC = () => {
  const { state, login, logout, isAdminLoggedIn, addItem, deleteItem, updateConfig, deleteBooking } = useApp();
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<'bookings' | 'package' | 'car' | 'cottage' | 'settings'>('bookings');
  const [loginError, setLoginError] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Settings local state initialized with current values
  const [settingsForm, setSettingsForm] = useState({
    newPassword: '',
    whatsapp: state.config.whatsappNumber
  });

  // Keep local settings form in sync with global state changes
  useEffect(() => {
    setSettingsForm(prev => ({ ...prev, whatsapp: state.config.whatsappNumber }));
  }, [state.config.whatsappNumber]);

  // New Item local state
  const [newItem, setNewItem] = useState<any>({
    title: '',
    description: '',
    price: 0,
    image: '',
    category: 'package',
    duration: '',
    location: '',
    passengers: 4,
    transmission: 'Manual',
    fuelType: 'Diesel',
    guests: 2,
    beds: 1,
    amenities: [],
    additionalImages: []
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
    if (!newItem.image || !newItem.title || newItem.price <= 0) {
      alert("Please fill in all required fields and provide a main image.");
      return;
    }

    const currentCategory = activeTab === 'bookings' || activeTab === 'settings' ? 'package' : activeTab;

    const finalItem: any = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description,
      price: Number(newItem.price),
      image: newItem.image,
      category: currentCategory
    };

    // Category-specific logic
    if (finalItem.category === 'package') {
      finalItem.duration = newItem.duration || '1 Day';
      finalItem.location = newItem.location || 'Munnar';
    } else if (finalItem.category === 'car') {
      finalItem.passengers = Number(newItem.passengers);
      finalItem.transmission = newItem.transmission || 'Manual';
      finalItem.fuelType = newItem.fuelType || 'Diesel';
    } else if (finalItem.category === 'cottage') {
      finalItem.guests = Number(newItem.guests);
      finalItem.beds = Number(newItem.beds);
      finalItem.amenities = ['Wi-Fi', 'Breakfast', 'Heater', 'Balcony'];
      finalItem.additionalImages = newItem.additionalImages.filter((img: string) => img.trim() !== '');
    }

    addItem(finalItem as AnyItem);
    setIsAddModalOpen(false);
    alert("Successfully added to your inventory!");
    
    // Reset form for next entry
    setNewItem({
      title: '', description: '', price: 0, image: '', category: 'package',
      duration: '', location: '', passengers: 4, transmission: 'Manual',
      fuelType: 'Diesel', guests: 2, beds: 1, amenities: [], additionalImages: []
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updates: any = { whatsappNumber: settingsForm.whatsapp };
    if (settingsForm.newPassword.trim() !== '') {
      updates.password = settingsForm.newPassword;
    }
    updateConfig(updates);
    alert("Configuration saved successfully!");
    setSettingsForm(prev => ({ ...prev, newPassword: '' }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file: File = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem({ ...newItem, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewItem((prev: any) => ({
            ...prev,
            additionalImages: [...prev.additionalImages, reader.result as string]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeAdditionalImage = (index: number) => {
    setNewItem((prev: any) => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_: any, i: number) => i !== index)
    }));
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
            <p className="text-sm text-gray-400 mt-1">Munner Travels Dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
              <input
                type="password"
                className={`w-full px-4 py-4 bg-gray-50 border rounded-xl outline-none transition-all text-lg ${loginError ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200 focus:ring-2 focus:ring-primary/10 focus:border-primary'}`}
                value={passwordInput}
                onChange={e => { setPasswordInput(e.target.value); setLoginError(false); }}
                placeholder="••••••"
                autoFocus
              />
            </div>
            {loginError && <p className="text-xs font-bold text-red-500 ml-1">Incorrect credentials. Try again.</p>}
            <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-green-800 transition-all shadow-lg shadow-green-500/20 active:scale-95">
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const inventoryTabs = ['package', 'car', 'cottage'];
  const showAddButton = inventoryTabs.includes(activeTab);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Admin Navbar */}
      <header className="bg-primary text-white h-16 shadow-lg z-20 sticky top-0 border-b border-green-700">
        <div className="container mx-auto px-6 h-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-2 rounded-lg">
               <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Munner Travels</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">Admin Terminal</p>
            </div>
          </div>
          <button 
            onClick={logout} 
            className="flex items-center gap-2 text-xs font-bold bg-white/10 hover:bg-red-500 transition-all px-4 py-2.5 rounded-xl border border-white/10"
          >
            <LogOut className="w-4 h-4" /> <span>SIGN OUT</span>
          </button>
        </div>
      </header>

      {/* Primary Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10 shadow-sm overflow-hidden">
        <div className="container mx-auto px-6 flex gap-2 md:gap-8 overflow-x-auto no-scrollbar scroll-smooth">
          {[
            { id: 'bookings', label: 'Inquiries', icon: Calendar },
            { id: 'package', label: 'Tour Inventory', icon: Package },
            { id: 'car', label: 'Fleet Management', icon: CarIcon },
            { id: 'cottage', label: 'Stay Inventory', icon: Home },
            { id: 'settings', label: 'System Config', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 text-[13px] font-bold border-b-2 transition-all whitespace-nowrap px-2 flex items-center gap-2.5 ${
                activeTab === tab.id 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.id === 'bookings' && state.bookings.length > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">{state.bookings.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-grow container mx-auto px-6 py-8">
        {/* Dashboard Tools */}
        {(activeTab !== 'settings') && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                placeholder={`Search ${activeTab === 'bookings' ? 'inquiries' : activeTab}...`}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none shadow-sm focus:ring-2 focus:ring-primary/10 transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            {showAddButton && (
              <button 
                onClick={() => setIsAddModalOpen(true)} 
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-secondary text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
              >
                <Plus className="w-5 h-5" /> Add New Entry
              </button>
            )}
          </div>
        )}

        {/* Dynamic Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'bookings' && (
            <motion.div key="bookings" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
              {state.bookings.length > 0 ? (
                state.bookings
                  .filter(b => b.itemTitle.toLowerCase().includes(searchTerm.toLowerCase()) || b.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(b => (
                    <div key={b.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                b.category === 'car' ? 'bg-amber-100 text-amber-700' :
                                b.category === 'cottage' ? 'bg-blue-100 text-blue-700' :
                                'bg-green-100 text-green-700'
                            }`}>
                                {b.category}
                            </span>
                            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">{new Date(b.timestamp).toLocaleString()}</span>
                          </div>
                          <h4 className="font-black text-gray-900 text-xl mb-3 tracking-tight">{b.itemTitle}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                              <div className="flex items-center gap-3 text-gray-600">
                                <div className="p-2 bg-gray-50 rounded-lg"><Users className="w-4 h-4 text-gray-400" /></div>
                                <div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase">Customer</p>
                                  <p className="font-bold">{b.customerName}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded-lg"><MessageSquare className="w-4 h-4 text-primary" /></div>
                                <div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase">Contact</p>
                                  <a href={`https://wa.me/${b.phone.replace(/\D/g,'')}`} target="_blank" className="font-bold text-primary hover:underline">{b.phone}</a>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 text-gray-600">
                                <div className="p-2 bg-gray-50 rounded-lg"><Calendar className="w-4 h-4 text-gray-400" /></div>
                                <div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase">Preferred Dates</p>
                                  <p className="font-bold">{b.startDate} {b.endDate ? ` → ${b.endDate}` : ''}</p>
                                </div>
                              </div>
                          </div>
                          {b.pickupLocation && (
                              <div className="mt-4 flex items-center gap-2 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100 w-fit">
                                <MapPin className="w-4 h-4 text-amber-600" />
                                <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">Pickup: {b.pickupLocation}</span>
                              </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => deleteBooking(b.id)} 
                                className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-3 rounded-xl transition-all shadow-sm"
                                title="Delete Inquiry"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                  <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                    <CalendarCheck className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg">Inbox is Empty</h3>
                  <p className="text-gray-400 text-sm">New booking requests will appear here instantly.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-primary p-8 text-white relative">
                 <Settings className="absolute top-8 right-8 w-12 h-12 opacity-10" />
                 <h2 className="text-2xl font-black mb-1">System Configuration</h2>
                 <p className="text-sm opacity-80 font-medium">Manage global variables and security</p>
              </div>
              <form onSubmit={handleSaveSettings} className="p-8 space-y-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">WhatsApp Recipient Number</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-4 text-gray-400 font-bold">+</div>
                      <input 
                        type="text" 
                        className="w-full pl-8 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary font-bold text-gray-800" 
                        value={settingsForm.whatsapp} 
                        onChange={e => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })} 
                        placeholder="919843566608"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase ml-1">Include country code (e.g., 91 for India) without '+' or spaces.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">New Dashboard Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      <input 
                        type="password" 
                        placeholder="Leave blank to keep current" 
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary font-bold text-gray-800" 
                        value={settingsForm.newPassword} 
                        onChange={e => setSettingsForm({ ...settingsForm, newPassword: e.target.value })} 
                      />
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full bg-secondary text-white py-4 rounded-2xl font-black hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/30 active:scale-95">
                  UPDATE CONFIGURATION
                </button>
              </form>
            </motion.div>
          )}

          {inventoryTabs.includes(activeTab) && (
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 gap-4">
              {(() => {
                const items = activeTab === 'package' ? state.packages : activeTab === 'car' ? state.cars : state.cottages;
                const filtered = items.filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase()));
                
                return filtered.length > 0 ? (
                  filtered.map(item => (
                    <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row gap-5 items-center group hover:shadow-lg transition-all">
                      <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden shrink-0 border border-gray-50 shadow-inner">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="flex-grow text-center sm:text-left">
                        <h4 className="font-black text-gray-900 text-lg mb-1">{item.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1 mb-3">{item.description}</p>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                          <span className="text-[10px] font-black bg-gray-900 text-white px-3 py-1.5 rounded-lg">₹{item.price.toLocaleString()}</span>
                          {activeTab === 'car' && <span className="text-[10px] font-black bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg uppercase tracking-widest border border-amber-100">{(item as Car).fuelType}</span>}
                          {activeTab === 'cottage' && (item as Cottage).additionalImages?.length ? (
                             <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg uppercase tracking-widest border border-blue-100">{(item as Cottage).additionalImages?.length} Gallery Images</span>
                          ) : null}
                        </div>
                      </div>
                      <button 
                        onClick={() => { if(confirm('Delete this item?')) deleteItem(item.id, activeTab as Category) }} 
                        className="bg-gray-50 text-gray-400 hover:bg-red-500 hover:text-white p-3.5 rounded-2xl transition-all shadow-sm"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold">No {activeTab}s found.</p>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Add Item Modal (STRICTLY VERTICAL) */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddModalOpen(false)} className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" />
            <motion.form 
              onSubmit={handleAddItem}
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white p-8 rounded-3xl w-full max-w-xl shadow-2xl space-y-8 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="flex justify-between items-center border-b border-gray-50 pb-6 sticky top-[-2rem] bg-white z-10 -mx-8 px-8">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                    Add New {activeTab === 'package' ? 'Tour' : activeTab === 'car' ? 'Cab' : 'Stay'}
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">New Inventory Entry</p>
                </div>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="bg-gray-50 p-2 rounded-xl text-gray-400 hover:text-gray-900 transition-all"><X className="w-6 h-6" /></button>
              </div>

              {/* VERTICAL FORM LAYOUT */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Title / Name</label>
                  <input required placeholder="Enter entry title" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary font-bold text-gray-800 transition-all" value={newItem.title} onChange={e => setNewItem({ ...newItem, title: e.target.value })} />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Price (₹)</label>
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-gray-400 font-bold">₹</div>
                    <input required type="number" placeholder="0" className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary font-bold text-gray-800" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea required placeholder="Detailed description of this item..." className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl h-32 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary font-bold text-gray-800" value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Primary Image</label>
                  <div className="flex flex-col gap-4">
                    <input placeholder="Image URL (https://...)" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary text-sm font-bold" value={newItem.image} onChange={e => setNewItem({ ...newItem, image: e.target.value })} />
                    <div className="relative">
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="admin-file-upload" />
                      <label htmlFor="admin-file-upload" className="w-full p-5 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-3 cursor-pointer hover:bg-gray-50 hover:border-primary transition-all text-sm font-black text-gray-400">
                        <Upload className="w-5 h-5 text-primary" /> OR UPLOAD LOCAL FILE
                      </label>
                    </div>
                    {newItem.image && (
                      <div className="h-48 w-full rounded-2xl overflow-hidden border border-gray-100 shadow-inner group relative">
                        <img src={newItem.image} className="w-full h-full object-cover" alt="Main Preview" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-black tracking-widest">CURRENT PREVIEW</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vertical Category Specific Fields */}
                {activeTab === 'package' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Duration</label>
                      <input placeholder="e.g., 3 Days / 2 Nights" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold" value={newItem.duration} onChange={e => setNewItem({ ...newItem, duration: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Primary Location</label>
                      <input placeholder="e.g., Munnar Top Station" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold" value={newItem.location} onChange={e => setNewItem({ ...newItem, location: e.target.value })} />
                    </div>
                  </div>
                )}

                {activeTab === 'car' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Pax Capacity</label>
                      <input type="number" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold" value={newItem.passengers} onChange={e => setNewItem({ ...newItem, passengers: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Fuel Type</label>
                      <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl bg-white font-bold" value={newItem.fuelType} onChange={e => setNewItem({ ...newItem, fuelType: e.target.value as any })}>
                        <option value="Diesel">Diesel</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Electric">Electric</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === 'cottage' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Max Guests</label>
                      <input type="number" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold" value={newItem.guests} onChange={e => setNewItem({ ...newItem, guests: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Total Beds</label>
                      <input type="number" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold" value={newItem.beds} onChange={e => setNewItem({ ...newItem, beds: e.target.value })} />
                    </div>

                    {/* Gallery Images Support (Vertical Orientation) */}
                    <div className="border-t border-gray-50 pt-8 mt-4">
                      <label className="text-xs font-black text-gray-900 uppercase flex items-center gap-3 mb-6">
                        <ImagePlus className="w-5 h-5 text-primary" /> Stay Gallery (Multiple Images)
                      </label>
                      
                      {/* Gallery Preview Strip */}
                      <div className="grid grid-cols-4 gap-4 mb-6">
                        {newItem.additionalImages.map((img: string, idx: number) => (
                          <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm group bg-gray-50">
                            <img src={img} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                            <button 
                              type="button" 
                              onClick={() => removeAdditionalImage(idx)}
                              className="absolute top-1 right-1 bg-white/90 p-1.5 rounded-full text-red-500 hover:bg-red-500 hover:text-white shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 hover:text-primary hover:border-primary cursor-pointer transition-all bg-gray-50/20 group">
                           <input type="file" multiple accept="image/*" className="hidden" onChange={handleAdditionalImageUpload} />
                           <Plus className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
                           <span className="text-[9px] font-black uppercase tracking-tighter">ADD FILE</span>
                        </label>
                      </div>
                      
                      <div className="space-y-3">
                         <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-1">Or Paste Image URL</p>
                         <div className="flex gap-2">
                            <input 
                              id="gallery-url-input"
                              placeholder="https://..." 
                              className="flex-grow p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary" 
                            />
                            <button 
                              type="button" 
                              onClick={() => {
                                const input = document.getElementById('gallery-url-input') as HTMLInputElement;
                                if (input.value.trim()) {
                                  setNewItem((prev: any) => ({
                                    ...prev,
                                    additionalImages: [...prev.additionalImages, input.value]
                                  }));
                                  input.value = '';
                                }
                              }}
                              className="bg-primary text-white text-[10px] font-black tracking-widest px-6 py-4 rounded-2xl hover:bg-green-800 transition-all shadow-lg shadow-green-500/10"
                            >
                              APPEND
                            </button>
                         </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-50 sticky bottom-[-2rem] bg-white z-10 -mx-8 px-8 mt-6">
                <button 
                    type="button" 
                    onClick={() => setIsAddModalOpen(false)} 
                    className="order-2 sm:order-1 flex-1 py-4 bg-gray-100 text-gray-600 font-black rounded-2xl hover:bg-gray-200 transition-all text-xs tracking-widest"
                >
                    DISCARD
                </button>
                <button 
                    type="submit" 
                    className="order-1 sm:order-2 flex-1 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-green-500/20 hover:bg-green-800 transition-all text-xs tracking-widest active:scale-95"
                >
                    SAVE ENTRY
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
