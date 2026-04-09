# 🌍 War Monitor — Global Conflict Intelligence Dashboard

Real-time interactive dashboard tracking active wars and conflicts worldwide. Built with React, Leaflet, and Tailwind CSS.

![War Monitor](https://img.shields.io/badge/status-active-red?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-6-purple?style=flat-square&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3-blue?style=flat-square&logo=tailwindcss)

## Features

- 🗺️ **Interactive World Map** — Conflict zones visualized on a dark-themed Leaflet map with severity-coded markers
- 📊 **Real-time Stats** — Casualty counts, displacement numbers, and severity breakdowns at a glance
- 🔍 **Advanced Filtering** — Filter by severity, region, conflict type, or free-text search
- 📋 **Detail View** — Comprehensive conflict profiles with parties, casualties, timeline, and status
- 🔴 **Live Alert Ticker** — Breaking updates from critical/high severity conflict zones
- 🌙 **Dark Tactical Theme** — Military-inspired dark UI with scan-line effects and pulse animations

## Data Sources

Conflict data is compiled from multiple authoritative sources:
- [ACLED (Armed Conflict Location & Event Data)](https://acleddata.com/)
- [Uppsala Conflict Data Program (UCDP)](https://ucdp.uu.se/)
- [International Crisis Group (ICG)](https://www.crisisgroup.org/)
- [IISS Armed Conflict Survey](https://www.iiss.org/)

> ⚠️ **Disclaimer**: Data is for informational and educational purposes only. Casualty and displacement figures are estimates from various sources and may vary.

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Feelzaa/war-monitor.git
cd war-monitor

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite 6 | Build tool & dev server |
| Tailwind CSS 3 | Utility-first styling |
| Leaflet + React-Leaflet | Interactive mapping |
| Lucide React | Icon system |

## Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Top bar with live clock
│   ├── StatsCards.jsx       # Summary statistics cards
│   ├── FilterPanel.jsx      # Search & multi-filter panel
│   ├── ConflictList.jsx     # Sidebar conflict index
│   ├── ConflictMap.jsx      # Interactive Leaflet map
│   ├── ConflictDetail.jsx   # Detailed conflict cards
│   └── NewsTicker.jsx       # Scrolling alert ticker
├── data/
│   └── conflicts.js         # Conflict dataset & config
├── App.jsx                  # Main app layout
├── main.jsx                 # Entry point
└── index.css                # Global styles & Leaflet theme
```

## Deployment

The project is configured for GitHub Pages deployment:

```bash
npm run build
# Output in dist/ — deploy to any static host
```

## Contributing

Contributions welcome! Areas where help is needed:
- Adding more conflict data / keeping data current
- Integrating real-time APIs (ACLED, GDELT)
- Adding timeline/historical view
- Mobile responsive improvements
- Accessibility enhancements

## License

MIT © [Feelzaa](https://github.com/Feelzaa)
