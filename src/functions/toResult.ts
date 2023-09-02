import { type Result, Ok, Err } from "../classes/Result";

export function toResult<R, E extends Error>(execute: () => R): Result<R, E> {
  let value: Result<R, E>;

  try {
    value = Ok(execute());
  } catch (e) {
    value = Err(e instanceof Error ? <E>e : <E>new Error(<string>e));
  }

  return value;
}

export async function promiseToResult<
  R1,
  R2 extends Promise<R1>,
  E extends Error,
>(execute: () => R2): Promise<Result<R1, E>> {
  let value: Result<R1, E>;

  try {
    value = Ok(await execute());
  } catch (e) {
    value = Err(e instanceof Error ? <E>e : <E>new Error(<string>e));
  }

  return value;
}
