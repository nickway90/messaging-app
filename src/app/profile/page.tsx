"use client";
import { ApolloClient, InMemoryCache, gql, HttpLink } from "@apollo/client";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";

export default function Profile() {
   const imageData = ``
   const [username, setUsername] = useState<string>("");
   const [image, setImage] = useState<string>("");

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

const SAVE_PROFILE_PICTURE = gql`
  mutation AddMessenger($object: Messenger_insert_input!) {
    insert_Messenger_one(object: $object) {
      id
      username
      email
      password
    }
  }
`;


  

 
 const getUserName = async() => {
    const jwt = JSON.stringify(getCookie("token"));
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    setUsername(payload.username);
 }

 
const convertToBase64 = (e: React.ChangeEvent<HTMLInputElement>) => {
  const reader = new FileReader()
  reader.readAsDataURL(e.target.files[0])
  reader.onload = () => {
    console.log(typeof reader.result)
    setImage(reader.result as string)
  }
}


 useEffect(() => {
   getUserName()
 },[image])

  return (
    <main className="flex justify-center items-center h-screen">
      <div className="flex justify-between">
        <div>{username}</div>
        <input
          type="file"
          onChange={convertToBase64}
        />
        {image && <img className="rounded-full" width={100} height={100} src={image}/>} 
      </div>
    </main>
  );
}
