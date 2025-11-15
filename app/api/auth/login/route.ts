// app/api/auth/login/route.ts
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
  const { username, password } = await req.json()

  // ENV
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
  const JWT_SECRET = process.env.JWT_SECRET || "secret123"

  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Server auth tidak dikonfigurasi" },
      { status: 500 }
    )
  }

  // VALIDASI
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Username atau password salah" },
      { status: 401 }
    )
  }

  // BUAT TOKEN
  const token = jwt.sign(
    { username },
    JWT_SECRET,
    { expiresIn: "2h" }
  )

  return NextResponse.json({ token })
}
