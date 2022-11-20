import { createMemo, createRoot, createSignal } from "solid-js";

type Routes =
  | {
      route: "/";
    }
  | {
      route: "login";
      state?: never;
    }
  | {
      route: "register";
      state?: never;
    };

function createStore() {
  const [state, setState] = createSignal<Routes>({
    route: "login",
  });

  const setRoute = (state: Routes) => {
    setState(state);
  };

  const route = createMemo(() => {
    return state();
  });

  return { route, setRoute };
}
export const router = createRoot(createStore);
