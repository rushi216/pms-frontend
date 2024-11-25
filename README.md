# Performance Management System (PMS) Frontend

A React-based frontend application for managing employee performance reviews. Built with Vite, Material-UI, and Azure AD authentication.

## Features

- Azure AD Authentication
- Performance Review Management
- Team Member Reviews
- Quarter-based Review Cycles

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
- Copy `.env.example` to `.env`
- Update Azure AD credentials and API URL in `.env`

3. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Environment Variables

- `VITE_API_BASE_URL`: Backend API URL
- `VITE_AZURE_CLIENT_ID`: Azure AD Client ID
- `VITE_AZURE_AUTHORITY`: Azure AD Authority URL
- `VITE_AZURE_REDIRECT_URI`: Application redirect URI
