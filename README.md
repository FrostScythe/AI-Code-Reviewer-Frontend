# AI-Code-Reviewer-Frontend

A frontend application for **AI-powered Code Review** that lets users submit code and receive automatic review feedback. Built with **React** and **Tailwind CSS**, this UI works with an AI Code Reviewer backend to display results, manage reviews, and provide an interactive developer experience.

## 🚀 Features

* Responsive UI built with **React**
* Code submission interface with syntax highlighting
* Displays AI-generated code review results
* History of past reviews (if backend supports it)
* Tailwind CSS for modern styling
* Connects to a backend AI Code Reviewer API

## 📦 Tech Stack

**Frontend**

* React (Create React App)
* Tailwind CSS
* React Router (for navigation)
* Axios / Fetch for API requests
* Prism.js or similar for code highlighting (optional, if included)

## 📁 Repository Structure

```
📦 AI-Code-Reviewer-Frontend
 ┣ 📂 public
 ┣ 📂 src
 ┃ ┣ 📂 components      # React UI components
 ┃ ┣ 📂 pages           # Pages/screens
 ┃ ┣ 📂 styles          # Tailwind / CSS files
 ┃ ┣ App.jsx
 ┃ ┗ index.jsx
 ┣ .gitignore
 ┣ package.json
 ┣ tailwind.config.js
 ┗ README.md
```

## 📌 Prerequisites

Make sure you have:

* Node.js (v16+ recommended)
* npm or Yarn
* A running backend API for code reviews

## 🛠 Installation

1. **Clone the repo**

```bash
git clone https://github.com/FrostScythe/AI-Code-Reviewer-Frontend.git
cd AI-Code-Reviewer-Frontend
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Configure environment**

Create a `.env` file in the project root (if the app requires API URL configuration):

```
VITE_API_BASE_URL=http://localhost:3000
```

(adjust according to your backend)

## 📡 Development

Start the frontend in development mode:

```bash
npm start
# or
yarn start
```

This launches the app at `http://localhost:3000` (or the configured port) and updates automatically on changes.

## 📦 Build

To create a production build:

```bash
npm run build
# or
yarn build
```

The output will be in the `build/` directory, ready to be served or deployed.

## 🔗 API Integration

This frontend expects a backend that:

* Accepts code submissions via POST requests
* Returns AI-generated review feedback
* Optionally provides review history and metadata

Example API call (pseudo):

```js
await axios.post(`${API_BASE_URL}/review`, {
  code: selectedCode,
});
```

## 📝 Tailwind & Styling

This project uses **Tailwind CSS**. You can modify `tailwind.config.js` to suit your design needs.

## 🖼 Screenshots

*(Add screenshots here showing how the app looks)*

## 🤝 Contribution

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push and open a pull request

## 📄 License

This project is licensed under the **GPL-3.0 License**. ([github.com][1])

---

For the corresponding backend API service, see the AI-Code-Reviewer-Backend repository: https://github.com/FrostScythe/AI-Code-Reviewer-Backend
