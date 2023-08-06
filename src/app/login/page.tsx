"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Login() {

  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

 
   const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    
     const response = await fetch("/generateToken", {
       method: "POST",
       body: JSON.stringify({username, password})
     });

     const { output } = await response.json();

      if (output === "Invalid Username!") {
        window.alert("Invalid Username!");
        return;
      }

     if (output === "Invalid Password!") {
       window.alert("Invalid Password!");
       return;
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
