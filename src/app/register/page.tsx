"use client";
import { useState } from "react";

import { ApolloClient, InMemoryCache, gql, HttpLink } from "@apollo/client";

export default function Register() {

const [email,setEmail] = useState<string>("")
const [username, setUsername] = useState<string>("");
const [password, setPassword] = useState<string>("");

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
const client = getClient();

 const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
   e.preventDefault();
   if(email === "" || username === "" || password === "") {
     window.alert("Make sure you do all fields")
     return;
   } 
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
     if (!email.match(validRegex) || email.charAt(email.length - 1) !== "m") {
       window.alert("Invalid Email");
       return;
     }
   client.mutate({ mutation: ADD_MESSENGER, variables: { username:username, email:email, password:password } });
 }; 

  return (
    <main className="flex flex-col justify-center items-center h-screen">
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <input
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          type="text"
          placeholder="email"
        />
        <input
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value)
          }
          className="mt-2"
          type="text"
          placeholder="username"
        />
        <input
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          className="mt-2"
          type="password"
          placeholder="password"
        />
        <button className="mt-2">Sign Up</button>
      </form>
    </main>
  );
}
