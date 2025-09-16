"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { signOut } from "next-auth/react";
import React from "react";

const SettingsPage = () => {
  const user = useCurrentUser();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div>
      Setting page {JSON.stringify(user)}
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  );
};

export default SettingsPage;
