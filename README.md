# Dinu Task App - Role-Based Task Management

A professional Full-Stack Task Management application featuring specialized roles for Managers and Employees. Managers can assign and delete tasks, while Employees focus on completing their assigned work.

## 🚀 Tech Stack
- **Frontend:** React (Vite 6), Tailwind CSS, Lucide Icons, Axios
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Authentication:** JSON Web Tokens (JWT) & Bcrypt.js

## ✨ Key Features
- **Role-Based Access (Manager vs Employee):**
  - **Managers:** Can create/assign tasks to specific employees and delete tasks.
  - **Employees:** Can view their assigned tasks and mark them as 'Completed'.
- **Secure Authentication:** JWT-based login with role persistence.
- **Dynamic Dashboard:** Real-time task status updates and role-specific UI elements.
- **Premium Design:** Fully responsive, modern UI with glassmorphism effects and custom animations.
- **Auto-Sync Database:** Backend automatically initializes and migrates necessary MySQL tables.

## 🛠️ Local Setup Instructions

### 1. Prerequisites
- **Node.js** (v18+)
- **MySQL** installed and running

### 2. Clone and Install
```bash
# Clone the repository
git clone https://github.com/Dinesh3072002/Task-Assign-app
cd Task-Assign-app

# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

### 3. Database Configuration
1. Create a MySQL database (e.g., `task_manager`).
2. Navigate to the `backend` folder and create a `.env` file:
   ```bash
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_root_user
   DB_PASS=your_password
   DB_NAME=task_manager
   JWT_SECRET=any_secret_key
   ```
3. The application will automatically create the required tables upon the first run.

### 4. Run the Application
**Start the Backend:**
```bash
cd backend
npm run dev
```

**Start the Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`.

---
Created by **Dinesh**
