import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import http from "http";

type Request = { req: http.IncomingMessage; res: http.OutgoingMessage };

async function createContext({ req, res }: Request) {
  return { req, res };
}

type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

export { t, createContext };
