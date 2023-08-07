import { NextResponse } from "next/server";
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

export async function POST(req: Request, res: NextResponse) {
  const body = await req.json()

   const GET_MESSENGER = gql`
    query GetMessenger @cached {
      Messenger(where: { username: { _eq: "${body.username}"} }) {
        profile_picture
        bio
        email
      }
    }
  `;

  const client = getClient();

  

  const messenger = await client.query({ query: GET_MESSENGER });

  return NextResponse.json(
    { messenger: messenger.data.Messenger[0] },
    { status: 200 }
  );
}
