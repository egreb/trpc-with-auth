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
  const [data] = createResource([route().route], getMe);

  createEffect(() => {
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
  }, route().route);
  return { user };
}

export const auth = createRoot(createStore);
