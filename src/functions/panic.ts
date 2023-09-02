export default function panic<E extends Error>(error: E): never {
  throw error;
}
