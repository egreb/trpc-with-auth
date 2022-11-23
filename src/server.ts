import http from "http";
import fs from "fs";
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

    if (req.url === "/") {
      fs.readFile("./client/dist/index.html", (err, fileContent) => {
        if (err) {
          console.error("read index.html error:", err);
        }
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        return res.end(fileContent);
      });
    }

    fs.readFile("./client/dist" + req.url, (err, fileContent) => {
      let contentType = "text/css";
      const parts = req.url?.split(".") ?? [];

      console.log({ parts, last: parts[parts.length - 1] });
      if (parts[parts.length - 1] === "js") {
        contentType = "application/javascript";
      }
      console.log({ url: req.url, contentType });
      if (!err) {
        res.writeHead(200, { "Content-Type": contentType + "; charset=utf-8" });
        return res.end(fileContent);
      }
    });

    if (req.url?.startsWith("/api/", 0)) {
      req.url = req.url.replace("/api", "");
      handler(req, res);
    }
  })
  .listen(2020, () => {
    console.log(`listening on port 2020`);
  });

export type AppRouter = typeof appRouter;
