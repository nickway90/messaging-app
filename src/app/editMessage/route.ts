import { NextResponse, NextRequest } from "next/server";
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

  const client = getClient();

  const UPDATE_MESSAGE = gql`
       mutation update_message {
         update_Message(where: {id: { _eq: "${body.id}" }}, _set: {message: "${body.newMessage}"}) {
           affected_rows
         }
       }
     `;
     try {
         const hello = await client.mutate({
            mutation: UPDATE_MESSAGE,
          });
          console.log(hello.data)
          return NextResponse.json({output: "Message has been successfully updated"})
     } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error });
     }
}
