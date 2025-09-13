# Expense Tracker App

A full-stack web application built with MERN stack that helps users manage their personal finances by tracking income and expenses, offering insightful summaries with interactive features.

---

## Demo

expense-tracker-app-henna-alpha.vercel.app

---

## Features

- User Authentication with JWT (Sign up, Login, Logout)
- Add, Edit, Delete single or multiple transactions
- Filter and Search transactions by type, title, or category
- View summary cards for Total Income, Total Expense, and Balance
- Responsive design supporting different screen sizes
- Dynamic and interactive UI animations using Framer Motion
- Confetti effects for key actions (e.g., transaction deletion)
- Visualization and particle effects for enhanced user experience
- Hosted deployment with continuous integration

---

## Screenshots

### Login Page

![Login Page](https://github.com/Mangalam-17/Expense-Tracker-App/blob/fbf11b631339e4b3e99bfcf74ceb134b3664e773/Screenshots/LoginPage.png)

### Signup Page

![Signup Page](https://github.com/Mangalam-17/Expense-Tracker-App/blob/fbf11b631339e4b3e99bfcf74ceb134b3664e773/Screenshots/SingupPage.png)

### Dashboard / Home Page

![Home Page](https://github.com/Mangalam-17/Expense-Tracker-App/blob/fbf11b631339e4b3e99bfcf74ceb134b3664e773/Screenshots/HomePage.png)

### Add Transaction Form

![Add Transaction Form Page](https://github.com/Mangalam-17/Expense-Tracker-App/blob/fbf11b631339e4b3e99bfcf74ceb134b3664e773/Screenshots/AddTransaction.png)

### Edit Transaction Form

![Edit Transaction Form Page](https://github.com/Mangalam-17/Expense-Tracker-App/blob/fbf11b631339e4b3e99bfcf74ceb134b3664e773/Screenshots/EditTransaction.png)

---

## Technologies Used

- Frontend: React.js, React Router, Context API, Tailwind CSS, Framer Motion, react-toastify
- Backend: Node.js, Express.js, MongoDB, Mongoose (assumed backend stack)
- Authentication: JWT Tokens with secure storage and axios interceptors
- Deployment: Vercel / Render / GitHub Pages (specify your deploy platform)
- Packages: react-tsparticles for particle effects, react-confetti for celebration effects

---

## Installation and Setup

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/expense-tracker-app.git
   ```

2. Install dependencies:

   ```
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. Setup environment variables:

   Create `.env` files in backend and frontend with:

   **Backend `.env`**

   ```
   MONGO_URI = your_mongodb_connection_string
   JWT_SECRET = your_jwt_secret_key
   PORT = 5000
   ```

   **Frontend `.env`**

   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Run the backend server:

   ```
   cd backend
   npm run dev
   ```

5. Run the frontend React app:

   ```
   cd ../frontend
   npm run dev
   ```

6. Navigate to `http://localhost:5173` to use the app.

---

## Folder Structure

```
/backend
  |-- controllers
  |-- models
  |-- routes
  |-- middleware
  |-- server.js
/frontend
  |-- src
      |-- components
      |-- context
      |-- pages
      |-- utils
      |-- App.jsx
      |-- main.jsx
```

---

## Usage

- Register a new user or login with existing credentials.
- Add income and expense transactions with title, category, amount, and date.
- Edit or delete transactions individually or all at once using provided buttons.
- Use filters and search to organize and find transactions.
- View real-time updates on your total income, expenses, and balance.
- Experience engaging animations and UI feedback throughout actions.

---

## Contribution

Contributions are welcome! Please open an issue or submit a pull request for any feature requests, bug fixes, or improvements.

---

## License

This project is licensed under the MIT License.

---

## Contact

GitHub: https://github.com/Mangalam-17
