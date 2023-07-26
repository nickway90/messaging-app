import { NextResponse } from "next/server";
const bcrypt = require("bcryptjs");

export async function POST(req: Request, res: NextResponse) {
  const body = await req.json();

  const theResponse = bcrypt.hashSync(body.password, 8);

  return NextResponse.json({ output: theResponse }, { status: 200 });
}
