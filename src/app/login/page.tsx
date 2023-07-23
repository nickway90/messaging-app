"use client";
import Link from "next/link";

export default function Login() {
  return (
    <main className="flex flex-col justify-center items-center h-screen">
      <input type="text" placeholder="username or email" />
      <input className="mt-2" type="text" placeholder="password" />
      <button className="mt-2">Submit</button>
      <h1 className="font-semibold">
        Don't have an account?{" "}
        <span className="text-blue-500">
          <Link className="cursor-pointer" href="/register">Sign Up</Link>
        </span>
      </h1>
    </main>
  );
}
