import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

type Target = {
  id: string;
  filename: string;
  data: {
    name: string;
  };
};

export function* iterTargets(): Iterable<Target> {
  const targetDir = path.join(__dirname, "../targets");

  for (const filename of fs.readdirSync(targetDir).sort()) {
    if (!filename.toLowerCase().endsWith(".yaml")) {
      continue;
    }

    const targetFile = path.join(targetDir, filename);
    const targetData = fs.readFileSync(targetFile, { encoding: "utf-8" });
    const target = YAML.parse(targetData);

    yield {
      id: filename.slice(0, -5),
      filename,
      data: target,
    };
  }
}

export function validateTargetId(
  id: string
): { ok: true } | { ok: false; reason: string } {
  if (id.length < 1 || id.length > 32) {
    return {
      ok: false,
      reason: "must be 1-32 characters long",
    };
  }
  if (!/^[a-z0-9-]+$/.test(id)) {
    return {
      ok: false,
      reason: "can only contain lowercase alphanumerics and hyphens",
    };
  }
  if (!/^[a-z0-9]/.test(id) || !/[a-z0-9]$/.test(id)) {
    return {
      ok: false,
      reason: "must start and end with an alphanumeric",
    };
  }
  if (/--/.test(id)) {
    return {
      ok: false,
      reason: "a hyphen can not follow a hyphen",
    };
  }
  return { ok: true };
}
