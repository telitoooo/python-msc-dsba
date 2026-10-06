import { readFile } from "node:fs/promises";

export async function load(url, context, nextLoad) {
  if (url.endsWith("?raw")) {
    const text = await readFile(new URL(url.slice(0, -4)), "utf8");
    return { format: "module", shortCircuit: true, source: `export default ${JSON.stringify(text)};` };
  }
  return nextLoad(url, context);
}
