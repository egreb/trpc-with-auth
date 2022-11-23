import {
  createTRPCProxyClient as createTRPCClient,
  httpBatchLink,
} from "@trpc/client";
import { createResource } from "solid-js";
import type { AppRouter } from "../../../src/server";

const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:2020/api",
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
        });
      },
    }),
  ],
});

type AppQueries = AppRouter["_def"]["procedures"];

type AppQueryKeys = keyof AppQueries & string;

export const createTrpcQuery = <TPath extends AppQueryKeys>(path: TPath) => {
  const fetchData = async () => {
    return client[path];
  };

  return createResource(fetchData);
};

export { client };
