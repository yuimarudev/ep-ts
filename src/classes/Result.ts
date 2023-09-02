import bind from "../decorators/bind";
import { panic } from "../functions/panic";
import { Option, None, Some } from "./Option";

type ResultInner<T, E> = OkInner<T> | ErrInner<E>;

interface OkInner<T> {
  tag: "ok";
  value: T;
}

interface ErrInner<E> {
  tag: "err";
  value: E;
}

export class Result<T, E> {
  #inner: ResultInner<T, E>;

  private constructor(inner: ResultInner<T, E>) {
    this.#inner = inner;
  }

  @bind
  static Ok<T>(value: T): Result<T, never> {
    return new this<T, never>({ tag: "ok", value });
  }

  @bind
  static Err<E>(value: E): Result<never, E> {
    return new this<never, E>({ tag: "err", value });
  }

  @bind
  match<R1, R2>({ ok, err }: { ok(value: T): R1; err(value: E): R2 }): R1 | R2 {
    const { tag, value } = this.#inner;

    switch (tag) {
      case "ok":
        return ok(value);
      case "err":
        return err(value);
    }
  }

  @bind
  isOk() {
    return this.#inner.tag === "ok";
  }

  @bind
  isErr() {
    return this.#inner.tag === "err";
  }

  @bind
  ok(): Option<T> {
    const { tag, value } = this.#inner;

    return tag === "ok" ? Some(value) : None();
  }

  @bind
  err(): Option<E> {
    const { tag, value } = this.#inner;

    return tag === "err" ? Some(value) : None();
  }

  @bind
  except(msg: string): T {
    return this.ok().except(msg);
  }

  @bind
  exceptErr(msg: string): E {
    return this.err().except(msg);
  }

  @bind
  map<U>(f: (value: T) => U): Result<U, E> {
    return this.match({
      ok: (v) => Result.Ok(f(v)),
      err: (e) => Result.Err(e),
    });
  }

  @bind
  mapOr<U>(f: (value: T) => U, d: U): U {
    return this.mapOrElse(f, () => d);
  }

  @bind
  mapOrElse<U>(f: (value: T) => U, d: () => U): U {
    return this.match({ ok: f, err: d });
  }

  @bind
  mapErr<F>(f: (value: E) => F): Result<T, F> {
    return this.match({
      ok: (v) => Result.Ok(v),
      err: (e) => Result.Err(f(e)),
    });
  }

  *[Symbol.iterator]() {
    const { tag, value } = this.#inner;

    if (tag === "ok") {
      yield Some(value);
    } else {
      yield None();
    }
  }

  @bind
  unwrap(): T {
    const { tag, value } = this.#inner;

    if (tag === "ok") return value;

    panic(new Error("Unwrap failed"));
  }

  @bind
  unwrapErr(): E {
    const { tag, value } = this.#inner;

    if (tag === "err") return value;

    panic(new Error("Unwrap failed"));
  }

  [Symbol.for("nodejs.util.inspect.custom")](
    _depth: number,
    _options: unknown,
    inspect: (input: unknown) => string,
  ) {
    const { tag, value } = this.#inner;

    return `${tag === "ok" ? "Ok" : "Err"}(${inspect(value)})`;
  }

  [Symbol.toStringTag]() {
    return this.#inner.tag === "ok" ? "Ok" : "Err";
  }
}

export const Ok = Result.Ok;
export const Err = Result.Err;
