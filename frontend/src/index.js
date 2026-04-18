import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./auth/msalConfig";

const root = ReactDOM.createRoot(document.getElementById("root"));

async function bootstrap() {
  await msalInstance.initialize();

  root.render(
    <React.StrictMode>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
      </GoogleOAuthProvider>
    </React.StrictMode>
  );
}

bootstrap();