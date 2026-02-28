import React, { useState } from 'react';

const InputForm = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  const placeholderText = "Patient: 52 year old male, HbA1c 9.2%, BP 150/95, LDL 170\n\nChief Complaint: Routine follow-up for diabetes management\n\nHistory: Patient reports increased thirst and frequent urination over the past 3 months. Non-compliant with medication regimen. Family history of cardiovascular disease.\n\nVitals: BP 150/95 mmHg, HR 88 bpm, BMI 31.2\n\nLab Results:\n- HbA1c: 9.2% (elevated)\n- Fasting glucose: 185 mg/dL\n- LDL cholesterol: 170 mg/dL\n- HDL cholesterol: 38 mg/dL\n- Triglycerides: 220 mg/dL";

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <label htmlFor="medical-record" className="block text-lg font-semibold text-gray-700 mb-3">
          Enter Synthetic Medical Record
        </label>
        <textarea
          id="medical-record"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholderText}
          className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none font-mono text-sm"
          disabled={isLoading}
        />
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Paste or type synthetic patient data for analysis
          </p>
          <button
            type="submit"
            disabled={isLoading || !text.trim()}
            className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full spinner"></div>
                Analyzing...
              </>
            ) : (
              'Analyze Record'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
