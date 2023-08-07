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
  const body = await req.json();

   const GET_MESSENGER = gql`
    query GetMessenger @cached {
      Messenger(where: { username: { _eq: "${body.username}"} }) {
        profile_picture
        bio
        email
      }
    }
  `;

  const UPDATE_PROFILE_PICTURE = gql`
  mutation updatePicture {
    update_Messenger(
      where: { username: { _eq: "${body.username}"} },
       _set: {profile_picture: "${body.image}"}
    ) {
      affected_rows
      returning {
      profile_picture
    }
    }
  }
`;

  const UPDATE_BIO = gql`
  mutation updateBio {
    update_Messenger(
      where: { username: { _eq: "${body.username}"} },
       _set: {bio: "${body.bio}"}
    ) {
      affected_rows
      returning {
      bio
    }
    }
  }
`;

  const client = getClient();

 const messenger = await client.query({ query: GET_MESSENGER });

 if (
   body.bio !== messenger.data.Messenger[0].bio &&
   body.image !== messenger.data.Messenger[0].profile_picture
 ) {
     await client.mutate({
       mutation: UPDATE_BIO,
     });

      await client.mutate({
        mutation: UPDATE_PROFILE_PICTURE,
      });
     
       return NextResponse.json(
         { output: "You have succesfully changed your bio and picture" },
         { status: 200 }
       );
 }

   if (body.bio !== messenger.data.Messenger[0].bio) {
     await client.mutate({
       mutation: UPDATE_BIO,
     });
     return NextResponse.json(
       { output: "You have succesfully changed your bio" },
       { status: 200 }
     );
   }
 
 if (body.image !== messenger.data.Messenger[0].profile_picture) {
    await client.mutate({
      mutation: UPDATE_PROFILE_PICTURE,
    });
    return NextResponse.json(
      { output: "You have succesfully changed your picture" },
      { status: 200 }
    );
 }

}