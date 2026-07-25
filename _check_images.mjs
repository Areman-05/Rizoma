import fs from "fs";

const src = fs.readFileSync("src/data/plants.ts", "utf8");
const ids = [...src.matchAll(/cover\("([^"]+)"\)/g)].map((m) => m[1]);
console.log("count", ids.length);

const seen = new Map();
ids.forEach((id, i) => {
  if (!seen.has(id)) seen.set(id, []);
  seen.get(id).push(i);
});
console.log("unique", seen.size);
console.log(
  "dups",
  [...seen.entries()].filter(([, v]) => v.length > 1),
);

async function check(id) {
  const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=200&q=60`;
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    if (res.ok) return { id, ok: true, status: res.status };
    // Some CDNs reject HEAD; try GET range
    const get = await fetch(url, {
      method: "GET",
      headers: { Range: "bytes=0-0" },
      redirect: "follow",
    });
    return { id, ok: get.ok || get.status === 206, status: get.status };
  } catch (e) {
    return { id, ok: false, status: String(e.message || e) };
  }
}

const results = [];
for (const id of ids) {
  const r = await check(id);
  results.push(r);
  console.log(r.ok ? "OK" : "FAIL", r.status, id);
}

const fails = results.filter((r) => !r.ok);
console.log("\nFAILS:", fails.length);
fails.forEach((f) => console.log(f));
