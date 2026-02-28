import React from 'react';

const RiskBadge = ({ riskLevel }) => {
  const getRiskStyles = () => {
    const level = riskLevel?.toLowerCase() || '';
    
    if (level.includes('low')) {
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-300',
        label: 'Low Risk'
      };
    } else if (level.includes('moderate') || level.includes('medium')) {
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-300',
        label: 'Moderate Risk'
      };
    } else if (level.includes('high')) {
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-300',
        label: 'High Risk'
      };
    }
    
    return {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-300',
      label: riskLevel || 'Unknown'
    };
  };

  const styles = getRiskStyles();

  return (
    <div className={`inline-flex items-center px-4 py-2 rounded-full border-2 ${styles.bg} ${styles.text} ${styles.border} font-semibold text-lg`}>
      <span className="mr-2">●</span>
      {styles.label}
    </div>
  );
};

export default RiskBadge;
