"use client";
import { ApolloClient, InMemoryCache, gql, HttpLink } from "@apollo/client";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";

export default function Profile() {
   const [username, setUsername] = useState<string>("");
   const [image, setImage] = useState<string>("");
   const [bio, setBio] = useState<string>("")

   const getClient = () => {
     return new ApolloClient({
       link: new HttpLink({
         uri: "https://optimal-cub-76.hasura.app/v1/graphql",
         headers: {
           "x-hasura-admin-secret":
             "",
         },
       }),
       cache: new InMemoryCache(),
     });
   };

 const client = getClient();

  const GET_MESSENGER = gql`
    query GetMessenger @cached {
      Messenger(where: { username: { _eq: "${username}"} }) {
        profile_picture
        bio
        email
      }
    }
  `;

const UPDATE_PROFILE_PICTURE = gql`
  mutation updatePicture {
    update_Messenger(
      where: { username: { _eq: "${username}"} },
       _set: {profile_picture: "${image}"}
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
      where: { username: { _eq: "${username}"} },
       _set: {bio: "${bio}"}
    ) {
      affected_rows
      returning {
      bio
    }
    }
  }
`;
 
 const getUserName = async() => {
    const jwt = JSON.stringify(getCookie("token"));
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    setUsername(payload.username);
 }


const retrieveInfo = async() => {
   const messenger = await client.query({ query: GET_MESSENGER });
   console.log(messenger)
   const picture = messenger.data.Messenger[0]?.profile_picture
   const bio = messenger.data.Messenger[0]?.bio;
   setImage(picture ?? "");
   setBio(bio);
   return [picture, bio];
}

const changePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
  const reader = new FileReader();
  reader.readAsDataURL(e.target.files[0]);
  reader.onload = () => {
    setImage(reader.result as string);
  };
};

const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
  e.preventDefault()
  const info = await retrieveInfo();
  if (image === info[0] && bio === info[1]) return;
  if (image !== info[0] && image !== "") {
    await client.mutate({
      mutation: UPDATE_PROFILE_PICTURE,
    });
    window.alert("You have successfully changed your picture");
  }

  if (bio !== info[1] && bio !== "") {
    await client.mutate({
      mutation: UPDATE_BIO,
    });
    window.alert("You have successfully changed your bio")
  }
  await retrieveInfo()
};

 useEffect(() => {
    getUserName();
    retrieveInfo();
 },[])

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center items-center h-screen"
    >
      <div className="flex items-center justify-between mb-3">
        <div>{username}</div>
        {image === "" || image === null ? (
          <>
            <img
              src="/discord.jpeg"
              className="rounded-full mx-2"
              width={50}
              height={50}
            />
            <label className="cursor-pointer" htmlFor="files">
              Change Picture
            </label>
            <input
              id="files"
              style={{ visibility: "hidden" }}
              className="w-0 h-0"
              type="file"
              onChange={changePicture}
            ></input>
          </>
        ) : (
          <>
            <img
              className="rounded-full mx-2"
              width={50}
              height={50}
              src={image}
            />
            <label className="cursor-pointer" htmlFor="files">
              Change Picture
            </label>
            <input
              id="files"
              style={{ visibility: "hidden" }}
              className="w-0 h-0"
              type="file"
            ></input>
          </>
        )}
      </div>
      <textarea
        className="flex-col rounded-md mb-2 p-3"
        name=""
        id=""
        cols={30}
        rows={10}
        value={bio}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          setBio(e.target.value);
        }}
      ></textarea>
      <button>Save Changes</button>
    </form>
  );
}
