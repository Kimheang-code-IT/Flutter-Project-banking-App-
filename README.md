# Admin Dashboard - Vue 3 + Vite + Tailwind CSS

A modern admin dashboard built with Vue 3 (Composition API), Vite, and Tailwind CSS.

## Features

- **Left Sidebar**: Navigation menu with 6 menu items (Dashboard, Category, Product, Pos, Report, User)
- **Top Navbar**: Search bar, fullscreen toggle, profile section, and logout button
- **Category Management**: Detailed view with scrollable table (sticky header) and input form
- **Responsive Design**: Works on desktop and mobile devices
- **Vue Router**: Client-side routing for navigation

## Project Structure

```
Frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.js
│   ├── style.css
│   ├── App.vue
│   ├── components/
│   │   ├── Sidebar.vue
│   │   └── Navbar.vue
│   ├── views/
│   │   ├── DashboardView.vue
│   │   ├── CategoryView.vue
│   │   ├── ProductView.vue
│   │   ├── PosView.vue
│   │   ├── ReportView.vue
│   │   └── UserView.vue
│   └── router/
│       └── index.js
└── README.md
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Architecture

The application uses a component-based architecture with Vue 3's Composition API:

- **App.vue**: Root component that sets up the main layout (sidebar + navbar + content area)
- **Sidebar.vue**: Left navigation menu with active state highlighting
- **Navbar.vue**: Top navigation bar with search, fullscreen toggle, profile, and logout
- **Router**: Vue Router handles navigation between different views
- **Views**: Each menu item has its own view component
- **CategoryView.vue**: Implements a two-panel layout with a scrollable table (sticky header) and input form

The layout is fully responsive using Tailwind CSS grid and flexbox utilities. The Category page uses a 3-column grid on large screens (table takes 2 columns, form takes 1) and stacks vertically on smaller screens.

