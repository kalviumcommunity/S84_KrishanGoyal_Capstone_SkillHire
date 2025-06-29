# 🚀 SkillHire - Professional Service Platform

<div align="center">
  <img src="./Client/public/SkillHireLogo.png" alt="SkillHire Logo" width="200"/>
  
  [![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue)](https://krishan-skillhire.netlify.app/)
  [![Backend API](https://img.shields.io/badge/Backend%20API-Live-green)](https://s84-krishangoyal-capstone-skillhire.onrender.com/)
</div>

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 About

**SkillHire** is a comprehensive web platform that bridges the gap between clients and service providers, offering solutions for both short-term daily tasks and long-term professional projects. The platform features two distinct user interfaces:

- **🔧 GO Platform**: For daily workers and quick service tasks (cleaning, delivery, repairs, etc.)
- **💼 PRO Platform**: For skilled professionals and complex projects (development, design, consulting, etc.)

### Key Highlights

- **Dual Platform Architecture**: Separate interfaces optimized for different service types
- **Real-time Communication**: Built-in chat system with Socket.io
- **Secure Payments**: Integrated Razorpay payment gateway with escrow services
- **Project Management**: Complete lifecycle management from posting to completion

## ✨ Features

### 🏠 Client Features
- **Project Creation**: Post projects for both GO and PRO services
- **Applicant Management**: Review applications and pitches from service providers
- **Real-time Chat**: Communicate directly with assigned workers
- **Payment Processing**: Secure payment handling with multiple options
- **Project Tracking**: Monitor project progress and completion status

### 👷 GO Worker Features
- **Quick Job Acceptance**: Browse and instantly accept available local tasks
- **Location-based Matching**: Find jobs in your city and locality
- **Category Filtering**: Filter jobs by service category (cleaning, delivery, etc.)
- **Task Management**: Mark tasks as complete and request confirmation
- **Earnings Dashboard**: Track completed tasks and payments

### 💻 PRO Worker Features
- **Project Applications**: Submit detailed pitches for professional projects
- **Portfolio Management**: Showcase skills and previous work
- **Project Dashboard**: Manage assigned projects and deadlines
- **Earnings Analytics**: Detailed earnings reports and transaction history

### 🔒 Security & Trust
- **JWT Authentication**: Secure user authentication and session management
- **Role-based Access**: Different access levels for clients and workers
- **Payment Escrow**: Secure payment holding until project completion
- **Data Validation**: Comprehensive input validation and sanitization

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React.js** | 18+ | Interactive UI components and state management |
| **Vite** | 4+ | Fast development build tool |
| **CSS3** | - | Custom styling and responsive design |
| **Axios** | - | HTTP client for API requests |
| **React Router** | 6+ | Client-side routing and navigation |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime environment |
| **Express.js** | 4.18+ | Web framework for RESTful APIs |
| **MongoDB** | 6.0+ | NoSQL database for data storage |
| **Mongoose** | 7+ | MongoDB object modeling |
| **Socket.io** | 4.7+ | Real-time bidirectional communication |

### Authentication & Security
| Technology | Purpose |
|------------|---------|
| **JWT (jsonwebtoken)** | Secure user authentication |
| **bcryptjs** | Password hashing and security |
| **cors** | Cross-origin resource sharing |

### Payment Services
| Service | Purpose |
|---------|---------|
| **Razorpay** | Payment gateway integration |

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React)       │◄──►│   (Express)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │  GO UI      │ │    │ │Controllers  │ │    │ │Collections  │ │
│ │  PRO UI     │ │    │ │Models       │ │    │ │Users        │ │
│ │  Client UI  │ │    │ │Routes       │ │    │ │Projects     │ │
│ └─────────────┘ │    │ │Middleware   │ │    │ │Chats        │ │
└─────────────────┘    │ └─────────────┘ │    │ └─────────────┘ │
                       └─────────────────┘    └─────────────────┘
                              │
                       ┌─────────────────┐
                       │ External APIs   |
                       |                 │
                       │ • Razorpay      │
                       │                 │
                       │                 │
                       └─────────────────┘
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/skillhire.git
   cd skillhire
   ```

2. **Install Backend Dependencies**
   ```bash
   cd Server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../Client
   npm install
   ```

4. **Set up Environment Variables**
   
   Create `.env` file in the `Server` directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/skillhire
   # or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillhire
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Razorpay (Payment Gateway)
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-key-secret
   
   # Frontend URL
   CLIENT_URL=http://localhost:5173
   ```

   Create `.env` file in the `Client` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

5. **Start the Development Servers**
   
   **Backend Server:**
   ```bash
   cd Server
   npm run dev
   # Server will run on http://localhost:3000
   ```
   
   **Frontend Server:**
   ```bash
   cd Client
   npm run dev
   # Client will run on http://localhost:5173
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173` to see the application in action!

### Quick Setup with Docker (Optional)

If you prefer using Docker:

```bash

# The application will be available at:
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

## 🔐 Environment Variables

### Backend Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | ✅ | - |
| `JWT_SECRET` | JWT secret key | ✅ | - |
| `JWT_EXPIRES_IN` | JWT expiration time | ❌ | 7d |
| `PORT` | Server port | ❌ | 3000 |
| `RAZORPAY_KEY_ID` | Razorpay API key ID | ✅ | - |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret | ✅ | - |
| `CLIENT_URL` | Frontend URL for CORS | ✅ | - |
| `VITE_GOOGLE_CLIENT_ID` | Google Client ID | ✅ | - |

### Frontend Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API URL | ✅ |
| `VITE_GOOGLE_CLIENT_ID` | Google Client ID | ✅ |

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/logout` | User logout |
| `GET` | `/api/auth/me` | Get current user |

### Project Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/go-projects/available` | Get available GO projects |
| `POST` | `/api/go-projects/add` | Create new GO project |
| `POST` | `/api/go-projects/:id/accept` | Accept GO project |
| `GET` | `/api/pro-projects/all` | Get all PRO projects |
| `POST` | `/api/pro-projects/add` | Create new PRO project |
| `POST` | `/api/pro-projects/:id/apply` | Apply to PRO project |

### Chat Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/chats/user/:userId` | Get user chats |
| `POST` | `/api/chats` | Create new chat |
| `GET` | `/api/chats/:chatId/messages` | Get chat messages |

For complete API documentation, visit: [API Docs](https://s84-krishangoyal-capstone-skillhire.onrender.com/api-docs)

## 📁 Project Structure

```
skillhire/
├── Client/                     # Frontend React application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── Components/         # Reusable React components
│   │   ├── Pages/             # Page components
│   │   ├── Styles/            # CSS stylesheets
│   │   ├── context/           # React context providers
│   │   └── main.jsx           # Application entry point
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Vite configuration
│
├── Server/                    # Backend Node.js application
│   ├── Controllers/           # Request handlers
│   ├── Models/                # Database models
│   ├── Routes/                # API routes
|   ├── Services               # Payment Services
│   ├── Middleware/            # Custom middleware
│   ├── Utils/                 # Utility functions
│   ├── package.json           # Backend dependencies
│   └── server.js              # Server entry point
│
├── README.md                  # Project documentation
```

## 🚀 Deployment

### Frontend Deployment (Netlify)

1. **Build the project:**
   ```bash
   cd Client
   npm run build
   ```

2. **Deploy to Netlify:**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables in Netlify dashboard

### Backend Deployment (Render/Heroku)

1. **Prepare for deployment:**
   ```bash
   cd Server
   npm install
   ```

2. **Deploy to Render:**
   - Connect your GitHub repository
   - Set start command: `npm start`
   - Add environment variables in dashboard

### Database (MongoDB Atlas)

1. Create a MongoDB Atlas account
2. Set up a new cluster
3. Get connection string and update `MONGODB_URI`

## 🎨 Screenshots

<details>
<summary>Click to view screenshots</summary>

### Homepage
![Homepage](./screenshots/homepage.png)

### GO Worker Dashboard
![GO Dashboard](./screenshots/go-dashboard.png)

### PRO Worker Dashboard
![PRO Dashboard](./screenshots/pro-dashboard.png)

### Project Details
![Project Details](./screenshots/project-details.png)

</details>

## 🧪 Testing

Run the test suite:

```bash
# Backend tests
cd Server
npm test

# Frontend tests
cd Client
npm test
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit your changes:** `git commit -m 'Add amazing feature'`
4. **Push to the branch:** `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Krishan Goyal**
- GitHub: [@krishangoyal](https://github.com/krishangoyal12)
- LinkedIn: [Krishan Goyal](https://linkedin.com/in/krishangoyal717)
- Email: krishangoyal717@gmail.com

---

<div align="center">
  <p>Made with ❤️ by Krishan Goyal</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>