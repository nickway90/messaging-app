"use client";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";

export default function Profile({ params }: { params: { name: string } }) {
  const [username, setUsername] = useState<string>(params.name)
  const [jwtName, setJwtName] = useState("")
  const [image, setImage] = useState<string>("");
  const [bio, setBio] = useState<string>("");

  const retrieveInfo = async () => {
    const response = await fetch("/fetchProfile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    const messenger = await response.json();

    const picture = await messenger.messenger.profile_picture;
    const bio = await messenger.messenger.bio;
    setImage(picture ?? "");
    setBio(bio);
    return [picture, bio];
  };

  const getUserName = async () => {
    const jwt = JSON.stringify(getCookie("token"));
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    setJwtName(payload.username);
  };


  const changePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setImage(reader.result as string);
    };
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fetchedProfile = await retrieveInfo();

    if (fetchedProfile[0] === image && fetchedProfile[1] === bio) return;

    const response = await fetch("/updateProfile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, bio, image }),
    });

    const { output } = await response.json();

    if (output === "You have succesfully changed your bio and picture") {
      window.alert("You have succesfully changed your bio and picture");
    }

    if (output === "You have succesfully changed your bio") {
      window.alert("You have succesfully changed your bio");
    }

    if (output === "You have succesfully changed your picture") {
      window.alert("You have succesfully changed your picture");
    }
    await retrieveInfo();
  };

  useEffect(() => {
    retrieveInfo();
    getUserName()
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center items-center h-screen"
    >
    
      <div className="flex items-center justify-between mb-3">
        <div>{params.name}</div>
        {image === "" || image === null ? (
          <>
            <img
              src="/discord.jpeg"
              className="rounded-full mx-2"
              width={50}
              height={50}
            />
            {username === jwtName && (
              <>
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
            )}
          </>
        ) : (
          <>
            <img
              className="rounded-full mx-2"
              width={50}
              height={50}
              src={image}
            />
            {username === jwtName && (
              <>
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
            )}
          </>
        )}
      </div>
      <textarea
        className={`flex-col rounded-md mb-2 p-3 ${
          username !== jwtName && "outline-none"
        }`}
        name=""
        id=""
        cols={30}
        rows={10}
        value={bio}
        readOnly={username === jwtName ? false : true}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          setBio(e.target.value);
        }}
      ></textarea>
      {username === jwtName && <button>Save Changes</button>}
    </form>
  );
}
