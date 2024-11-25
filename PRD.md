# Performance Review Tracker - Frontend

## Product Description
The Performance Review Tracker frontend will enable organization users to interact with the system. It will provide separate interfaces for employees, managers, and admins to view and manage performance reviews. The UI will be intuitive, responsive, and align with organizational requirements.

## Objectives
- Provide an interface for employees to view performance reviews.
- Enable managers to create, edit, and view reviews for their assigned employees.
- Allow admins to manage user assignments and view organization-wide data.

## Tech Stack
- **Framework**: React with Vite
- **UI Library**: Material UI (MUI)
- **Authentication**: Azure Entra ID with msal/auth.js for login.
- **Communication**: Frontend will communicate with the backend using REST APIs.

## Features

### Authentication
- **Azure Entra ID Integration**: Users log in using their organizational credentials.
- **Token Management**: Use msal/auth.js to obtain a bearer token and pass it to the backend.

### Dashboard
- **Top Bar**:
  - Left: Application name.
  - Right: Logged-in user ID and sign-out button.
- **Sidebar**:
  - **Reviews Tab**: Access and edit reviews.
  - **Team Tab**: View assigned employees.
  - **Admin Tab**: Manage user assignments.

### Reviews Tab
- **Filters**:
  - Year: Dropdown with options for specific years and "All."
  - Quarter: Dropdown with options for specific quarters and "All."
  - User: Dropdown with employee names and "All."
- **Review Display**:
  - Display questions and corresponding answers for each review.
  - Editable fields for answers (using a simple rich text editor).
  - A "Save" button to submit changes for all edited reviews at once.

### Team Tab
- Display a list of employees assigned to the logged-in manager.
- Provide basic information such as employee name and email.

### Admin Tab
- **User Management**:
  - List all users in the organization.
  - Allow assignment of a manager to an employee.

## Data Handling
- Use API calls to fetch and submit review data, user assignments, and team details.
- Ensure secure communication by passing bearer tokens with each request.