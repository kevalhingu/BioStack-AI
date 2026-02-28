import React, { useState, useRef } from 'react';
import axios from 'axios';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ResultCard from './components/ResultCard';
import { API_CONFIG } from './config';

function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const resultRef = useRef(null);

  const handleAnalyze = async (text) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANALYZE}`,
        { text },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 second timeout
        }
      );

      setResult(response.data);
      
      // Scroll to results after a brief delay
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    } catch (err) {
      let errorMessage = 'Failed to analyze medical record. Please try again.';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. The server took too long to respond.';
      } else if (err.response) {
        errorMessage = `Server error: ${err.response.status} - ${err.response.data?.message || err.response.statusText}`;
      } else if (err.request) {
        errorMessage = 'Network error. Unable to reach the server. Please check your connection.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <InputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
        
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6 fade-in">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-red-800 font-semibold mb-1">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <div ref={resultRef}>
          <ResultCard result={result} />
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">
            Built for AI for Bharat Hackathon 2026. Decision support only.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            This system uses synthetic data and is intended for demonstration purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
