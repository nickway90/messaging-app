"use client";
import Link from "next/link";
import { ApolloClient, InMemoryCache, gql, HttpLink } from "@apollo/client";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Login() {

  const router = useRouter();

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

  const client = getClient();

  const GET_MESSENGER = gql`
    query GetMessenger {
      Messenger(where: { username: { _eq: "${username}"} }) {
        password
      }
    }
  `;

   const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()

    const fetchPassword = await client.query({ query: GET_MESSENGER });

    if(fetchPassword.data.Messenger.length === 0) {
      window.alert("This Username Does Not Exist")
      return
    }

    const databasePassword:string = fetchPassword.data.Messenger[0].password
    
     const response = await fetch("/generateToken", {
       method: "POST",
       body: JSON.stringify({databasePassword, username, password})
     });

     const { output } = await response.json();

     if (output === "Invalid Password!") {
        window.alert("Wrong Password!")
        return
     }

     router.push("/")
   };


  return (
    <main className="flex flex-col justify-center items-center h-screen">
      <form className="flex flex-col" onSubmit={handleSubmit}>
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
        <button className="mt-2">Login</button>
      </form>
      <h1 className="font-semibold">
        Don't have an account?{" "}
        <span className="text-blue-500">
          <Link className="cursor-pointer" href="/register">
            Sign Up
          </Link>
        </span>
      </h1>
    </main>
  );
}
