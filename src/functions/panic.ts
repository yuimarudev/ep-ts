export type panicHandler<E extends Error = Error> = (error: E) => never;

const _fallback: panicHandler = (error) => {
  throw error;
};

const nodePanic: panicHandler = (error) => {
  console.error(error);

  process.exit(1);
};

const browserPanic: panicHandler = (error) => {
  console.error(error);

  /* eslint-disable-next-line */
  while (true);
};

let panicHandler: panicHandler =
  typeof console !== "undefined" && typeof console.error !== "undefined"
    ? typeof process !== "undefined"
      ? nodePanic
      : browserPanic
    : _fallback;

export function setPanicHandler(handler: panicHandler) {
  panicHandler = handler;
}

export const panic: panicHandler = (error) => {
  panicHandler(error);
};
