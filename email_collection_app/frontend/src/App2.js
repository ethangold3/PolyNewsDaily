import React, { useState, useEffect } from 'react';
import SubscriptionForm from './components/Subscriptionform';
import UnsubscribeForm from './components/UnsubscribeForm';
import logo from './logo.jpeg';
import screenshot1 from './screenshot1.jpeg';  // Add your actual image path
import screenshot2 from './screenshot2.jpeg';



function App() {
  const [showAbout, setShowAbout] = useState(false);
  const [showUnsubscribe, setShowUnsubscribe] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
    {/* Improved Banner with scroll transition */}
    <div className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-opacity-90 backdrop-blur-lg bg-black py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-4 group">
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-white p-1 transform transition-transform group-hover:scale-110">
              <img 
                src={logo}
                alt="Poly News Daily Logo"
                className="h-full w-full object-contain rounded-full"
              />
            </div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-500"></div>
          </div>
          <span className="text-white text-xl font-bold tracking-tight hover:text-purple-300 transition-colors duration-300">
            Poly News Daily
          </span>
        </div>
        
        <div className="flex space-x-4">
          <button 
            onClick={() => setShowAbout(true)}
            className="relative px-4 py-2 group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative px-4 py-2 bg-black rounded-lg text-white transform transition-all duration-300 group-hover:scale-105">
              About
            </div>
          </button>
        </div>
      </div>
    </div>

    {/* Floating background elements with improved animations */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute animate-pulse mix-blend-overlay opacity-20 top-1/4 -left-48 w-96 h-96 bg-purple-500 rounded-full"></div>
      <div className="absolute animate-pulse delay-1000 mix-blend-overlay opacity-20 top-1/3 -right-48 w-96 h-96 bg-blue-500 rounded-full"></div>
      <div className="absolute animate-pulse delay-2000 mix-blend-overlay opacity-20 bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500 rounded-full"></div>
    </div>

    {/* About Modal with enhanced design */}
    {showAbout && (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAbout(false)}>
    <div 
      className="bg-white/90 backdrop-blur-md rounded-2xl p-8 max-w-md w-full transform transition-all duration-300 scale-100 opacity-100" 
      onClick={e => e.stopPropagation()}
    >
      <div className="prose prose-slate">
        <h2 className="text-2xl font-bold mb-4">About Poly News Daily</h2>
        <p className="text-gray-700">
          A Daily newsletter built from prediction markets straight into your inbox. 
          Make your news smarter, probabilistic, and less biased.
        </p>
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Contact</h3>
          <p>Ethan Goldberg</p>
          <a href="mailto:ethanagoldberg@gmail.com" className="text-blue-600 hover:text-blue-800">
            ethanagoldberg@gmail.com
          </a>
        </div>
        <div className="mt-6">
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

{/* Unsubscribe Modal */}
{showUnsubscribe && (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowUnsubscribe(false)}>
    <div 
      className="bg-white/90 backdrop-blur-md rounded-2xl max-w-md w-full transform transition-all duration-300 scale-100 opacity-100" 
      onClick={e => e.stopPropagation()}
    >
      <UnsubscribeForm />
      <div className="flex justify-center pb-6">
        <button 
          onClick={() => setShowUnsubscribe(false)}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{/* Main content area with improved spacing and animations */}
<div className="pt-24 relative min-h-screen z-0"> {/* Added z-0 */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"> {/* Added relative and z-10 */}
    {/* Header with text animations */}
    <div className="text-center space-y-6 mb-16 pt-16 relative z-10"> {/* Added relative and z-10 */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
        A Daily Newsletter Powered by Prediction Markets
      </h1>
      
      <p className="mt-6 max-w-md mx-auto text-xl text-blue-100 opacity-90">
        The news of the future, straight into your inbox each morning.
      </p>
    </div>

    {/* Enhanced subscription form container */}
    <div className="max-w-md mx-auto transform hover:-translate-y-1 transition-all duration-300 relative z-10"> {/* Added relative and z-10 */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-white/90 backdrop-blur-xl rounded-xl">
          <SubscriptionForm />
        </div>
      </div>
    </div>

    {/* Footer with unsubscribe option */}
    <div className="mt-16 text-center">
      <p className="text-blue-100 text-sm opacity-70">
        Don't want to receive our newsletter anymore?{' '}
        <button 
          onClick={() => setShowUnsubscribe(true)}
          className="text-red-300 hover:text-red-200 underline focus:outline-none"
        >
          Unsubscribe here
        </button>
      </p>
    </div>

    {/* Newsletter Examples Section */}
    <div className="max-w-4xl mx-auto mt-24">
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 transform transition-all duration-500 hover:scale-[1.02]">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Example Daily Newsletter
      </h2>
      <p className="text-gray-600 text-center mb-8">
      
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
            <p className="text-sm text-gray-600">More informed news</p>
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
            <p className="text-sm text-gray-600">A probabilistic view of current events</p>
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