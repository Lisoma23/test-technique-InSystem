import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./components/App";
import PWABadge from "./components/PWABadge";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

// Persister manuel du cache React Query dans localStorage
// Permet de garder les données en cache jusqu'à 5 jours même en mode offline
// La clé utilisée dans localStorage est "REACT_QUERY_OFFLINE_CACHE"
const localStoragePersister = {
  // Sauvegarde le cache dans localStorage
  persistClient: (client) => {
    localStorage.setItem("REACT_QUERY_OFFLINE_CACHE", JSON.stringify(client));
  },

  // Restaure le cache depuis localStorage
  restoreClient: () => {
    const cache = localStorage.getItem("REACT_QUERY_OFFLINE_CACHE");
    return cache ? JSON.parse(cache) : undefined;
  },

  // Supprime le cache du localStorage
  removeClient: () => {
    localStorage.removeItem("REACT_QUERY_OFFLINE_CACHE");
  },
};

const queryClient = new QueryClient();

// Sauvegarde le cache interne de React Query (queryClient) dans localStorage
persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  maxAge: 1000 * 60 * 60 * 24 * 5, // 5 jours
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>

    <PWABadge />
  </StrictMode>
);
