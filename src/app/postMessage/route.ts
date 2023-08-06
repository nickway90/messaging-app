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

 const ADD_MESSAGE = gql`
   mutation addMessage($object: Message_insert_input!) {
     insert_Message_one(object: $object) {
       isReply
       message
       username
     }
   }
 `;


export async function POST(req: Request, res: NextResponse) {
  const body = await req.json()

  const client = getClient();

  const object = {
   message: body.message,
   username: body.username
  };

  try {
   await client.mutate({
     mutation: ADD_MESSAGE,
     variables: { object },
   });
    return NextResponse.json(
      { outcome: "Message has been posted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { outcome: "Message failed to post" },
      { status: 500 }
    );
  }
}