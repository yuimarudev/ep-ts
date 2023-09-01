export default function panic<E>(error: E): never {
  throw error;
}
