# News Tracker

A modern React application for tracking and monitoring news articles about companies across different news sources. Built with React, Vite, and TailwindCSS.

## Features

- 🔍 Search and track multiple companies
- ⏱️ Filter news by time range (7 days to 1 month)
- 🌐 Filter by specific domains (MarketWatch, Yahoo)
- 📰 Filter by news sources
- 📱 Responsive design with a modern UI
- 📥 Export results to Excel
- 📊 Pagination support
- 🎨 Modern glassmorphism design

## Tech Stack

- React 18
- Vite 6
- TailwindCSS 4
- Radix UI Components
- Axios for API calls
- XLSX for Excel export
- Lucide React for icons

## Vite Plugins

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd news-dash
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env` file in the root directory:
```env
VITE_API_URL=your_api_url_here
```

## Deployment

This project is configured for deployment on Vercel. The configuration can be found in `vercel.json`.

To deploy:

1. Push your changes to your repository
2. Connect your repository to Vercel
3. Vercel will automatically deploy your application

## Project Structure

```
news-dash/
├── src/
│   ├── components/
│   │   ├── ui/          # Reusable UI components
│   │   └── NewsTrackerUIv2.jsx
│   ├── lib/
│   │   └── axios.js     # API configuration
│   ├── App.jsx
│   └── main.jsx
├── public/
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.