// app/api/auth/login/route.ts
import { NextResponse } from "next/server"
import { SignJWT } from "jose"

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

  // VALIDASI LOGIN
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Username atau password salah" },
      { status: 401 }
    )
  }

  // BUAT TOKEN (ESM, kompatibel dengan Next.js)
  const secret = new TextEncoder().encode(JWT_SECRET)

  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("2h")
    .sign(secret)

  return NextResponse.json({ token })
}
