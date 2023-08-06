import { NextResponse } from "next/server";
import { ApolloClient, InMemoryCache, gql, HttpLink } from "@apollo/client";

const bcrypt = require("bcryptjs");

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

const ADD_MESSENGER = gql`
  mutation AddMessenger($object: Messenger_insert_input!) {
    insert_Messenger_one(object: $object) {
      id
      username
      email
      password
    }
  }
`;


export async function POST(req: Request, res: NextResponse) {
  const body = await req.json();

  const client = await getClient()

  const EMAIL_TAKEN = gql`
  query EmailTaken {
    Messenger(
      where: {
        email: { _eq: "${body.email}" }
      }
    ) {
      email
    }
  }
`;

  const USERNAME_TAKEN = gql`
  query UsernameTaken {
     Messenger(
      where: {
        username: { _eq: "${body.username}" }
      }
    ) {
      username
    }
  }
`;

  const usernameTaken = await client.query({ query: USERNAME_TAKEN });

  const emailTaken = await client.query({ query: EMAIL_TAKEN });

  if (usernameTaken.data.Messenger.length > 0) {
    return NextResponse.json({output: "This Username Has Already Been Taken"})
  }

  if (emailTaken.data.Messenger.length > 0) {
    return NextResponse.json({
      output: "This Email Has Already Been Taken",
    });
  }

  const hashedPassword = bcrypt.hashSync(body.password, 8);

   const object = {
     bio: "",
     email: body.email,
     password: hashedPassword,
     profile_picture: null,
     username: body.username
   };

   try {
     await client.mutate({
       mutation: ADD_MESSENGER,
       variables: { object },
     });
    return NextResponse.json(
      { output: "Messenger Successfully Added" },
      { status: 200 }
    );
   } catch (error) {
    return NextResponse.json(
      { output: "Couldn't Add Messenger" },
      { status: 500 }
    );
    }
}
