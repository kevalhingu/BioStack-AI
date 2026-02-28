# BioStack Clinical Snapshot Engine - Frontend

A production-ready React frontend for the BioStack Clinical Snapshot Engine, built for the AI for Bharat Hackathon 2026.

## Features

- Clean medical-tech aesthetic with blue and teal accents
- Responsive design that works on all devices
- Real-time medical record analysis
- Structured clinical summary display
- Dynamic risk level indicators with color coding
- Smooth animations and transitions
- Comprehensive error handling
- Professional hackathon demo quality

## Tech Stack

- **React 18** - Modern React with functional components and hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **JavaScript** - No TypeScript for simplicity

## Project Structure

```
biostack-frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── Header.jsx
│   │   ├── InputForm.jsx
│   │   ├── ResultCard.jsx
│   │   └── RiskBadge.jsx
│   ├── App.jsx          # Main application component
│   ├── config.js        # API configuration
│   ├── index.css        # Global styles and Tailwind imports
│   └── main.jsx         # Application entry point
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── vite.config.js       # Vite configuration
```

## Prerequisites

- Node.js 16+ and npm installed
- Backend API running at `http://3.239.32.114:8000`

## Installation

1. Navigate to the project directory:
```bash
cd biostack-frontend
```

2. Install dependencies:
```bash
npm install
```

## Running Locally

Start the development server:
```bash
npm run dev
```

The application will open automatically at `http://localhost:3000`

## Building for Production

Create an optimized production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## API Configuration

The API endpoint is configured in `src/config.js`:

```javascript
export const API_CONFIG = {
  BASE_URL: 'http://3.239.32.114:8000',
  ENDPOINTS: {
    ANALYZE: '/analyze'
  }
};
```

To change the API URL, simply update the `BASE_URL` value.

## API Integration

### Request Format
```json
POST http://3.239.32.114:8000/analyze
Content-Type: application/json

{
  "text": "Patient: 52 year old male, HbA1c 9.2%, BP 150/95, LDL 170..."
}
```

### Response Format
```json
{
  "patient_summary": "52-year-old male with poorly controlled diabetes...",
  "key_clinical_indicators": [
    "Elevated HbA1c at 9.2%",
    "Hypertension with BP 150/95",
    "Dyslipidemia with elevated LDL"
  ],
  "risk_level": "High"
}
```

## Component Overview

### Header.jsx
Displays the application title and subtitle with gradient background.

### InputForm.jsx
- Large textarea for medical record input
- Placeholder with example data
- Analyze button with loading state
- Disabled state during API calls

### ResultCard.jsx
- Patient Summary section
- Key Clinical Indicators as bullet list
- Risk Assessment with dynamic badge
- Smooth fade-in animation

### RiskBadge.jsx
- Dynamic color coding:
  - Low Risk → Green
  - Moderate Risk → Yellow
  - High Risk → Red

## Error Handling

The application handles:
- Network errors (server unreachable)
- Timeout errors (30-second timeout)
- Server errors (4xx, 5xx responses)
- Invalid responses

All errors are displayed in a user-friendly red alert box.

## Styling

- Tailwind CSS for utility-first styling
- Custom color palette for medical-tech aesthetic
- Responsive design with mobile-first approach
- Custom animations for smooth UX
- Professional spacing and typography

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Built for AI for Bharat Hackathon 2026. Decision support only.

## Disclaimer

This system uses synthetic data and is intended for demonstration purposes only. Not for clinical use.
