"use client";

import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="font-barlow p-5">
      <div className="w-100 flex gap-x-5 justify-end">
        <UserButton />
        {/* <ThemeToggle /> */}
      </div>
      <h1 className="font-bold">Home Page</h1>

      <LoginButton>
        <Button>Click</Button>
      </LoginButton>
    </div>
  );
}
