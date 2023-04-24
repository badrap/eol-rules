import { iterTargets } from "./_utils";

const targets: Record<string, unknown> = {};

for (const target of iterTargets()) {
  const { id, data } = target;
  targets[id] = data;
}

const data = {
  createdAt: new Date().toISOString(),
  targets,
};

// eslint-disable-next-line no-console
console.log(JSON.stringify(data, null, 2));
