import { IFormError } from "../components/FormError";

const parseFormError = (message?: string): Array<IFormError> | null => {
  if (!message) return null;
  try {
    return JSON.parse(message);
  } catch (e) {
    return null;
  }
};

export { parseFormError };
