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

     const DELETE_MESSAGE = gql`
       mutation delete_one_message {
         delete_Message(where: {message: { _eq: "${body.message}" }}) {
           affected_rows
         }
       }
     `;

   try {
      await client.mutate({
        mutation: DELETE_MESSAGE
      });
      return NextResponse.json({output: `Message "${body.message}" successfully deleted`, status:200})
   } catch (error) {
    console.log(error)
     return NextResponse.json({
       error: "This Message Does Not Exist",
       status: 200,
     });
   }
}