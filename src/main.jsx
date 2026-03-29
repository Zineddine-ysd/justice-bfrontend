import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import AdminContextProvider from "./context/AdminContext.jsx";
import SecretaireContextProvider from "./context/SecretaireContext.jsx";
import AvocatContextProvider from "./context/AvocatContext.jsx";
import JugeContextProvider from "./context/JugeContext.jsx";
import AppContextProvider from "./context/AppContext.jsx";

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <StrictMode>
    <BrowserRouter>
   <AppContextProvider>
    <AdminContextProvider>
      <SecretaireContextProvider>
          <AvocatContextProvider>
              <JugeContextProvider>
                <App />
              </JugeContextProvider>
          </AvocatContextProvider>  
        </SecretaireContextProvider> 
      </AdminContextProvider>
      </AppContextProvider>
  </BrowserRouter>
  </StrictMode>
)
