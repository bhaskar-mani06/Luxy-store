import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
        
        <div className="prose prose-lg">
          <p className="mb-4">
            We are committed to protect your personal information & respect your privacy. We do not publish, sell or rent your personal information to third parties for their marketing. Please read this privacy policy to learn more about the ways in which we use and protect your personal information.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Information Collection and Use</h2>
          <p className="mb-4">
            Personal information is basically used to process your order and to provide you with the best possible services. Unless otherwise stated explicitly, this policy applies to personal information as disclosed on any of the media.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Your Trust</h2>
          <p className="mb-4">
            We value your trust in us. We will work hard to earn your confidence so that you can enthusiastically use our services and recommend us to friends and family. You can also change your personal information for privacy. Keep changing your account password for more privacy.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Third-Party Cookies</h2>
          <p className="mb-4">
            We cannot control cookies managed by third parties. Please contact us for further details/query regarding the privacy policy.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Communication</h2>
          <p className="mb-4">
            To Contact you via email, facsimile, phone or text message to deliver services or information you have requested.
          </p>

          <div className="mt-8">
            <Link to="/contact" className="text-gold-500 hover:text-gold-600">
              Contact us for any privacy-related questions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 