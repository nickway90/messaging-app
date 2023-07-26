"use client";
import {
  ApolloClient,
  InMemoryCache,
  gql,
  HttpLink
} from "@apollo/client";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";


export default function Home() {

const router = useRouter()

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
}


 const client = getClient();

  const GET_MESSENGER = gql`
    query GetMessenger {
      Messenger {
             bio
             email
            id
           }
       }
  `;

  client.query({ query: GET_MESSENGER }).then((result) => console.log(result));

  const logOut = () => {
   deleteCookie("token");
   router.push("/login")
  }


  return (
    <main className="flex flex-col justify-center items-center h-screen">
      <div className="flex flex-col bg-[#B3C7D6]  h-[80%] w-[80%] md:w-[55%]  rounded-md">
        <div className="flex text-black flex-row-reverse overflow-y-auto pt-3 w-[100%] h-[15%]">
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
          />
        </div>
      </div>
      <button onClick={logOut}>Logout</button>
    </main>
  );
}
