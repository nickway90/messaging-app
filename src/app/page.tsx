"use client";
import {
  ApolloClient,
  InMemoryCache,
  gql,
  HttpLink
} from "@apollo/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteCookie, getCookie } from "cookies-next";


export default function Home() {

  const [username, setUsername] = useState<string>("")
  const [message, setMessage] = useState<string>("")


const router = useRouter()

let mapping = {}


  const fetchMessages = async () => {
    const response = await fetch("/fetchMessages", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json()
    console.log(data);

  };

  const getUserName = async () => {
    const jwt = JSON.stringify(getCookie("token"));
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    setUsername(payload.username);
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (message === "") return;
    const response = await fetch("/postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, message }),
    });

    const data = await response.json();

    if (data.outcome !== "Message has been posted") {
      window.alert("Message failed");
    }
  };

  const logOut = () => {
   deleteCookie("token");
   router.push("/login")
  }

  useEffect(() => {
    fetchMessages()
    getUserName()
  },[])


  return (
    <main className="flex flex-col justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col bg-[#B3C7D6]  h-[80%] w-[80%] md:w-[55%]  rounded-md">
        <div className="flex text-black flex-row-reverse overflow-y-auto pt-3 w-[100%] h-[15%]">
          <div className="flex flex-col">
            <div>
              <p>{username}</p>
            </div>
            <div className="flex justify-between">
              <div className="flex mr-1 justify-center break-normal whitespace-normal items-center pl-2 pr-2 bg-white max-h-[10rem] max-w-[90%] w-auto rounded-md text-black">
                <p>Hello</p>
              </div>
              <img
                src="/happyboiz.avif"
                alt=""
                className="rounded-3xl w-10 mr-3 h-10"
              />
            </div>
          </div>
        </div>
        <div className="flex pl-3 text-black overflow-y-auto pt-3 w-[100%] h-[100%]">
          <div className="flex flex-col">
            <div>
              <p>ljcutts</p>
            </div>
            <div className="flex justify-between">
              <div className="flex mr-1 justify-center break-normal whitespace-normal items-center pl-2 pr-2 bg-white max-h-[10rem] max-w-[90%] w-auto rounded-md text-black">
                <p>Hello</p>
              </div>
              <img
                src="/happyboiz.avif"
                alt=""
                className="rounded-3xl w-10 mr-3 h-10"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-end h-[10%] w-[100%]">
          <input
            className="flex justify-end h-10 pl-3 "
            placeholder="Whats on your mind..."
            type="text"
            value={message}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setMessage(e.target.value)
            }}
          />
        </div>
      </form>
      <button onClick={logOut}>Logout</button>
    </main>
  );
}