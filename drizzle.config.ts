// import { defineConfig } from "drizzle-kit";

// export default defineConfig({
//   dialect: "sqlite",
//   dbCredentials: {
//     url: "./sqlite.db",
//   },
//   schema: "./src/db/schemas",
//   out: "./src/db/migrations",
// });

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schemas/index.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: "./sqlite.db",
  },
});
