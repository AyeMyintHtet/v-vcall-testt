# v-vcall-testt - Video Calling Application

A modern, responsive video calling application built with **React**, **Vite**, and **TypeScript**, powered by [VideoSDK](https://videosdk.live/).

## 🚀 Features

- **Create & Join Meetings**: Easily create new meeting rooms or join existing ones with a meeting ID.
- **Real-time Audio & Video**: High-quality real-time communication.
- **Device Management**: detailed control to select input devices (Microphone & Camera) before and during calls.
- **Conference & Viewer Modes**: Support for different participant roles (Conference for active participants, Viewer for passive streaming).
- **Responsive Design**: Fully responsive UI tailored for both desktop and mobile experiences.
- **Modern UI**: Styled with **Tailwind CSS** for a clean and sleek look.

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Video Logic**: [@videosdk.live/react-sdk](https://www.npmjs.com/package/@videosdk.live/react-sdk)
- **Routing**: React Router (if applicable) / Custom State Routing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- A [VideoSDK Account](https://app.videosdk.live/) to generate an API Token.

## ⚙️ Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone <your-repo-url>
    cd v-vcall-testt
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory (copy from default/example if available, or create new) and add your VideoSDK token.

    ```env
    VITE_VIDEOSDK_TOKEN=your_videosdk_token_here
    ```
    > **Note:** You can generate a temporary token from the [VideoSDK Dashboard](https://app.videosdk.live/api-keys).

## 🏃‍♂️ Running the App

Start the development server:

```bash
npm run dev
```

The app is usually accessible at `http://localhost:5173`.

## 📂 Project Structure

```bash
src/
├── components/         # Reusable UI components
│   └── screens/        # Full-screen views (JoiningScreen, LeaveScreen)
├── hooks/              # Custom React hooks
├── icons/              # SVG Icons
├── meeting/            # Core meeting logic and container
├── api.ts              # API utilities for Token and Meeting operations
├── App.tsx             # Main application component and state management
├── MeetingAppContextDef.tsx # Context Provider for app-wide state
└── main.tsx            # Entry point
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
