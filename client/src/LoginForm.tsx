import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { router } from "./router";
import { IFormError, FormError } from "./components/FormError";
import { client } from "./lib/trpc";

interface FormData {
  username: string;
  password: string;
}

const parseFormError = (message?: string): Array<IFormError> | null => {
  if (!message) return null;
  try {
    return JSON.parse(message);
  } catch (e) {
    return null;
  }
};

const LoginForm = () => {
  const { setRoute } = router;
  const [error, setError] = createSignal<Array<IFormError>>([]);
  const [form, setForm] = createStore<FormData>({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    try {
      const res = await client.auth.signin.query({ ...form });
      if (res.success) {
        window.location.reload();
      }
    } catch (e: any) {
      const error = e as Error;
      const formErrors = parseFormError(error?.message);
      if (formErrors) {
        setError([...formErrors]);
      } else {
        setError([]);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p>sign in</p>
        <input
          type="text"
          name="username"
          placeholder="username"
          onChange={(e) =>
            setForm({
              username: e.currentTarget.value,
            })
          }
        />
        <FormError name="username" e={error} />
        <input
          type="password"
          name="password"
          placeholder="password"
          onChange={(e) =>
            setForm({
              password: e.currentTarget.value,
            })
          }
        />
        <FormError name="password" e={error} />

        <button type="submit">login</button>
      </form>
      <p>
        Don't have a user?
        <button onClick={() => setRoute({ route: "register" })}>
          register here
        </button>
      </p>
    </div>
  );
};

export { LoginForm };
