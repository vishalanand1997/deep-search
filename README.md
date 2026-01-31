# Deep Search

Deep Search is a cutting-edge, premium chat interface designed to run Large Language Models (LLMs) locally directly in your web browser. Built with modern web technologies, it offers a fast, private, and interactive conversational experience.

## ✨ Features

- **Local AI Inference**: Powered by [WebLLM](https://webllm.mlc.ai/), running capable models like `Llama-3.2-1B-Instruct` entirely in the client. No server-side storage of chat data.
- **Voice Interaction**: Integrated speech-to-text functionality for hands-free queries.
- **Rich Text Rendering**: Full Markdown support ensuring code blocks, tables, and formatted text look beautiful.
- **Modern UI/UX**:
  - Sleek Dark / Glassmorphism aesthetic.
  - Smooth micro-interactions and animations.
  - Fully responsive design.
- **Developer Experience**:
  - TypeScript for type safety.
  - [Biome](https://biomejs.dev/) for fast formatting and linting.
  - [Husky](https://typicode.github.io/husky/) for git hooks.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing/Linting**: Biome
- **AI Engine**: @mlc-ai/web-llm
- **Speech**: react-speech-recognition

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js installed on your system.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/deep-search.git
    cd deep-search
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Prepare Husky hooks (optional but recommended):**
    ```bash
    npm run prepare
    ```

### Running Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note**: The first time you load the model, it will download several hundred megabytes of model weights to your browser cache. Subsequent loads will be much faster.

## 📜 Scripts

- `npm run dev`: Starts the local development server.
- `npm run build`: Builds the application for production.
- `npm start`: Starts the production server.
- `npm run format`: Formats code using Biome.
- `npm run lint`: Lints code using Biome.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
# deep-search
# deep-search
# deep-search
