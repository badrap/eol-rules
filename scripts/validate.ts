import fs from "node:fs";
import path from "node:path";
import Ajv, { DefinedError } from "ajv";
import addFormats from "ajv-formats";
import { validateTargetId, iterTargets } from "./_utils";

const stringify = JSON.stringify;

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const schemaPath = path.join(__dirname, "../schema/target.schema.json");
const schemaJson = JSON.parse(
  fs.readFileSync(schemaPath, { encoding: "utf-8" })
);
const validate = ajv.compile(schemaJson);

const targets = Array.from(iterTargets());

const ids = new Map();
targets.forEach((target) => {
  ids.set(target.id, target);
});

let exitCode = 0;
targets.forEach((target) => {
  const log = (s: string, path = "") => {
    // eslint-disable-next-line no-console
    console.error(`${target.filename}${path}: ${s}`);
    exitCode = 1;
  };

  const idValidity = validateTargetId(target.id);
  if (!idValidity.ok) {
    log(`Invalid target ID ${stringify(target.id)} (${idValidity.reason})`);
  }

  if (!validate(target.data)) {
    for (const error of validate.errors as DefinedError[]) {
      log(`${error.message}`, error.instancePath);
    }
  }
});
process.exit(exitCode);
