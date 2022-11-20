import {
  createEffect,
  createResource,
  createRoot,
  createSignal,
} from "solid-js";
import { User } from "../../../src/middleware/auth";
import { router } from "../router";
import { client } from "./trpc";

const getMe = async () => await client.auth.me.query();

function createStore() {
  const [user, setUser] = createSignal<User | null>(null);
  const { route, setRoute } = router;
  const [data, mutate] = createResource([route().route], getMe);

  createEffect(() => {
    const r = route().route;

    if (data.error) {
      setUser(null);
      setRoute({
        route: "login",
      });
      return;
    }

    if (!user()) {
      const u = data();
      if (u) {
        setUser(u);
        setRoute({
          route: "/",
        });
      }
    }
  });
  return { user };
}

export const auth = createRoot(createStore);
