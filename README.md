# S84_KrishanGoyal_Capstone_SkillHire

## Summary

Skill Hire is a web platform connecting clients with service providers for both short-term (daily workers) and long-term (skilled professionals) tasks. The platform offers two distinct UIs: Go UI for daily workers and Pro UI for professionals, with a shared backend for seamless management. It includes features like job posting, real-time chat, a rating system, payment processing (via RazorPay), and an escrow service. The development timeline spans 6 weeks, focusing on planning, UI design, backend integration, testing, and deployment. Key technologies include React, MongoDB, Express.js, and Socket.io for real-time features. The project aims to bridge the gap between clients needing work and skilled service providers.

## **2.2 Tech Stack Details**  


| **Component**       | **Technology**                | **Version**| **Purpose**                              |  
|---------------------|-------------------------------|------------|------------------------------------------|  
| Frontend Framework  | React.js                      | 18+        | Interactive UI components                |  
| Build Tool          | Vite                          | 4+         | Fast development environment             |  
| State Management    | Context API + useReducer      | Native     | Global state handling                    |  
| Styling             | CSS                  	      | 3+         | Utility-first responsive design          |  
| Backend Framework   | Express.js         t          | 4.18+      | REST API development                     |  
| Database            | MongoDB Atlas                 | 6.0+       | NoSQL document storage                   |  
| Authentication      | JWT                           | -          | Secure user sessions                     |  
| Payments            | RazorPay API                  | -          | Escrow and payout processing             |  
| Realtime Features   | Socket.io                     | 4.7+       | Instant notifications and chat           |  
| Geospatial          | Google Maps JavaScript API    | -          | Location services and tracking           |  

## Roadmap

### Week 1 - Planning and Setup
* Day 1: 
- Finalize project requirements and detailed features.e
- Set up the project repository and define the folder structure.
- Choose the tech stack and tools (e.g., MongoDB, React).

* Day 2: 
- Design wireframes for both Go and Pro UIs.
- Identify database schema (clients, service providers, jobs, reviews, etc.).

* Day 3-4: 
- Set up the project in React for frontend and Node.js for backend.
- Initialize MongoDB database with necessary collections.

* Day 5-6: 
- Finalize project requirements and detailed features.
- Set up the project repository and define the folder structure.
- Choose the tech stack and tools (e.g., MongoDB, React).

* Day 7: 
- Review project progress and refine wireframes.
- Prepare for Week 2 tasks.

### Week 2 - UI Design and Backend Setup
* Day 1-2: 
- Start implementing Go UI (daily workers interface).
- Develop homepage, user authentication forms (login/signup), and user dashboards.

* Day 3-4: 
- Start implementing Pro UI (skilled professionals interface).
- Develop job posting, task board, and client/job management features.

* Day 5-6: 
- Implement job posting and application feature.
- Develop job categories (short-term, long-term).

* Day 5-6: 
- Finalize project requirements and detailed features.
- Set up the project repository and define the folder structure.
- Choose the tech stack and tools (e.g., MongoDB, React).

* Day 7: 
- Set up basic route testing and debugging.
- Prepare for Week 3 tasks.

### Week 3 - User Interface Completion and Core Features

* Day 1-2: 
- Complete Go UI features: task booking, availability calendar, and service provider search.

* Day 3-4: 
- Complete Pro UI features: project creation, bid submission, client management tools.

* Day 5: 
- Implement a job review/rating system for both types of workers (daily and skilled).

* Day 6-7: 
- Develop a real-time messaging system for communication between clients and service providers.

### Week 4 - Backend Integration and Payment System

* Day 1-2: 
- Integrate the backend with frontend for Go UI and Pro UI.
- Create routes to handle job listings, user profiles, and updates.

* Day 3-4: 
- Implement the payment gateway (RazorPay) for job payments and transactions.
- Create invoice and transaction history features.

* Day 5-6: 
- Test payment processing flow.
- Debug backend routes.

* Day 7: 
- Review progress and prepare for the following week’s testing phase.

### Week 5 - Testing and Bug Fixes

* Day 1-2: 
- Conduct unit testing for backend routes.
- Start testing front-end UI elements.

* Day 3-4: 
- Begin integrated testing: Ensure both Go and Pro UIs are functioning properly.
- Test database transactions (job creation, user management, payments).

* Day 5-6: 
- Perform user acceptance testing (UAT) to get feedback from testers.
- Debug and fix critical issues found in UAT.

* Day 7: 
- Prepare for final testing and deployment.

### Week 6 - Final Testing, Deployment, and Submission

* Day 1-2: 
- Conduct final round of testing (load testing, stress testing).
- Finalize all features and review the platform for security vulnerabilities.

* Day 3-4: 
- Deploy backend on a cloud service (e.g., AWS, Heroku, Render).
- Deploy the frontend on a hosting platform (e.g., Netlify, Vercel).

* Day 5-6: 
- Perform post-deployment testing.
- Implement any final changes based on feedback.

* Day 7: 
- Launch the platform.
- Monitor performance and prepare for the first set of user feedback.



***Backend Deployed Link*** https://s84-krishangoyal-capstone-skillhire.onrender.com/
***Frontend Deployed Link*** https://krishan-skillhire.netlify.app/