import { NextResponse, NextRequest } from "next/server";
const bcrypt = require("bcryptjs");
import { cookies } from "next/headers";
import { SignJWT } from "jose";


export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();

  const passwordIsValid = bcrypt.compareSync(body.password, body.databasePassword);
  const cookieStore = cookies();

  if(!passwordIsValid) {
    return NextResponse.json({ output: "Invalid Password!" }, { status: 401 });
  } else {
    const token = await new SignJWT({ username: body.username })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(new TextEncoder().encode("biscuit"));

    cookieStore.set("token", token);
    return NextResponse.json({
      username: body.username,
      output: token,
    });
  }
}
