// app/api/auth/validate/route.ts
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
  const { token } = await req.json()
  const JWT_SECRET = process.env.JWT_SECRET || "secret123"

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return NextResponse.json({ valid: true, user: decoded })
  } catch (err) {
    return NextResponse.json({ valid: false }, { status: 401 })
  }
}
