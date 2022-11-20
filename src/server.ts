import http from "http";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { authRouter } from "./routes/auth";
import { t, createContext } from "./context";

const p = t.procedure;
const router = t.router;

const appRouter = router({
  ping: p.query(() => {
    return "pong";
  }),
  auth: authRouter,
});

const handler = createHTTPHandler({
  router: appRouter,
  createContext,
});

http
  .createServer((req, res) => {
    // enable CORS
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Request-Method", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // accepts OPTIONS
    if (req.method === "OPTIONS") {
      res.writeHead(200);
      return res.end();
    }

    handler(req, res);
  })
  .listen(2020, () => {
    console.log(`listening on port 2020`);
  });

export type AppRouter = typeof appRouter;
