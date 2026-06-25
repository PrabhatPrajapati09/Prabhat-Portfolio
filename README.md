# 🐦‍🔥Prabhat Prajapati - MERN Stack Developer Portfolio

A modern, fully responsive developer portfolio built using the **MERN Stack**. It serves as both a personal portfolio and a lightweight Content Management System (CMS), allowing dynamic updates to portfolio content without modifying the source code.

The project features a custom admin dashboard, real-time analytics, secure authentication, theme switching, GitHub activity integration, project management, and responsive UI designed for desktop, tablet, and mobile devices.

---

## 🌐 Live Demo

**Portfolio:** https://prabhatp-portfolio.vercel.app

---

# ✨ Features

### Portfolio Website

* Fully responsive design
* Dark & Light theme support
* Dynamic Hero section
* About section
* Skills section
* Projects showcase
* Featured Project Spotlight
* Contact form integration
* GitHub contribution calendar
* Social links
* Background music with persistent playback
* SEO-friendly structure

---

### Admin Dashboard

A custom CMS built specifically for managing portfolio content.

Features include:

* Secure JWT Authentication
* Portfolio content management
* Skills CRUD
* Projects CRUD
* Featured project management
* Contact message management
* Analytics Dashboard
* Theme-aware dashboard
* Real-time data updates
* Protected Admin Routes

---

### Analytics

Tracks important portfolio metrics including:

* Total Portfolio Views
* Project Clicks
* Contact Button Clicks
* Resume Downloads
* Visitor Activity

---

### Contact System

Visitors can contact directly using the portfolio form.

Features:

* EmailJS integration
* Form validation
* Success/Error feedback
* Future-ready MongoDB message storage

---

## 🛠 Tech Stack

### Frontend

* React.js
* React Router DOM
* Tailwind CSS
* Axios
* React Icons
* React GitHub Calendar

---

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt
* CORS
* dotenv

---

### Tools

* Git
* GitHub
* Vercel
* Render
* MongoDB Atlas
* Postman
* Thunder Client
* VS Code

---

# 📂 Folder Structure

```text
portfolio/

├── client/
│
├── src/
│ ├── assets/
│ ├── components/
│ ├── context/
│ ├── hooks/
│ ├── pages/
│ ├── utils/
│ ├── App.jsx
│ └── main.jsx
│
└── package.json


server/

├── controllers/
├── middleware/
├── models/
├── routes/
├── config/
├── server.js
|
└── package.json
```

---

# 📦 Installation

Clone the repository

```bash
git clone https://github.com/PrabhatPrajapati09/portfolio.git
```

Move inside the project

```bash
cd portfolio
```

---

## Backend Setup

```bash
cd server

npm install

npm run dev
```

Backend will start on

```
http://localhost:8800
```

---

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend will start on

```
http://loclhost:5173
```

---

# 🔐 Environment Variables

Create a `.env` file inside the backend.

```env
PORT=8800
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
ADMIN_EMAIL=your_admin_email
ADMIN_SECRET_KEY=your_admin_secret
```

Frontend

```env
VITE_API_BASE_URL=http://localhost:8800/api
```

---

# 🧩 Core Features

* Dynamic Portfolio Configuration
* Admin Authentication
* CRUD Operations
* Responsive Layout
* Theme Persistence
* Protected Routes
* REST API Architecture
* Analytics Tracking
* GitHub Contribution Graph
* Background Audio System
* Reusable Component Architecture
* MongoDB Powered CMS

---

# 🔒 Security

* JWT Protected Admin APIs
* Password Hashing using bcrypt
* Environment Variable Protection
* Protected Admin Routes
* Secure MongoDB Connection
* Request Validation

---

# 📈 Future Improvements

* Store contact messages in EmailJS
* Resume download analytics
* Project categories
* Admin activity logs
* Dashboard charts
* Visitor location analytics
* Email notifications

---

# 🤝 Contributing

Contributions, suggestions, and feature requests are welcome.

Feel free to fork the repository and submit a Pull Request.

---

# 👨‍💻 Author

**Prabhat Prajapati**

GitHub: https://github.com/PrabhatPrajapati09

Portfolio: https://virdev.vercel.app

LinkedIn: https://www.linkedin.com/in/prabhat-prajapati-266423323

Email: [work.prabhat73@gmail.com](mailto:work.prabhat73@gmail.com)

---

## ⭐ Show Your Support

If you found this project useful, consider giving it a ⭐ on GitHub.
