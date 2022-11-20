import { TRPCError } from "@trpc/server";
import { t } from "../context";

interface Session {
  id: string;
  user_id: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
}

export const users: Array<User> = [
  {
    id: "one",
    username: "sib",
    password: "my-random-password",
  },
];

const sessions: { [id: string]: Session } = {};

const getSession = (id: string) => {
  const session = sessions[id];
  if (!session) return null;

  const user = users.find((x) => x.id === session.user_id);
  if (!user) return null;

  return user;
};

function getSessionId(cookie: string | undefined) {
  if (!cookie) return null;

  const cookies = cookie.replace(" ", "").split(";");
  if (!cookies.length) return null;

  const cookiesWithValue = cookies.reduce<Record<string, string>>(
    (current, cookieString) => {
      const [name, value] = cookieString.split("=");
      const values = value.split(" ");

      current[name] = values[0];
      return current;
    },
    {}
  );

  return cookiesWithValue["trpc-auth"];
}

const isAuthed = t.middleware(({ next, ctx }) => {
  const sessionId = getSessionId(ctx.req.headers.cookie);
  if (!sessionId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const user = getSession(sessionId);
  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      session: {
        id: sessionId,
        user,
      },
      ...ctx,
    },
  });
});

const authProcedure = t.procedure.use(isAuthed);

export { authProcedure, getSession, sessions };
