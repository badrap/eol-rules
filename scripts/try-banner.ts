import { match } from "./_utils";

const argv = process.argv.slice(2);
if (argv.length !== 1) {
  // eslint-disable-next-line no-console
  console.error("ERROR: expected one banner string as an argument");
  process.exit(2);
}

match(argv);
