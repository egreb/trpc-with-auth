import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";
import http from "http";
import { db } from "./db";

type Request = { req: http.IncomingMessage; res: http.OutgoingMessage };

async function createContext({ req, res }: Request) {
  return { req, res, db };
}

type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

export { t, createContext };
