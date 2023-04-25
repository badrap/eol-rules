import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { white, cyan, gray, magenta } from "kleur";

type Target = {
  id: string;
  filename: string;
  data: {
    name: string;
    eol: string;
    info?: string;
    rules: string[];
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

export function match(banners: string[]): void {
  function format(string: string) {
    return JSON.stringify(string).slice(1, -1);
  }

  const matches: Target[] = [];
  for (const target of iterTargets()) {
    for (const rule of target.data.rules) {
      if (banners.some((b) => b.includes(rule))) {
        matches.push(target);
        break;
      }
    }
  }

  if (matches.length === 0) {
    // eslint-disable-next-line no-console
    console.log(white("\nNo matching targets.\n"));
    return;
  }

  matches.sort((a, b) => +new Date(a.data.eol) - +new Date(b.data.eol));

  // eslint-disable-next-line no-console
  console.log(white(`\n${matches.length} matching target(s):`));

  matches.forEach((target) => {
    // eslint-disable-next-line no-console
    console.log(cyan().underline(`\n./targets/${target.filename}`));
    target.data.rules.forEach((rule) => {
      for (const banner of banners) {
        const index = banner.indexOf(rule);
        if (index < 0) {
          continue;
        }

        const b = magenta(
          `${format(banner.slice(0, index))}${magenta().inverse(
            format(rule)
          )}${format(banner.slice(index + rule.length))}`
        );

        // eslint-disable-next-line no-console
        console.log(
          white(`${gray("-")} Rule "${magenta(format(rule))}" matches "${b}"`)
        );
      }
    });
  });

  // eslint-disable-next-line no-console
  console.log();
}
