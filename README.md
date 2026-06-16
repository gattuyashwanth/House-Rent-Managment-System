# House Rent Management System

A premium full-stack MERN web application for property owners to list rentals and for admins to manage the platform. Features a modern, responsive UI inspired by leading real-estate platforms.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, Bootstrap 5, React Router, Axios, React Icons, Recharts, React Toastify |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Auth | JWT, bcryptjs, Role-Based Access Control |

## Roles

- **Admin** — Manage owners, approve/reject properties, view analytics
- **Owner** — List and manage rental properties
- **Public** — Browse, search, filter properties and contact owners

> No tenant dashboard — visitors contact owners directly.

## Features

- Premium landing page with hero, search, categories, testimonials
- Dark mode support
- Toast notifications & loading animations
- Admin dashboard with charts and analytics
- Owner dashboard with grid/table property views
- Property approval workflow
- Fully responsive sidebar navigation

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally or MongoDB Atlas

### Backend
```powershell
cd backend
npm install
# Configure backend/.env (see .env.example)
npm run dev
```

### Frontend
```powershell
cd frontend
npm install
npm start
```

- **Frontend:** http://localhost:3000
- **API:** http://localhost:5000/api

## Default Admin

| Email | Password |
|-------|----------|
| gattuyashwanth22@gmail.com | admin123 |

## Routes

### Public
| Route | Page |
|-------|------|
| `/` | Home |
| `/properties` | Browse Properties |
| `/property/:id` | Property Details |
| `/about` | About |
| `/contact` | Contact |
| `/login` | Login |
| `/register` | Owner Registration |

### Admin
| Route | Page |
|-------|------|
| `/admin/dashboard` | Overview & Charts |
| `/admin/owners` | Manage Owners |
| `/admin/properties` | Manage Properties |
| `/admin/reports` | Reports & Analytics |
| `/admin/settings` | Settings |

### Owner
| Route | Page |
|-------|------|
| `/owner/dashboard` | Dashboard |
| `/owner/add-property` | Add Property |
| `/owner/my-properties` | My Properties |
| `/owner/profile` | Profile |
| `/owner/settings` | Settings |

## Frontend Structure

```
src/
├── assets/
├── components/
│   ├── common/       # StatCard, PropertyCard, Sidebar, LoadingSpinner...
│   └── public/       # Navbar, Footer, SearchBar...
├── layouts/          # PublicLayout, AdminLayout, OwnerLayout
├── pages/
│   ├── admin/
│   ├── owner/
│   └── public/
├── routes/           # AppRoutes, ProtectedRoute
├── context/          # AuthContext, ThemeContext
├── services/         # Axios API client
└── utils/            # Constants, helpers, sample data
```

## License

MIT
