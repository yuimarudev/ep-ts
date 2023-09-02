import bind from "../decorators/bind";
import panic from "../functions/panic";

type OptionInner<T> = SomeInner<T> | NoneInner;

interface SomeInner<T> {
  tag: "some";
  value: T;
}

interface NoneInner {
  tag: "none";
  value: never;
}

export class Option<T> {
  private constructor(private inner: OptionInner<T>) {}

  @bind
  static Some<T>(value: T) {
    return new this({ tag: "some", value });
  }

  @bind
  static None() {
    return new this({ tag: "none", value: null! });
  }

  @bind
  isSome() {
    return this.inner.tag === "some";
  }

  @bind
  isNone() {
    return this.inner.tag === "none";
  }

  *[Symbol.iterator]() {
    const { tag, value } = this.inner;

    if (tag === "some") {
      yield Some(value);
    }
  }

  @bind
  unwrap(): T {
    if (this.inner.tag === "some") {
      return this.inner.value;
    } else {
      panic(new Error("Unwrap failed"));
    }
  }

  @bind
  except(msg: string): T {
    if (this.inner.tag === "some") return this.inner.value;

    panic(new Error(msg));
  }

  [Symbol.for("nodejs.util.inspect.custom")](
    _depth: number,
    _options: Object,
    inspect: (input: any) => string,
  ) {
    const { tag, value } = this.inner;

    return `${tag === "some" ? "Some" : "None"}(${inspect(value)})`;
  }

  [Symbol.toStringTag]() {
    return this.inner.tag === "some" ? "Some" : "None";
  }
}

Object.defineProperty(Option.prototype, "inner", {
  enumerable: false,
  writable: true,
});

export const Some = Option.Some;
export const None = Option.None;
