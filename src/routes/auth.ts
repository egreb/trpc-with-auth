import { TRPCError } from "@trpc/server";
import { z, ZodError } from "zod";
import { t } from "../context";
import { authProcedure, sessions, users } from "../middleware/auth";

const createSessionId = () => {
  return Math.floor(Math.random() * 1000).toString();
};

const authRouter = t.router({
  me: authProcedure.query(({ ctx }) => {
    return ctx.session.user;
  }),
  signout: authProcedure.query(({ ctx }) => {
    delete sessions[ctx.session.id];

    ctx.res.setHeader(
      "Set-Cookie",
      `trpc-auth=${ctx.session.id}; Secure; HttpOnly; max-age=0;`
    );

    return {
      success: true,
    };
  }),
  signin: t.procedure
    .input(
      z.object({
        username: z.string().min(3).max(255),
        password: z.string().min(3).max(255),
      })
    )
    .query(async ({ input, ctx }) => {
      const { username, password } = input;

      const user = users.find((x) => x.username === username);
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (user.password !== password) {
        throw new ZodError([
          {
            code: "custom",
            message: "wrong password",
            path: ["password"],
          },
        ]);
      }

      const sessionId = createSessionId();
      sessions[sessionId] = {
        id: sessionId,
        user_id: user.id,
      };

      ctx.res.setHeader(
        "Set-Cookie",
        `trpc-auth=${sessionId}; Secure; HttpOnly;`
      );

      return {
        success: true,
      };
    }),
  register: t.procedure
    .input(
      z.object({
        username: z.string().min(3).max(255),
        password: z.string().min(3).max(255),
      })
    )
    .query(async ({ input }) => {
      const { username, password } = input;

      const user = users.find((x) => x.username === username);
      if (user) {
        throw new ZodError([
          {
            code: "custom",
            path: ["username"],
            message: "This username is taken",
          },
        ]);
      }

      const userId = crypto.randomUUID();
      users.push({
        id: userId,
        username,
        password,
      });

      return {
        success: true,
      };
    }),
});

export { authRouter };
