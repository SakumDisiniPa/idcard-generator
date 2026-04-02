import fs from 'fs/promises';
import path from 'path';

export interface DatabaseEntry {
  id: string;
  token: string;
  customId: string;
  nama: string;
  ttl: string;
  phone: string;
  image: string;
  qr: string;
  timestamp: number;
  contractEndDate: string; // YYYY-MM-DD format
  status: 'active' | 'expired' | 'inactive'; // active, expired (contract end), inactive (blacklist)
  inactiveReason?: 'dipecat' | 'mengundurkan diri'; // Reason if status is inactive
}

const dbPath = path.join(process.cwd(), 'data/db.json');
const blacklistPath = path.join(process.cwd(), 'data/blacklist.json');

async function ensureDB() {
  try {
    await fs.access(dbPath);
  } catch {
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    await fs.writeFile(dbPath, JSON.stringify([]));
  }
}

export async function addJsonEntry(entry: DatabaseEntry): Promise<void> {
  await ensureDB();

  const raw = await fs.readFile(dbPath, 'utf-8');
  const data: DatabaseEntry[] = JSON.parse(raw);

  data.push(entry);

  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

export async function getJsonData(): Promise<DatabaseEntry[]> {
  await ensureDB();

  const raw = await fs.readFile(dbPath, 'utf-8');
  if (!raw.trim()) return [];

  return JSON.parse(raw);
}

export async function findById(id: string): Promise<DatabaseEntry | undefined> {
  const data = await getJsonData();
  return data.find((entry) => entry.id === id);
}

export async function updateJsonEntry(id: string, updates: Partial<DatabaseEntry>): Promise<void> {
  await ensureDB();

  const raw = await fs.readFile(dbPath, 'utf-8');
  const data: DatabaseEntry[] = JSON.parse(raw);

  const index = data.findIndex((entry) => entry.id === id);
  if (index === -1) {
    throw new Error(`Entry with id ${id} not found`);
  }

  data[index] = { ...data[index], ...updates };

  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

async function ensureBlacklist() {
  try {
    await fs.access(blacklistPath);
  } catch {
    await fs.mkdir(path.dirname(blacklistPath), { recursive: true });
    await fs.writeFile(blacklistPath, JSON.stringify([]));
  }
}

export async function moveToBlacklist(
  id: string,
  reason: 'dipecat' | 'mengundurkan diri'
): Promise<void> {
  await ensureDB();
  await ensureBlacklist();

  const raw = await fs.readFile(dbPath, 'utf-8');
  const data: DatabaseEntry[] = JSON.parse(raw);

  const entryIndex = data.findIndex((entry) => entry.id === id);
  if (entryIndex === -1) {
    throw new Error(`Entry with id ${id} not found`);
  }

  const entry = data[entryIndex];
  entry.status = 'inactive';
  entry.inactiveReason = reason;

  // Add to blacklist
  const blacklistRaw = await fs.readFile(blacklistPath, 'utf-8');
  const blacklist: DatabaseEntry[] = JSON.parse(blacklistRaw || '[]');
  blacklist.push(entry);
  await fs.writeFile(blacklistPath, JSON.stringify(blacklist, null, 2));

  // Remove from active list
  data.splice(entryIndex, 1);
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

export async function getBlacklistedData(): Promise<DatabaseEntry[]> {
  await ensureBlacklist();

  const raw = await fs.readFile(blacklistPath, 'utf-8');
  if (!raw.trim()) return [];

  return JSON.parse(raw);
}

export async function deleteJsonEntry(id: string): Promise<void> {
  await ensureDB();

  const raw = await fs.readFile(dbPath, 'utf-8');
  let data: DatabaseEntry[] = JSON.parse(raw);

  data = data.filter((entry) => entry.id !== id);

  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}
