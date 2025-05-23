import React from 'react';

const PageTemplate = ({ title, description, children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
          {description && (
            <p className="text-xl text-gray-600">{description}</p>
          )}
        </div>
        <div className="glass-effect p-8 rounded-2xl">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageTemplate; 