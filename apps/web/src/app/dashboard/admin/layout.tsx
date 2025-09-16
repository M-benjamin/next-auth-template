import { currentRole } from "@/lib/auth";
import { redirect } from "next/navigation";

// > Components
import Header from "@/components/dashboard/header/header";
import SideBar from "@/components/dashboard/sidebar/sidebar";

export default async function AdminDashbordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await currentRole();
  if (role !== "ADMIN") redirect("/");

  return (
    <div className="w-full h-full">
      {/* SIDEBAR */}
      <SideBar isAdmin={true} />
      <div className=" ml-[300px]">
        {/* HAEDER */}
        <Header />
        <div className="w-full mt-[75px] p-4">{children}</div>
      </div>
    </div>
  );
}
