import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFile = path.join(process.cwd(), "public/data/siswa.json");

function readData() {
  const raw = fs.readFileSync(dataFile, "utf8");
  return JSON.parse(raw);
}

function writeData(data: any) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// GET semua siswa
export async function GET() {
  const siswa = readData();
  return NextResponse.json(siswa);
}

// POST tambah siswa baru
export async function POST(req: Request) {
  const newSiswa = await req.json();
  const data = readData();

  const id = data.length ? Math.max(...data.map((d: any) => d.id)) + 1 : 1;
  const newEntry = { id, ...newSiswa };

  data.push(newEntry);
  writeData(data);

  return NextResponse.json({ success: true, data: newEntry });
}

// 🗑️ DELETE siswa
export async function DELETE(req: Request) {
  const { id } = await req.json();
  const data = readData();
  const filtered = data.filter((s: any) => s.id !== id);
  writeData(filtered);
  return NextResponse.json({ success: true });
}

// ✏️ PUT update siswa
export async function PUT(req: Request) {
  const updatedSiswa = await req.json();
  const data = readData();

  const index = data.findIndex((s: any) => s.id === updatedSiswa.id);
  if (index === -1)
    return NextResponse.json({ success: false, message: "Siswa tidak ditemukan" });

  data[index] = { ...data[index], ...updatedSiswa };
  writeData(data);

  return NextResponse.json({ success: true, data: data[index] });
}
