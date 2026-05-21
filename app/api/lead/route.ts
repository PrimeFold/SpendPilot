import { NextRequest } from "next/server"

export async function GET() {
  return new Response(JSON.stringify({ status: "ok", message: "Lead endpoint placeholder" }), {
    headers: { "Content-Type": "application/json" },
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  return new Response(JSON.stringify({ received: body, message: "Lead created" }), {
    headers: { "Content-Type": "application/json" },
  })
}
