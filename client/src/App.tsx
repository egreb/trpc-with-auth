import { TRPCError } from "@trpc/server";
import { Component, ErrorBoundary, Match, Suspense, Switch } from "solid-js";
import { auth } from "./lib/auth";
import { client } from "./lib/trpc";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { router } from "./router";

const signout = async () => await client.auth.signout.query();

const Application = () => {
  const { user } = auth;
  console.log({ user: user() });

  const handleSignout = async () => {
    await signout();
    window.location.reload();
  };

  return (
    <div>
      <p>Authorized {user()?.username}</p>
      <button onClick={handleSignout}>sign out</button>
    </div>
  );
};

interface Error {
  data: TRPCError;
  message?: string;
}

const App: Component = () => {
  const { route } = router;

  return (
    <Suspense fallback="loading...">
      <ErrorBoundary
        fallback={(e: Error) => {
          if (e.data.code === "UNAUTHORIZED") {
            return <LoginForm />;
          }

          return <p>Something went wrong</p>;
        }}
      >
        <Switch fallback={<p>Route not found</p>}>
          <Match when={route().route === "/"}>
            <Application />
          </Match>
          <Match when={route().route === "register"}>
            <RegisterForm />
          </Match>
          <Match when={route().route === "login"}>
            <LoginForm />
          </Match>
        </Switch>
      </ErrorBoundary>
    </Suspense>
  );
};

export default App;
