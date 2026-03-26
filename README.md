# 🏥 Vanni — AI Medical Coding Assistant

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=for-the-badge&logo=openai&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

<p align="center">
  A mobile-first, ChatGPT-style AI assistant built for medical coding workflows. Supports real-time chat, image uploads, camera capture, and dual-mode operation (Medical Coding & General AI).
</p>

---

## ✨ Features

- **💬 Conversational AI** — Full chat history context, just like ChatGPT. Ask follow-up questions naturally.
- **🏥 Medical Mode** — Specialized assistant for ICD-10, CPT, and HCPCS coding with expert-level context.
- **🌐 General Mode** — Fully capable general-purpose AI assistant for any topic.
- **📷 Image & Camera Upload** — Attach medical documents, EOBs, or clinical notes directly from your device's camera or gallery. Analyzed using GPT-4o Vision.
- **📱 Mobile-First Design** — Optimized for iPhone and Android with a premium dark-mode UI.
- **🔒 Secure by Design** — Your OpenAI API key is stored only in your browser's `localStorage` or a local `.env` file and is **never** sent to any third-party server.
- **🐳 Docker Ready** — Fully containerized with `Dockerfile` and `docker-compose.yml` for self-hosted deployment.

---

## 🖥️ Screenshots

> _Medical coding queries with GPT-4o Vision support, image attachments, and a premium dark UI._

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) `v18+`
- An [OpenAI API Key](https://platform.openai.com/api-keys) with access to `gpt-4o`

### 1. Clone the Repository

```bash
git clone https://github.com/Katta041/Medical-Coding-App.git
cd Medical-Coding-App
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Your API Key

Create a `.env.local` file in the root directory:

```bash
# .env.local
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here
```

> **Note:** This file is listed in `.gitignore` and will **never** be committed to version control.

Alternatively, you can enter your API key directly in the app's **Settings** modal (⚙️ icon in the top-right corner). It will be saved securely in your browser's local storage.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🐳 Docker Deployment (Self-Hosted)

Build and run the production container using Docker Compose:

```bash
docker-compose up -d --build
```

The app will be available at `http://localhost:8080`.

> **Note:** When deploying via Docker, enter your OpenAI API key through the in-app Settings modal — it will be stored securely in the browser.

### Deploying on a VPS (e.g., DigitalOcean, AWS EC2, Linode)

```bash
# 1. SSH into your server
ssh user@your-server-ip

# 2. Clone the repo
git clone https://github.com/Katta041/Medical-Coding-App.git
cd Medical-Coding-App

# 3. Start with Docker Compose
docker-compose up -d --build
```

---

## ☁️ Static Hosting (Free Options)

Since this is a fully frontend application, you can host it for free on:

| Platform | Steps |
|---|---|
| **Vercel** | Connect your GitHub repo at [vercel.com](https://vercel.com) — auto-deploys on every push |
| **Cloudflare Pages** | Connect at [pages.cloudflare.com](https://pages.cloudflare.com) — global CDN, free |
| **GitHub Pages** | Run `npm run build` and deploy the `dist/` folder |

---

## 🏗️ Project Structure

```
Medical-Coding-App/
├── public/
├── src/
│   ├── components/
│   │   ├── ChatFeed.jsx        # Scrollable message list
│   │   ├── ChatFeed.css
│   │   ├── MessageBubble.jsx   # Individual message renderer (markdown support)
│   │   ├── MessageBubble.css
│   │   ├── ChatInput.jsx       # Auto-resize textarea, image/camera upload
│   │   └── ChatInput.css
│   ├── services/
│   │   └── openai.js           # OpenAI GPT-4o API integration (text + vision)
│   ├── App.jsx                 # Root component — tab management, settings modal
│   ├── App.css
│   └── index.css               # Global dark theme design system
├── Dockerfile                  # Multi-stage build (Node → Nginx)
├── docker-compose.yml
├── .gitignore                  # Ensures .env.local is never committed
└── package.json
```

---

## 🤖 AI Model

This application uses **`gpt-4o`** (GPT-4 Omni) — OpenAI's current flagship model.

- **Multimodal** — processes both text and images natively in a single request
- **Fast** — significantly faster than GPT-4 Turbo
- **Vision** — can read and analyze medical documents, clinical notes, and images

The model name can be updated in `src/services/openai.js`.

---

## 🔐 Security & Privacy

- ✅ Your API key is stored **only on your device** (`.env.local` or `localStorage`)
- ✅ `.env.local` is listed in `.gitignore` — it is **never committed or pushed**
- ✅ All API requests go **directly from your browser to OpenAI** — there is no intermediate proxy server
- ✅ Conversation history is **in-memory only** — cleared on page refresh

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 + Vite | Frontend framework |
| Vanilla CSS | Styling — premium dark theme, glassmorphism |
| OpenAI API (`gpt-4o`) | AI responses + image vision |
| Lucide React | Icons |
| markdown-to-jsx | Render AI markdown responses |
| Nginx (Docker) | Static file serving in production |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author

**Rohith Katta**
- GitHub: [@Katta041](https://github.com/Katta041)

---

<p align="center">Built with ❤️ for the Medical Coding Community</p>
