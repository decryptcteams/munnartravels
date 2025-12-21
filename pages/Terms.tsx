import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const Terms: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen pt-28 pb-16">
      <SEO 
        title="Terms & Conditions" 
        description="Read our booking, cancellation, and refund policies for Munnar Travel services."
      />
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 border-b pb-6">Terms and Conditions</h1>
          
          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Booking Policy</h2>
              <p>
                All bookings made through Munnar Travel are subject to availability. To confirm a reservation for packages, cabs, or cottages, 
                an advance payment may be required as per the specific service agreement. The remaining balance must be cleared before the 
                commencement of the trip or at check-in.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Cancellation & Refunds</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>7+ Days Prior:</strong> Cancellations made 7 days prior to the scheduled date are eligible for a 100% refund of the advance amount.</li>
                <li><strong>3-6 Days Prior:</strong> Cancellations made between 3 to 6 days prior to the scheduled date are eligible for a 50% refund of the advance amount.</li>
                <li><strong>Within 48 Hours:</strong> Cancellations made within 48 hours of the scheduled time are non-refundable.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Cab Services</h2>
              <p>
                Our cab charges include driver allowance and fuel. However, parking fees, toll charges, and interstate entry taxes 
                (if applicable) are to be borne by the customer. The driver will follow the itinerary agreed upon; any detours 
                may incur additional charges based on kilometers covered.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Cottage & Resort Rules</h2>
              <p>
                Guests are required to present valid government ID proof upon check-in. Any damage to property assets during the stay 
                will be charged to the guest. Munnar Travel is not responsible for the loss of personal belongings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Liability & Force Majeure</h2>
              <p>
                Munnar Travel acts as an intermediary. We are not liable for delays, alterations, or cancellations due to natural calamities 
                (landslides, rain), strikes, political unrest, or vehicle breakdowns. In such events, we will do our best to provide 
                alternative arrangements, but additional costs may apply.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Contact Us</h2>
              <p>
                For any clarifications regarding these terms, please contact us at <strong>info.munnartravels@gmail.com</strong> or call us at <strong>+91 98433 73885</strong>.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;