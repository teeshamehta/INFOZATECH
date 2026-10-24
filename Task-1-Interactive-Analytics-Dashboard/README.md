# InsightBoard — Interactive Analytics Dashboard

A responsive React + Vite dashboard using Recharts and Lucide icons.

## Features
- Responsive sidebar and dashboard layout
- KPI cards for revenue, orders, customers, and conversion
- Interactive revenue area chart, orders bar chart, and category donut chart
- Reporting period selector (7 days, 30 days, 90 days, this year)
- Search and filters for recent orders by category and status
- Export filtered order rows to CSV
- Sample data included; no database or API required

## Requirements
Install Node.js (LTS) from https://nodejs.org/ if it is not already installed.

## Run in VS Code
1. Extract the ZIP file.
2. Open the `interactive-analytics-dashboard` folder in VS Code.
3. Open Terminal → New Terminal.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL shown in the terminal, usually `http://localhost:5173`.

## Create a production build
```bash
npm run build
```
The generated production files will be in the `dist` folder.

## Notes
All displayed business data is illustrative sample data. This project does not connect to a live store or database.


Profile cleanup: removed the sidebar account profile and top-right initials avatar. No personal name, initials, or profile widgets are included.
