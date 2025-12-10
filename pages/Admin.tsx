import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, Plus, Save, Settings, Package, Car as CarIcon, Home, Lock, LogOut, Search, X, MapPin, Calendar, Users, Fuel, Upload } from 'lucide-react';
import { Category, AnyItem, TravelPackage, Car, Cottage } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

// Extracted ListItem component
interface ListItemProps {
  item: AnyItem;
  category: Category;
  onDelete: (id: string, category: Category) => void;
}

const ListItem: React.FC<ListItemProps> = ({ item, category, onDelete }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:shadow-md transition-shadow group">
      <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden shrink-0">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      
      <div className="flex-grow min-w-0">
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
              <h4 className="font-bold text-gray-900 text-lg truncate">{item.title}</h4>
              <div className="flex gap-2">
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
              onClick={() => onDelete(item.id, category)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition"
              title="Delete Item"
          >
              <Trash2 className="w-5 h-5" />
          </button>
      </div>
  </div>
);

// Extracted StatCard component
const StatCard = ({ label, count, icon: Icon, colorClass }: any) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
      <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{count}</p>
      </div>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}>
          <Icon className="w-6 h-6" />
      </div>
  </div>
);

const Admin: React.FC = () => {
  const { state, login, logout, isAdminLoggedIn, addItem, deleteItem, updateConfig } = useApp();
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<Category | 'settings'>('package');
  const [loginError, setLoginError] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Forgot Password State
  const [showForgot, setShowForgot] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [recoveryError, setRecoveryError] = useState(false);
  const [recoverySuccess, setRecoverySuccess] = useState(false);

  // New Item State
  const [newItem, setNewItem] = useState<Partial<AnyItem> & { additionalImages?: string[] }>({
    title: '', description: '', price: 0, image: '', category: 'package', additionalImages: []
  });

  // Settings State
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

  const handleRecover = (e: React.FormEvent) => {
      e.preventDefault();
      // Simple hardcoded recovery code for demo purposes
      if (recoveryCode.toLowerCase() === 'munnar') {
          updateConfig({ password: 'admin' }); // Reset to default
          setRecoverySuccess(true);
          setRecoveryError(false);
          setTimeout(() => {
              setRecoverySuccess(false);
              setShowForgot(false);
              setRecoveryCode('');
          }, 2000);
      } else {
          setRecoveryError(true);
      }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Date.now().toString();
    // Validate image is present
    if (!newItem.image) {
        alert("Please upload an image");
        return;
    }
    addItem({ ...newItem, id, category: activeTab } as AnyItem);
    setNewItem({ title: '', description: '', price: 0, image: '', category: activeTab as Category, additionalImages: [] });
    setIsAddModalOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewItem({ ...newItem, image: reader.result as string });
        };
        reader.readAsDataURL(file);
    }
  };

  const handleDelete = (id: string, category: Category) => {
      if(window.confirm('Are you sure you want to delete this item?')) {
          deleteItem(id, category);
      }
  }

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updates: any = { whatsappNumber: settingsForm.whatsapp };
    if (settingsForm.newPassword) {
      updates.password = settingsForm.newPassword;
    }
    updateConfig(updates);
    alert('Settings updated successfully!');
    setSettingsForm({ ...settingsForm, newPassword: '' });
  };

  // --- LOGIN SCREEN ---
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-sm border border-gray-100 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
            <p className="text-sm text-gray-500 mt-1">Munnar Travel Management</p>
          </div>
          
          {!showForgot ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase ml-1">Password</label>
                  <input
                    type="password"
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition text-lg ${loginError ? 'border-red-300' : 'border-gray-200'}`}
                    value={passwordInput}
                    onChange={e => {
                        setPasswordInput(e.target.value);
                        setLoginError(false);
                    }}
                    autoFocus
                  />
                  {loginError && (
                      <p className="text-xs text-red-500 font-medium ml-1">Incorrect password provided.</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/30 mt-2"
                >
                  Access Dashboard
                </button>
                <button 
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="w-full text-center text-xs text-gray-500 hover:text-primary mt-2 font-medium transition-colors"
                >
                    Forgot Password?
                </button>
              </form>
          ) : (
              <form onSubmit={handleRecover} className="space-y-4">
                  <div className="text-center mb-2">
                      <p className="text-sm text-gray-600">Enter recovery code to reset password.</p>
                  </div>
                  <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 uppercase ml-1">Recovery Code</label>
                      <input
                          type="text"
                          className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition text-lg ${recoveryError ? 'border-red-300' : 'border-gray-200'}`}
                          value={recoveryCode}
                          onChange={e => {
                              setRecoveryCode(e.target.value);
                              setRecoveryError(false);
                          }}
                          placeholder="Enter code"
                          autoFocus
                      />
                      {recoveryError && (
                          <p className="text-xs text-red-500 font-medium ml-1">Invalid recovery code.</p>
                      )}
                      {recoverySuccess && (
                          <p className="text-xs text-green-600 font-medium ml-1">Password reset to 'admin'.</p>
                      )}
                  </div>
                  <button
                      type="submit"
                      className="w-full bg-secondary text-white py-3 rounded-lg font-bold hover:bg-secondary/90 transition shadow-lg shadow-secondary/30 mt-2"
                  >
                      Reset Password
                  </button>
                  <button 
                      type="button"
                      onClick={() => setShowForgot(false)}
                      className="w-full text-center text-xs text-gray-500 hover:text-gray-800 mt-2 font-medium transition-colors"
                  >
                      Back to Login
                  </button>
              </form>
          )}
        </div>
      </div>
    );
  }

  // --- DASHBOARD COMPONENTS ---

  const AddItemModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden"
        >
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-800 text-lg">Add New {activeTab === 'car' ? 'Cab' : (activeTab.charAt(0).toUpperCase() + activeTab.slice(1))}</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            <form onSubmit={handleAddItem} className="p-6 overflow-y-auto max-h-[80vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Item Title</label>
                        <input required type="text" placeholder="e.g. Luxury Munnar Stay" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                            value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
                        <input required type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                            value={newItem.price || ''} onChange={e => setNewItem({...newItem, price: Number(e.target.value)})} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Item Image</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg h-[42px] relative hover:border-primary transition overflow-hidden">
                           <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="absolute inset-0 flex items-center px-4 text-gray-500 pointer-events-none">
                                {newItem.image ? (
                                    <span className="text-green-600 font-medium flex items-center gap-2">
                                        <div className="w-5 h-5 rounded overflow-hidden bg-gray-200">
                                            <img src={newItem.image} alt="prev" className="w-full h-full object-cover" />
                                        </div>
                                        Image Selected
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2 text-sm"><Upload className="w-4 h-4" /> Click to upload</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                        <textarea required rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                            value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />
                    </div>

                    {/* Dynamic Fields */}
                    {activeTab === 'package' && (
                        <>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
                                <select 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
                                    value={(newItem as TravelPackage).duration || '2 Days / 1 Night'}
                                    onChange={e => setNewItem({...newItem, duration: e.target.value} as any)}
                                >
                                    <option value="1 Day Trip">1 Day Trip</option>
                                    <option value="2 Days / 1 Night">2 Days / 1 Night</option>
                                    <option value="3 Days / 2 Nights">3 Days / 2 Nights</option>
                                    <option value="4 Days / 3 Nights">4 Days / 3 Nights</option>
                                    <option value="5+ Days">5+ Days</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                                    value={(newItem as TravelPackage).location || ''} onChange={e => setNewItem({...newItem, location: e.target.value} as any)} />
                            </div>
                        </>
                    )}

                    {activeTab === 'car' && (
                        <>
                             <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Passengers</label>
                                <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                                    value={(newItem as Car).passengers || ''} onChange={e => setNewItem({...newItem, passengers: Number(e.target.value)} as any)} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Transmission</label>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white" 
                                    value={(newItem as Car).transmission || 'Manual'} onChange={e => setNewItem({...newItem, transmission: e.target.value} as any)}>
                                    <option value="Manual">Manual</option>
                                    <option value="Automatic">Automatic</option>
                                </select>
                            </div>
                        </>
                    )}

                    {activeTab === 'cottage' && (
                        <>
                             <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Guests</label>
                                <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                                    value={(newItem as Cottage).guests || ''} onChange={e => setNewItem({...newItem, guests: Number(e.target.value)} as any)} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Beds</label>
                                <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                                    value={(newItem as Cottage).beds || ''} onChange={e => setNewItem({...newItem, beds: Number(e.target.value)} as any)} />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Images (Max 3)</label>
                                <div className="flex gap-4 flex-wrap">
                                    {((newItem as any).additionalImages || []).map((img: string, idx: number) => (
                                        <div key={idx} className="relative w-24 h-24 border rounded-lg overflow-hidden group">
                                            <img src={img} alt="add" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updated = [...((newItem as any).additionalImages || [])];
                                                    updated.splice(idx, 1);
                                                    setNewItem({ ...newItem, additionalImages: updated } as any);
                                                }}
                                                className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {((newItem as any).additionalImages || []).length < 3 && (
                                        <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative hover:border-primary transition">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            const current = (newItem as any).additionalImages || [];
                                                            setNewItem({ ...newItem, additionalImages: [...current, reader.result as string] } as any);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <Plus className="w-6 h-6 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-50 rounded-lg transition">Cancel</button>
                    <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 transition shadow-md">Add Item</button>
                </div>
            </form>
        </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* TOP HEADER */}
        <header className="bg-primary text-white h-16 shadow-lg z-20 sticky top-0">
            <div className="container mx-auto px-6 h-full flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-1.5 rounded-lg">
                        <Lock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">Munnar Travel</h1>
                        <p className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">Admin Dashboard</p>
                    </div>
                </div>
                <button 
                    onClick={logout}
                    className="flex items-center gap-2 text-sm font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </header>

        {/* NAVIGATION TABS */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-10 shadow-sm">
            <div className="container mx-auto px-6">
                <div className="flex gap-8 overflow-x-auto no-scrollbar">
                    {['package', 'car', 'cottage', 'settings'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab as any); setSearchTerm(''); }}
                            className={`py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-1 ${
                                activeTab === tab 
                                ? 'border-primary text-primary' 
                                : 'border-transparent text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            {tab === 'package' && 'Tour Packages'}
                            {tab === 'car' && 'Cab Fleet'}
                            {tab === 'cottage' && 'Cottages'}
                            {tab === 'settings' && 'Settings'}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="flex-grow container mx-auto px-6 py-8">
            {activeTab === 'settings' ? (
                <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-gray-500" /> System Configuration
                        </h2>
                        
                        <form onSubmit={handleUpdateSettings} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp Number</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                    value={settingsForm.whatsapp}
                                    onChange={e => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                                />
                                <p className="text-xs text-gray-500 mt-2">Bookings will be sent to this number.</p>
                            </div>
                            <div className="pt-6 border-t border-gray-100">
                                <label className="block text-sm font-bold text-gray-700 mb-2">New Admin Password</label>
                                <input
                                    type="password"
                                    placeholder="Leave blank to keep current"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                    value={settingsForm.newPassword}
                                    onChange={e => setSettingsForm({ ...settingsForm, newPassword: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="w-full bg-secondary text-white py-3 rounded-lg font-bold hover:bg-secondary/90 transition shadow-md">
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <>
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <StatCard 
                            label="Total Packages" 
                            count={state.packages.length} 
                            icon={Package} 
                            colorClass="bg-green-100 text-green-700" 
                        />
                        <StatCard 
                            label="Total Cabs" 
                            count={state.cars.length} 
                            icon={CarIcon} 
                            colorClass="bg-amber-100 text-amber-700" 
                        />
                        <StatCard 
                            label="Total Cottages" 
                            count={state.cottages.length} 
                            icon={Home} 
                            colorClass="bg-blue-100 text-blue-700" 
                        />
                    </div>

                    {/* Action Toolbar */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input 
                                type="text"
                                placeholder={`Search ${activeTab === 'package' ? 'packages' : activeTab}s...`}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-secondary text-white px-6 py-2.5 rounded-lg font-bold hover:bg-secondary/90 transition shadow-md"
                        >
                            <Plus className="w-5 h-5" />
                            Add New
                        </button>
                    </div>

                    {/* Item List */}
                    <div className="space-y-4">
                        {(() => {
                            const items = activeTab === 'package' ? state.packages : activeTab === 'car' ? state.cars : state.cottages;
                            const filtered = items.filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase()));
                            
                            if (filtered.length === 0) {
                                return (
                                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                                        <p className="text-gray-400 font-medium">No items found.</p>
                                    </div>
                                );
                            }

                            return filtered.map(item => (
                                <ListItem key={item.id} item={item} category={activeTab as Category} onDelete={handleDelete} />
                            ));
                        })()}
                    </div>
                </>
            )}
        </main>

        {/* ADD MODAL */}
        <AnimatePresence>
            {isAddModalOpen && <AddItemModal />}
        </AnimatePresence>
    </div>
  );
};

export default Admin;