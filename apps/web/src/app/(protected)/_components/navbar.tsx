import UserButton from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

import React from "react";

const Navbar = () => {
  return (
    <Card className="w-[600px] shadow-md flex justify-between mb-5">
      <Button variant="link" asChild>
        <Link href="/settings">settings</Link>
      </Button>
      <Button variant="link" asChild>
        <Link href="/server">server</Link>
      </Button>
      <Button variant="link" asChild>
        <Link href="/admin">admin</Link>
      </Button>
      <UserButton />
    </Card>
  );
};

export default Navbar;
