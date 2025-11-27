import fs from "fs/promises";
import path from "path";

const dbPath = path.join(process.cwd(), "data/db.json");

// memastikan file ada
async function ensureDB() {
  try {
    await fs.access(dbPath);
  } catch {
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    await fs.writeFile(dbPath, JSON.stringify([]));
  }
}

export async function addJsonEntry(entry) {
  await ensureDB();

  const raw = await fs.readFile(dbPath, "utf-8");
  const data = JSON.parse(raw);

  data.push(entry);

  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}
