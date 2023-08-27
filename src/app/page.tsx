"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteCookie, getCookie } from "cookies-next";
import Link from "next/link";

type Messages = {
  message:string
  username:string
  id:number
};

export default function Home() {
  const [username, setUsername] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [fetchedMessages, setFetchedMessages] = useState<Messages[]>([])
  const [lastIndex, setLastIndex] = useState<number>(0)
  const [messengerMap, setMessengerMap] = useState<Map<string, string>>(new Map());
  const [messageModal, setMessageModal] = useState<boolean>(true)
  const [messageIndex, setMessageIndex] = useState<number | null>(null)
  const [editOn, setEditOn] = useState<boolean>(false)
  const [newMessage, setNewMessage] = useState<string>("")

const router = useRouter()

const allMessengers = new Map();
 
  const fetchMessages = async () => {
    const response = await fetch("/fetchMessages", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const allMessages = await response.json()
    const Messengers = allMessages.messages.data.Messenger;
    for(const messenger of Messengers) {
        allMessengers.set(messenger.username, messenger.profile_picture)
  }
  setMessengerMap(allMessengers)
  setFetchedMessages(allMessages.messages.data.Message);
  setLastIndex(fetchedMessages.length-1)
  console.log(allMessages)
}

const reset = async () => {
  setMessageModal(false);
  setEditOn(false);
  setFetchedMessages([]);
  setMessengerMap(new Map());
  setMessage("");
  await fetchMessages();
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
    await reset()
  };

  const logOut = () => {
   deleteCookie("token");
   router.push("/login")
  }

  const handleMessageModal = (index:number) => {
    if(messageIndex === index) {
      setMessageModal(false)
      setMessageIndex(null)
      setEditOn(false)
    } else {
      setMessageModal(true)
      setMessageIndex(index)
    }
  }

  const handleEditModal = (message:string) => {
    if(editOn) {
       setEditOn(false);
       setMessageIndex(null);
    } else {
        setEditOn(true);
        setMessageModal(false);
        setNewMessage(message);
    }
  }

  const editMessage = async(id:number) => {
   const response = await fetch("/editMessage", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ id, newMessage }),
     });
     const data = await response.json()

       if (!data.error) {
         window.alert(data.output);
       } else {
         window.alert(data.error);
       }

      await reset();
  }
  

  const deleteMessage = async(message:string) => {
    const response = await fetch("/deleteMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json()

    if(!data.error) {
      window.alert(data.output)
    } else {
      window.alert(data.error)
    }

     await reset();
  }



  useEffect(() => {
    fetchMessages()
    getUserName()
  },[])


  return (
    <>
      <main className="flex justify-center items-center h-screen">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col bg-[#B3C7D6]  h-[80%] w-[80%] md:w-[55%]  rounded-md"
        >
          {fetchedMessages.map((message, index) => {
            return (
              <main
                className={`flex justify-end overflow-y-auto pt-3 w-[100%] ${
                  index === lastIndex ? "h-[100%]" : "h-[25%]"
                }`}
                key={index}
              >
                {message.username === username ? (
                  <>
                    <div className="flex justify-end">
                      {index === messageIndex && editOn && (
                        <div className="flex flex-col items-center rounded-md w-auto h-[70px] z-50 text-white bg-black relative top-6 right-5">
                          <span className="flex cursor-pointer justify-center items-center px-3 pt-3">
                            <p onClick={() => editMessage(message.id)}>
                              Finish Edit
                            </p>
                          </span>
                          <span className="flex justify-center pb-3 items-center border-t-gray-500 border-solid w-[100%] text-center border-t-[1px] cursor-pointer">
                            <p
                              onClick={() => handleEditModal("")}
                            >
                              Cancel Edit
                            </p>
                          </span>
                        </div>
                      )}
                      {index === messageIndex && messageModal && (
                        <div className="flex flex-col items-center rounded-md w-auto h-[70px] z-50 text-white bg-black relative top-6 right-5">
                          <span className="flex cursor-pointer justify-center items-center px-3 pt-3">
                            <p onClick={() => deleteMessage(message.message)}>
                              delete
                            </p>
                          </span>
                          <span className="flex justify-center pb-3 items-center border-t-gray-500 border-solid w-[100%] text-center border-t-[1px] cursor-pointer">
                            <p
                              onClick={() => handleEditModal(message.message)}
                            >
                              edit
                            </p>
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col">
                        <div>
                          <p>{username}</p>
                        </div>
                        <div className="flex">
                          {index === messageIndex && editOn ? (
                            <div className="flex mr-1 justify-center break-normal whitespace-normal items-center pl-2 pr-2 bg-white max-h-[10rem] max-w-[90%] w-auto rounded-md text-black">
                              <input
                                type="text"
                                value={newMessage}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => setNewMessage(e.target.value)}
                                className="outline-green-400"
                              />
                            </div>
                          ) : (
                            <div
                              onClick={() => handleMessageModal(index)}
                              className="flex mr-1 justify-center break-normal whitespace-normal items-center pl-2 pr-2 bg-white max-h-[10rem] max-w-[90%] w-auto rounded-md text-black cursor-pointer"
                            >
                              <p>{message.message}</p>
                            </div>
                          )}
                          <Link href={`/profile/${message.username}`}>
                            <img
                              src={messengerMap.get(message.username)}
                              alt=""
                              className="rounded-3xl w-10 mr-3 h-10"
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex">
                    <div className="flex flex-col">
                      <div>
                        <p>{message.username}</p>
                      </div>
                      <div className="flex">
                        <div className="flex mr-1 justify-center break-normal whitespace-normal items-center pl-2 pr-2 bg-white max-h-[10rem] max-w-[90%] w-auto rounded-md text-black">
                          <p>{message.message}</p>
                        </div>
                        <img
                          src={messengerMap.get(message.username)}
                          alt=""
                          className="rounded-3xl w-10 mr-3 h-10"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </main>
            );
          })}
          <div className="flex flex-col justify-end h-[10%] w-[100%]">
            <input
              className="flex justify-end h-10 pl-3 "
              placeholder="Whats on your mind..."
              type="text"
              value={message}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setMessage(e.target.value);
              }}
            />
          </div>
        </form>
        <div className="flex flex-col">
          <Link className="cursor-pointer" href={`/profile/${username}`}>
            View Profile
          </Link>
          <button onClick={logOut}>Logout</button>
        </div>
      </main>
    </>
  );
}