import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-primary-600 to-teal-600 text-white py-8 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2">
          BioStack Clinical Snapshot Engine
        </h1>
        <p className="text-lg opacity-90">
          AI-powered clinical decision support using synthetic medical data
        </p>
      </div>
    </header>
  );
};

export default Header;
