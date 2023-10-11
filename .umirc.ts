import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "docs" },
  ],
  npmClient: 'yarn',
});
