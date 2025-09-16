import UserInfo from "@/components/auth/user-info";
import Logo from "@/components/shared/Logo";

import { currentUser } from "@/lib/auth";
import SidebarAdmin from "./sidebar-admin";
import { adminDashboardSidebarOptions } from "@/constants/data";

interface SideBarProps {
  isAdmin?: boolean;
}

const SideBar = async ({ isAdmin }: SideBarProps) => {
  const user = await currentUser();

  return (
    <div className="w-[300px] border-r h-screen p-4 flex flex-col fixed top-0 left-0 bottom-0">
      <Logo width="100%" height="300px" />
      <span className="mt-1" />

      {user && <UserInfo user={user} />}

      {isAdmin && <SidebarAdmin menuLinks={adminDashboardSidebarOptions} />}
    </div>
  );
};

export default SideBar;
