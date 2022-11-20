import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { router } from "./router";
import { IFormError, FormError } from "./components/FormError";
import { parseFormError } from "./helpers/forms";
import { client } from "./lib/trpc";

interface FormData {
  username: string;
  password: string;
}

const RegisterForm = () => {
  const { setRoute } = router;
  const [error, setError] = createSignal<Array<IFormError>>([]);
  const [form, setForm] = createStore<FormData>({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    try {
      const res = await client.auth.register.query({ ...form });
      if (res.success) {
        setRoute({ route: "login" });
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
        <p>register user</p>

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

        <button type="submit">register</button>
      </form>

      <p>
        Got a user?
        <button onClick={() => setRoute({ route: "login" })}>
          sign in here
        </button>
      </p>
    </div>
  );
};

export { RegisterForm };
