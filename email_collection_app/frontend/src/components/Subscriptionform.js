import React, { useState } from 'react';

function SubscriptionForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getApiUrl = () => {
    return process.env.NODE_ENV === 'production' 
      ? '/api/submit'
      : 'http://localhost:5000/api/submit';
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
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      setMessage(data.message);
      if (response.ok) {
        const sendLatestResponse = await fetch(
          process.env.NODE_ENV === 'production' 
            ? '/api/send-latest'
            : 'http://localhost:5000/api/send-latest',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: formData.email }),
          }
        );
        
        if (!sendLatestResponse.ok) {
          console.error('Failed to send latest newsletter');
        }
        
        setFormData({ name: '', email: '', feedback: '' });
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6 text-center">
        Subscribe to Daily Insights
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="block w-full rounded-lg border-gray-300 shadow-sm px-4
                     transition-all duration-300
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     group-hover:border-blue-400"
            required
            placeholder="Enter your name"
          />
        </div>
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="block w-full rounded-lg border-gray-300 shadow-sm px-4
                     transition-all duration-300
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     group-hover:border-blue-400"
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What topics interest you? (Optional)
          </label>
          <textarea
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            className="block w-full rounded-lg border-gray-300 shadow-sm px-4
                     transition-all duration-300
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     group-hover:border-blue-400"
            rows="3"
            placeholder="e.g., Politics, Technology, Economics"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full relative group overflow-hidden rounded-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-500 group-hover:to-purple-500 transition-colors duration-300"></div>
          <div className="relative px-6 py-3 text-white font-medium text-sm transform transition-transform duration-300 group-hover:scale-105">
            {isLoading ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Subscribing...
              </span>
            ) : (
              'Get Daily Insights'
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

export default SubscriptionForm;