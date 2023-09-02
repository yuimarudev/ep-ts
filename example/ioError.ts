import { Result, Err, Ok } from "ep-ts";
import { readFile } from "node:fs/promises";

class IOError extends Error {
  constructor() {
    super();

    this.name = "IOError";
    this.message = "I/O Error";
  }
}

async function readToString(path: string): Promise<Result<string, IOError>> {
  const file = await readFile(path).catch((e: Error) => e);

  if (file instanceof Error) return Err(new IOError());

  return Ok(file.toString("utf-8"));
}

const script = await readToString("package.json");
const none = await readToString("./adapodskopaskdopaskodpaojqwoejer0qw9");

console.log("isOk", script.isOk(), none.isOk());
console.log("unwrap", JSON.parse(script.unwrap()).name);
console.log("inner", none);

// process ends with code 1
none.unwrap();