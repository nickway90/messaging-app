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

 const GET_DATA = gql`
   query getMessages @cached {
     Message(order_by: { id: asc }) {
       message
     }
     Messenger(limit: 100, order_by: { id: asc }) {
       username
       profile_picture
     }
   }
 `;


export async function GET(req: Request, res: NextResponse) {

  const client = getClient()
    
 const messages = await client.query({ query: GET_DATA });

  return NextResponse.json({ messages: messages }, { status: 200 });
}
