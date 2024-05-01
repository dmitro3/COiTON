"use client";

import { supabase } from "@/constants";
import { useEffect, useState } from "react";

export default function UsersPage() {
  // const [allUsers, setAllUsers] = useState<any>();

  // useEffect(() => {
  //   const fetchAllUsers = async () => {
  //     try {
  //       const {
  //         data: { users },
  //         error,
  //       } = await supabase.auth.admin.listUsers();

  //       if (users) {
  //         setAllUsers(users);
  //         console.log(users);
  //       } else {
  //         console.log(error);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchAllUsers();
  // }, []);

  return (
    <div className="flex-1 flex flex-col gap-4">
      <h1 className="text-xl md:text-2xl capitalize font-bold">All Users</h1>
    </div>
  );
}
