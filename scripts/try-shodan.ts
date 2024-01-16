import { match } from "./_utils";

const argv = process.argv.slice(2);
if (argv.length !== 1) {
  // eslint-disable-next-line no-console
  console.error("ERROR: expected one IP address as an argument");
  process.exit(2);
}

const [ip] = argv;
const apiKey = process.env.SHODAN_API_KEY;
if (!apiKey) {
  // eslint-disable-next-line no-console
  console.error("ERROR: expected SHODAN_API_KEY environment variable");
  process.exit(2);
}

fetch(
  `https://api.shodan.io/shodan/host/${encodeURIComponent(
    ip,
  )}?key=${encodeURIComponent(apiKey)}`,
)
  .then(
    (res) => {
      if (res.status === 404) {
        return {};
      }
      if (!res.ok) {
        // eslint-disable-next-line no-console
        console.error(
          `ERROR: Failed Shodan request with HTTP status code ${res.status} (${res.statusText})`,
        );
        process.exit(1);
      }
      return res.json();
    },
    (err) => {
      // eslint-disable-next-line no-console
      console.error(`ERROR: Failed Shodan request (${err})`);
      process.exit(1);
    },
  )
  .then((json: Record<string, unknown>) => {
    const data = (json.data ?? []) as Record<string, unknown>[];
    const banners = data
      .map((item) => (item.data ?? "") as string)
      .filter(Boolean);
    match(banners);
    process.exit(0);
  });
