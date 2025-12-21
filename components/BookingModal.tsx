import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Phone, User, Send, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AnyItem, Booking } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: AnyItem;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, item }) => {
  const { state, addBooking } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    phone: '',
    pickupLocation: ''
  });

  const getLabels = () => {
    if (item.category === 'car') {
      return { start: 'Pick-up Date', end: 'Drop-off Date', showEnd: true };
    }
    return { start: 'Preferred Date', end: '', showEnd: false };
  };

  const labels = getLabels();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let dateString = formData.startDate;
    if (labels.showEnd && formData.endDate) {
      dateString = `${formData.startDate} to ${formData.endDate}`;
    }

    let locationDetails = '';
    if (item.category === 'car' && formData.pickupLocation) {
        locationDetails = `Pick-up Location: ${formData.pickupLocation}`;
    }

    const newBooking: Booking = {
        id: Date.now().toString(),
        itemId: item.id,
        itemTitle: item.title,
        category: item.category,
        customerName: formData.name,
        phone: formData.phone,
        startDate: formData.startDate,
        endDate: formData.endDate,
        pickupLocation: formData.pickupLocation,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    addBooking(newBooking);

    const message = `Hello, I would like to book:
*${item.title}* (${item.category.toUpperCase()})
Price: ₹${item.price}
    
*Details:*
Name: ${formData.name}
Date: ${dateString}
${locationDetails}
Phone: ${formData.phone}
    
Please confirm availability.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${state.config.whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white sticky top-0 z-10">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                    {item.category === 'car' ? 'Cab Booking' : 'Booking Request'}
                </h3>
                <p className="text-sm text-primary font-medium mt-0.5">{item.title}</p>
              </div>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Full Name</label>
                <div className="relative group">
                    <User className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                    required
                    type="text"
                    placeholder="Enter your name"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 placeholder-gray-400"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">{labels.start}</label>
                    <div className="relative group">
                        <Calendar className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                        required
                        type="date"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900"
                        value={formData.startDate}
                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                        />
                    </div>
                </div>

                {labels.showEnd && (
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">{labels.end}</label>
                        <div className="relative group">
                            <Calendar className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input
                            required
                            type="date"
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900"
                            value={formData.endDate}
                            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                    </div>
                )}
              </div>

              {item.category === 'car' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Pick-up Location</label>
                    <div className="relative group">
                        <MapPin className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                        required
                        type="text"
                        placeholder="Enter pick-up location"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 placeholder-gray-400"
                        value={formData.pickupLocation}
                        onChange={e => setFormData({ ...formData, pickupLocation: e.target.value })}
                        />
                    </div>
                  </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Phone Number</label>
                <div className="relative group">
                    <Phone className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                    required
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 placeholder-gray-400"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full mt-4 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-green-500/20"
              >
                <Send className="w-5 h-5" />
                Confirm on WhatsApp
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;