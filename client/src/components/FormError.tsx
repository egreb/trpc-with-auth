import { Accessor, createSignal, createEffect, Show } from "solid-js";

export interface IFormError {
  code: string;
  minimum?: string;
  message: string;
  path: Array<string>;
}

const FormError = (props: { name: string; e: Accessor<Array<IFormError>> }) => {
  const [message, setMessage] = createSignal<string | undefined>();
  createEffect(() => {
    const errors = props.e();

    if (!errors) setMessage();
    const error = errors.find((x) => x.path.some((y) => y === props.name));
    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage();
  });

  return (
    <Show when={message}>
      <p style={{ color: "#c00" }}>{message}</p>
    </Show>
  );
};

export { FormError };
