import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Phone, User, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AnyItem } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: AnyItem;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, item }) => {
  const { state } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    phone: ''
  });

  const getLabels = () => {
    if (item.category === 'car') {
      return { start: 'Pick-up Date', end: 'Drop-off Date', showEnd: true };
    }
    if (item.category === 'cottage') {
      return { start: 'Check-in Date', end: 'Check-out Date', showEnd: true };
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

    const message = `Hello, I would like to book:
*${item.title}* (${item.category.toUpperCase()})
Price: ₹${item.price}
    
*Details:*
Name: ${formData.name}
Date: ${dateString}
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                    {item.category === 'car' ? 'Cab Booking Request' : 'Booking Request'}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">{item.title}</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                    required
                    type="text"
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition text-sm text-gray-900 placeholder-gray-400"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={`space-y-1.5 ${!labels.showEnd ? 'col-span-2' : ''}`}>
                    <label className="text-xs font-bold text-gray-500 uppercase">{labels.start}</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                        required
                        type="date"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition text-sm text-gray-900"
                        value={formData.startDate}
                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                        />
                    </div>
                </div>

                {labels.showEnd && (
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">{labels.end}</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                            required
                            type="date"
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition text-sm text-gray-900"
                            value={formData.endDate}
                            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                    </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                    required
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition text-sm text-gray-900 placeholder-gray-400"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 rounded-md transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
                Send via WhatsApp
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;