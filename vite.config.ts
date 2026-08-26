import { defineConfig } from "vite";

/* base: "./" → 构建产物用相对路径，便于部署到任意子目录或静态托管 */
export default defineConfig({
  base: "./",
  server: { host: true, port: 5173 },
  build: { outDir: "dist", emptyOutDir: true }
});
