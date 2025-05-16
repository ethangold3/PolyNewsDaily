import React, { useState } from 'react';

function UnsubscribeForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getApiUrl = () => {
    return process.env.NODE_ENV === 'production' 
      ? '/api/unsubscribe'
      : 'http://localhost:5000/api/unsubscribe';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      setMessage(data.message);
      if (response.ok) {
        setEmail('');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 mb-4 text-center">
        Unsubscribe
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-lg border-gray-300 shadow-sm px-4
                     transition-all duration-300
                     focus:ring-2 focus:ring-red-500 focus:border-transparent
                     group-hover:border-red-400"
            required
            placeholder="Enter your email to unsubscribe"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full relative group overflow-hidden rounded-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 group-hover:from-red-500 group-hover:to-orange-500 transition-colors duration-300"></div>
          <div className="relative px-6 py-2 text-white font-medium text-sm transform transition-transform duration-300 group-hover:scale-105">
            {isLoading ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Unsubscribe'
            )}
          </div>
        </button>
      </form>
      {message && (
        <div className="mt-4 text-center text-sm text-gray-700 animate-fade-in">
          {message}
        </div>
      )}
    </div>
  );
}

export default UnsubscribeForm; 