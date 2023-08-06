"use client";
import { useState } from "react";

import { useRouter } from "next/navigation";

export default function Register() {

const router = useRouter()

const [email,setEmail] = useState<string>("")
const [username, setUsername] = useState<string>("");
const [password, setPassword] = useState<string>("");


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

     const response = await fetch("/createMessenger", {
       method: "POST",
       body: JSON.stringify({ password, email, username }),
     });

     const { output } = await response.json();

     if (output === "This Username Has Already Been Taken") {
       window.alert("This Username Has Already Been Taken");
       return
     }

      if (output === "This Email Has Already Been Taken") {
        window.alert("This Email Has Already Been Taken");
        return
      }

       if (output === "Messenger Successfully Added") {
         window.alert("You have successfully registered");
       }

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
