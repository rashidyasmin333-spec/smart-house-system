# Smart Housing System (SHS)

## Overview

**Smart Housing System (SHS)** is a digital platform designed to improve access to affordable, reliable, and verified housing services.

The system connects **tenants, landlords, housing organizations, and administrators** through a centralized platform where users can search, manage, verify, and report housing information.

The project aims to reduce challenges such as:
- Difficulty finding affordable houses
- Fake housing advertisements
- Lack of reliable housing information
- Poor communication between tenants and landlords

---

## Objectives

The main objectives of SAHS are:

- Provide a centralized housing information platform
- Help users find houses based on location and budget
- Reduce housing fraud through property verification
- Improve communication between tenants and landlords
- Support housing organizations in managing housing services

---

## Key Features

### User Management
- User registration
- Login authentication
- Profile management
- Role-based access control

### Property Management
Landlords can:
- Add new properties
- Upload house images
- Update property details
- Manage available houses

### Smart House Search
Users can search houses using:
- Location
- Price range
- House type
- Availability status

### Location-Based Services
Features:
- Map integration
- Nearby houses discovery
- Location filtering

### Communication System
Allows:
- Tenant and landlord communication
- Notifications
- Inquiry management

### Reporting System
Users can report:
- Fake listings
- Housing problems
- Incorrect information

### Future AI Features
Planned improvements:
- AI house recommendations
- Price prediction
- Fraud detection
- Smart housing assistant

---

## System Architecture

The system follows a three-layer architecture:

```text
             Users
               |
               |
      Mobile/Web Application
               |
               |
          Backend API
               |
               |
          Database
```

### Layers

#### Presentation Layer
Responsible for user interaction.
Technologies:
- Web technologies (HTML/CSS/JavaScript)

#### Application Layer
Responsible for:
- Authentication
- Business logic
- Data processing
- API services
Technologies:
- Spring Boot

#### Database Layer
Stores:
- Users
- Properties
- Reports
- Messages
- Locations
Technologies:
- PostgreSQL

---

## Technologies

### Frontend
- HTML/CSS/JavaScript

### Backend
- Spring Boot

### Database
- PostgreSQL

### Other Services
- Google Maps API
- Cloud Storage
- Authentication Services

---

## User Roles

### Tenant
Can:
- Register account
- Search houses
- View property details
- Contact landlords
- Report problems

### Landlord
Can:
- Create listings
- Manage properties
- Receive tenant requests

### Administrator
Can:
- Verify properties
- Manage users
- Review reports
- Maintain system security

---

## Project Structure

Example:
```text
SHS/
│
├── frontend/
│ ── web-app/
│
├── backend/
│ ├── controllers/
│ ├── services/
│ ├── models/
│ └── database/
│
├── documentation/
│ ├── SRS.docx
│ ├── SDD.docx
│ └── concept notes.docx
│
└── README.md
```

---

## Database Design

Main entities:

### User
- `user_id`
- `name`
- `email`
- `phone`
- `password`
- `role`

### Property
- `property_id`
- `owner_id`
- `title`
- `location`
- `price`
- `description`
- `status`

---

## Clone Repository
```bash
git clone https://github.com/suhayb-coder/Smart-Housing-System.git
```
