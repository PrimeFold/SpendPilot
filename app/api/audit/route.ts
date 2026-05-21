import { NextRequest } from "next/server"

export async function GET() {
  return new Response(JSON.stringify({ status: "ok", message: "Audit endpoint placeholder" }), {
    headers: { "Content-Type": "application/json" },
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  return new Response(JSON.stringify({ received: body, message: "Audit request accepted" }), {
    headers: { "Content-Type": "application/json" },
  })
}
