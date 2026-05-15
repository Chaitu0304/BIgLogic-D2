import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { GoogleOAuthProvider } from '@react-oauth/google';

// Use a fallback or ensure env is present
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id";

createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
    </GoogleOAuthProvider>
);
