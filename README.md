# 🔐 AI Password Strength Analyzer (Frontend)

An AI-powered password strength analyzer built with Vue 3 that evaluates passwords using a real deep learning model instead of traditional rule-based methods.

---

## ✨ Features

* ⚡ Real-time password analysis using API
* 🧠 AI-powered evaluation (BiLSTM model)
* 🎯 Confidence scoring (Weak / Medium / Strong)
* 📊 Detailed breakdown (entropy, character stats, rules)
* 💡 Smart suggestions based on real-world attack patterns
* 📧 Contact form powered by **EmailJS**
* 🎨 Modern UI with animations (GSAP + Tailwind)

---

## 🧠 Why This Is Different

Most password checkers rely on simple rules like:

* Length
* Uppercase/lowercase
* Symbols

This app uses a trained **BiLSTM neural network** that learned from:

* ~850K real leaked passwords (RockYou dataset)
* Adversarial patterns (leet speak, keyboard walks)
* Human-generated weak passwords

➡️ It detects patterns attackers *actually use*

---

## 🛠 Tech Stack

* Vue 3 (Composition API)
* Vite
* TailwindCSS
* GSAP (animations)
* Axios (API calls)
* EmailJS (frontend email sending)

---

## ⚙️ Setup

```bash
git clone <your-repo>
npm install
npm run dev

---

## 🔌 API Configuration

Update the API base URL:

```js
// services/api.js
const API = axios.create({
  baseURL: "https://your-fastapi-url.onrender.com"
})
```
## 📧 EmailJS Configuration

This project includes a contact form that sends messages via **EmailJS** without exposing private credentials.

1. Create an account at [EmailJS](https://www.emailjs.com/).  
2. Add an email service (e.g., Gmail, Outlook).  
3. Create an email template with variables: `from_name`, `from_email`, `subject`, `message`.  
4. Get your **Service ID**, **Template ID**, and **Public Key**.  
5. Add these to your `.env` file (or platform environment variables):

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
---

## 🚀 Build for Production

```bash
npm run build
```

---

## ⚠️ Security Note

* Passwords are sent to the backend for analysis
* Do NOT use real passwords in production demos
* In production, consider:

  * HTTPS only
  * Rate limiting
  * Logging disabled for inputs

---

## 📸 Preview

> AI-powered password analysis with modern UI and smooth animations.

---

## 👨‍💻 Author

Built as part of an AI + Fullstack project.
