"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { Role } from "@prisma/client";
import FormError from "../form-error";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: Role;
}

const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return <FormError message="You are not authorized to access this page" />;
  }

  return <>{children}</>;
};

export default RoleGate;
