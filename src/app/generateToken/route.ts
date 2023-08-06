import { NextResponse, NextRequest } from "next/server";
const bcrypt = require("bcryptjs");
import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { ApolloClient, InMemoryCache, gql, HttpLink } from "@apollo/client";

const getClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: "https://optimal-cub-76.hasura.app/v1/graphql",
      headers: {
        "x-hasura-admin-secret": process.env.HASURA as string,
      },
    }),
    cache: new InMemoryCache(),
  });
};


export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();

  const client = getClient()

  const cookieStore = cookies();

  const GET_MESSENGER = gql`
    query GetMessenger {
      Messenger(where: { username: { _eq: "${body.username}"} }) {
        password
      }
    }
  `;

   const fetchPassword = await client.query({ query: GET_MESSENGER });

    if (fetchPassword.data.Messenger.length === 0) {
      return NextResponse.json({output: "Invalid Username!"})
    }


   const databasePassword: string = fetchPassword.data.Messenger[0].password;

 const passwordIsValid = bcrypt.compareSync(
  body.password,
  databasePassword
);

  if(!passwordIsValid) {
    return NextResponse.json({ output: "Invalid Password!" }, { status: 500 });
  } else {
    const token = await new SignJWT({ username: body.username })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET)); 

    cookieStore.set("token", token);
    return NextResponse.json({
      username: body.username,
      output: token,
    });
  }
}
