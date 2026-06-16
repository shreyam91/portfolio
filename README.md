# Shreyam's Portfolio & CodeStreak 🚀

![Banner](https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80)

Welcome to a dynamic, full-stack application that serves as both a **Personalized Portfolio** and an interactive **CodeStreak Dashboard**. 

This platform demonstrates professional experience, an interactive timeline of projects, Campfire Notes (blogs), and a real-time integration with my personal problem-solving tracker, designed to make coding interview preparation structured, engaging, and consistent.

---

## ✨ Features

- **Personalized Portfolio:** A seamless journey map of my projects, skills timeline, and thoughts.
- **Dynamic Dark/Light Mode:** Full integration of themes with smooth transitions across the entire platform.
- **CodeStreak Dashboard:** Real-time synchronization displaying live consistency metrics across DSA, System Design, and Machine Coding.
- **Cinematic Visuals:** Includes an interactive, scrollable project map and a stunning visual diary (Image Gallery).
- **Pattern-based Learning Approach:** Focuses on tracking consistency over intensity to build long-term retention.
- **Backend API Integration:** Custom Express backend connecting to MongoDB for accurate, live streak tracking.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion, TypeScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Styling & UI:** Custom design system, Tailwind CSS variables, React Icons

---

## 📸 Project Vision

Most developers face the same challenges when tracking progress or showcasing their work:
- Disconnected personal projects and scattered notes
- Difficulty staying consistent with coding practice
- Lack of a centralized platform to visualize their journey

This unified platform solves this by **transforming interview prep into a sustainable daily habit** while simultaneously **showcasing growth** to potential employers and collaborators.

The goal is simple:
> Track one pattern at a time.  
> Stay consistent.  
> Build long-term retention.

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/shreyam91/CodeStreak.git
cd CodeStreak
```

### 2️⃣ Install Dependencies

**Frontend**
```bash
cd frontend
npm install
```

**Backend**
```bash
cd backend
npm install
```

### 3️⃣ Setup Environment Variables

Create `.env` files in both directories.

**Backend `.env` Example:**
```env
PORT=4000
MONGODB_URI=mongodb+srv://<your_username>:<your_password>@cluster.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=super_secret_access_token_key_for_development
```

**Frontend `.env.local` Example:**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### 4️⃣ Run the Application

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

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📂 Project Structure

```bash
CodeStreak/
│
├── frontend/        # Next.js user-facing portfolio and dashboard
├── backend/         # Express.js API & MongoDB schemas
└── README.md
```

---

## 🎯 Future Improvements

- AI-powered project recommendations
- Personalized learning plans
- Leaderboard support for public streak comparisons
- Advanced filtering for the Campfire Notes blog

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m "Add new feature"`)
4. Push to GitHub (`git push origin feature-name`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.
