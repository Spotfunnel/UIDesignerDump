import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        // Nuke existing/old SWs (fix for white screen/zombie SWs)
        try {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
                // If it's not our current script (or just indiscriminately to be safe for this migration)
                // we unregister it.
                if (registration.active && !registration.active.scriptURL.includes('service-worker.js')) {
                    console.log('Unregistering old SW:', registration);
                    await registration.unregister();
                }
            }
        } catch (e) {
            console.error('Error cleaning SWs:', e);
        }

        // Register new canonical SW
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
