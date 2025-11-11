import React from 'react';

const ContactUsPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white p-10 shadow-2xl rounded-lg">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Get In Touch</h1>
        <p className="text-center text-gray-600 mb-8">
          We welcome your feedback and inquiries. Please use the form below.
        </p>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" id="name" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" id="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Your Message</label>
            <textarea id="message" rows="4" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
          </div>
          <button 
            type="submit" 
            className="w-full py-2 px-4 rounded-md text-white bg-orange-600 hover:bg-orange-700 font-semibold"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUsPage;