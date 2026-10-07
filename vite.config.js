import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/moodboard-builder/",
    build: {
        sourcemap: false,
    },
    plugins: [react()],
});
