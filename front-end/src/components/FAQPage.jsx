import React from 'react';

const FAQPage = () => {
  const faqs = [
    { question: "How is my vote weighted?", answer: "All votes by verified citizens are weighted equally. Lawmaker and expert votes are separate and tracked distinctly for transparency." },
    { question: "Is the platform secure?", answer: "Yes, we use blockchain technology to ensure all posts and votes are immutable and verifiable, guaranteeing the integrity of the process." },
    { question: "Who maintains the platform?", answer: "The platform is maintained by a non-partisan, government-mandated technology board." }
  ];

  return (
    <div className="min-h-screen p-10 bg-white shadow-lg rounded-xl">
      <h1 className="text-4xl font-bold text-blue-800 mb-6 border-b pb-2">Frequently Asked Questions (FAQ)</h1>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b pb-4">
            <h2 className="text-xl font-semibold text-orange-600 mb-1">{faq.question}</h2>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;