import React from 'react';
import RiskBadge from './RiskBadge';

const ResultCard = ({ result }) => {
  if (!result) return null;

  return (
    <div className="fade-in space-y-6">
      {/* Patient Summary Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Patient Summary
        </h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {result.patient_summary}
        </p>
      </div>

      {/* Key Clinical Indicators Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Key Clinical Indicators
        </h2>
        {result.key_clinical_indicators && result.key_clinical_indicators.length > 0 ? (
          <ul className="space-y-3">
            {result.key_clinical_indicators.map((indicator, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700">{indicator}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No clinical indicators available</p>
        )}
      </div>

      {/* Risk Level Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Risk Assessment
        </h2>
        <RiskBadge riskLevel={result.risk_level} />
      </div>
    </div>
  );
};

export default ResultCard;
