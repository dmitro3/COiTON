"use client";

import { AuthContext } from "@/context/authentication";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";

export default function DashboardPage() {
  const router = useRouter();

  const { user, isFetchingUser } = useContext(AuthContext);

  return (
    <div className="flex-1 py-4 flex flex-col gap-6">
      <h1 className="text-xl font-bold">Find your dream home</h1>

      {isFetchingUser ? <p>Loading...</p> : user && <p>{user?.email}</p>}
    </div>
  );
}
