import React from "react";
import { ExtendUser } from "../../../next-auth";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

interface UserInfoProps {
  user?: ExtendUser;
}

const UserInfo = ({ user }: UserInfoProps) => {
  return (
    <div>
      <div>
        <Button
          className="w-full mt-5 mb-4 flex items-center justify-between py-10"
          variant="kong"
        >
          <div className="flex items-center text-left gap-2">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
              <AvatarFallback className="bg-primary text-white">
                {user?.name}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-y-1 text-white">
              {user?.name}
              <span className="text-muted-foreground text-black">
                {user?.email}
              </span>
              <span className="w-fit">
                <Badge variant="secondary" className="capitalize">
                  {user?.role ? user.role.toLocaleLowerCase() : ""} Dashboard
                </Badge>
              </span>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default UserInfo;
