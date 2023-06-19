import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { createHtmlPlugin } from "vite-plugin-html";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/pomodoro/",
  plugins: [
    react(),
    tsconfigPaths(),
    createHtmlPlugin({
      inject: {
        data: {
          basePrefix: "/pomodoro",
        },
      },
    }),
  ],
});
