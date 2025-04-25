import React from 'react';

const ReturnPolicyPage: React.FC = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Return & Exchange Policy</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Main Policy */}
          <div className="space-y-4">
            <p className="text-lg font-semibold text-red-600">
              No Return Only Exchange available If The Product Is Damaged Or Faulty.
            </p>
            <p className="text-gray-700">
              You may Exchange all items sold by Luxy Store within 5 days of delivery for Exchange as long as it is unused and in a good condition.
            </p>
          </div>

          {/* Exchange Conditions */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Exchange Available for:</h2>
            <ul className="list-disc list-inside text-gray-700 ml-4">
              <li>Faulty products</li>
              <li>Size Issues</li>
            </ul>
          </div>

          {/* Exchange Process */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">How to Exchange</h2>
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-gold-500 text-white rounded-full flex items-center justify-center font-semibold">1</span>
                <p className="text-gray-700">For exchange send Us Your Order Id Or Invoice Image On WhatsApp <a href="https://wa.me/919631401877" className="text-gold-600 hover:underline">+91 9631401877</a></p>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-gold-500 text-white rounded-full flex items-center justify-center font-semibold">2</span>
                <p className="text-gray-700">Send Us Your Email Id.</p>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-gold-500 text-white rounded-full flex items-center justify-center font-semibold">3</span>
                <p className="text-gray-700">Tell Us Issues.</p>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-gold-500 text-white rounded-full flex items-center justify-center font-semibold">4</span>
                <p className="text-gray-700">Customer Have To Send The Parcel With Any Private Courier, Customer Have To Bear The Courier Charges From Their Side, No Pick-up System</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
            <p className="text-gray-700">
              If you have any questions about our return and exchange policy, please contact us:
            </p>
            <div className="mt-2">
              <a 
                href="https://wa.me/919631401877" 
                className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp: +91 9631401877
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicyPage; 