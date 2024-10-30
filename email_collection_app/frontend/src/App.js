import React from 'react';
import SubscriptionForm from './components/SubscriptionForm';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute animate-blob mix-blend-multiply filter blur-xl opacity-70 top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full"></div>
        <div className="absolute animate-blob animation-delay-2000 mix-blend-multiply filter blur-xl opacity-70 top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full"></div>
        <div className="absolute animate-blob animation-delay-4000 mix-blend-multiply filter blur-xl opacity-70 -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full"></div>
      </div>

      {/* Main content */}
      <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-48 h-48 mb-8">
            <div className="bg-white rounded-full p-4">
            <img 
  src={process.env.PUBLIC_URL + '/logo.jpeg'} 
  alt="Poly News Daily Logo"
  className="w-full h-full object-contain"
/>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
            Poly News Daily
          </h1>
          <p className="mt-3 max-w-md mx-auto text-xl text-white sm:text-2xl md:mt-5 md:max-w-3xl">
            Get probabilistic news insights powered by prediction markets
          </p>
        </div>

        {/* Subscription Form Section */}
        <div className="max-w-md mx-auto mb-16">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl">
            <SubscriptionForm />
          </div>
        </div>

        {/* Example Newsletter Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Newsletter Example</h2>
            <div className="prose max-w-none">
              <h3 className="text-xl font-semibold text-indigo-600">US Presidential Election 2024</h3>
              <div className="flex items-center gap-4 my-4">
                <div className="w-24 h-24 bg-gray-200 rounded-lg">
                  {/* Placeholder for chart/image */}
                </div>
                <p className="text-gray-700">
                  According to Polymarket, Trump currently has a 48% chance of winning the 2024 election,
                  while Biden stands at 42%. This represents a 3-point shift from last week...
                </p>
              </div>
              <div className="mt-6 flex justify-between items-center">
                <span className="text-sm text-gray-500">Published: March 19, 2024</span>
                <span className="text-sm font-medium text-indigo-600">Read more examples →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;