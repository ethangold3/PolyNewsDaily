import React, { useState } from 'react';
import SubscriptionForm from './components/SubscriptionForm';
import logo from './logo.jpeg';
import screenshot1 from './screenshot1.jpg';  // Add your actual image path
import screenshot2 from './screenshot2.jpg';

function App() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Black Banner */}
      <div className="bg-black w-full p-4 flex justify-between items-center fixed top-0 z-50">
        <div className="flex items-center">
          <img 
            src={logo}
            alt="Poly News Daily Logo"
            className="h-12 w-12 object-contain rounded-full bg-white p-1"
          />
          <span className="text-white text-xl font-bold ml-3">Poly News Daily</span>
        </div>
        <button 
          onClick={() => setShowAbout(true)}
          className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
        >
          About
        </button>
      </div>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">About Poly News Daily</h2>
              <button 
                onClick={() => setShowAbout(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="prose">
              <p>
                Poly News Daily provides probabilistic insights into current events using prediction market data. 
                We analyze market probabilities to give you a quantified perspective on news and future events.
              </p>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Contact</h3>
                <p>Ethan Goldberg</p>
                <a href="mailto:ethanagoldberg@gmail.com" className="text-blue-600 hover:text-blue-800">
                  ethanagoldberg@gmail.com
                </a>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">GitHub</h3>
                <a 
                  href="https://github.com/ethangold3/PolyNewsDaily" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Project Repository
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add padding to account for fixed banner */}
      <div className="pt-20">
        {/* Main content */}
        <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute animate-blob mix-blend-multiply filter blur-xl opacity-70 top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full"></div>
            <div className="absolute animate-blob animation-delay-2000 mix-blend-multiply filter blur-xl opacity-70 top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full"></div>
            <div className="absolute animate-blob animation-delay-4000 mix-blend-multiply filter blur-xl opacity-70 -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full"></div>
          </div>

          {/* Header - removed logo since it's now in banner */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              Poly News Daily
            </h1>
            <p className="mt-3 max-w-md mx-auto text-xl text-white sm:text-2xl md:mt-5 md:max-w-3xl">
              Get probabilistic news insights powered by prediction markets
            </p>
          </div>

          {/* Rest of your components... */}
          <div className="max-w-md mx-auto mb-16">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl">
              <SubscriptionForm />
            </div>
          </div>

                    {/* Newsletter Examples Section */}
                    <div className="max-w-4xl mx-auto mt-16">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Example Daily Newsletter
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Here's what you'll receive in your inbox every day
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative group">
                  <div className="overflow-hidden rounded-lg shadow-lg">
                    <img 
                      src={screenshot1}
                      alt="Newsletter Example 1"
                      className="w-full h-auto transform transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">Morning Newsletter Example</p>
                  </div>
                </div>

                <div className="relative group">
                  <div className="overflow-hidden rounded-lg shadow-lg">
                    <img 
                      src={screenshot2}
                      alt="Newsletter Example 2"
                      className="w-full h-auto transform transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">Market Analysis Example</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-700">
                  Subscribe above to receive daily insights directly in your inbox!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;