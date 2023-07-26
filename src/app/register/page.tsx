"use client";
import { useState } from "react";

import { useRouter } from "next/navigation";

import { ApolloClient, InMemoryCache, gql, HttpLink } from "@apollo/client";

export default function Register() {

  const router = useRouter()

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

const EMAIL_TAKEN = gql`
  query EmailTaken {
    Messenger(
      where: {
        email: { _eq: "${email}" }
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
        username: { _eq: "${username}" }
      }
    ) {
      username
    }
  }
`;

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

async function fetchGeneratedPassword() {
  const response = await fetch("/password", {
    method: "POST",
    body: JSON.stringify({ password }),
  });


  const {output} = await response.json()
  return output
}

 const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
  e.preventDefault()
   if(email === "" || username === "" || password === "") {
     window.alert("Make sure you do all fields")
     return;
   } 

    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
     if (!email.match(validRegex) || email.charAt(email.length - 1) !== "m") {
       window.alert("Invalid Email");
       return;
     }

  const usernameTaken = await client.query({ query: USERNAME_TAKEN });

  const emailTaken = await client.query({ query: EMAIL_TAKEN });

   if(usernameTaken.data.Messenger.length > 0 || emailTaken.data.Messenger.length > 0) {
     window.alert("Make Sure Email And Username Haven't been taken")
     return
   }

   const hashedPassword = await fetchGeneratedPassword()

   const object = {bio: "", email: email, password: hashedPassword, profile_picture: null, username: username}

   const saveRegistration = await client.mutate({ mutation: ADD_MESSENGER, variables: {object} });

   if(saveRegistration) window.alert("You have successfully registered")

   router.push("/login")
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
