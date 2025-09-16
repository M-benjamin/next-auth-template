import RoleGate from "@/components/auth/role-gate";
import FormSuccess from "@/components/form-success";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { currentRole, currentUser } from "@/lib/auth";
import { Role } from "@prisma/client";

const ServerPage = async () => {
  const user = await currentUser();
  const role = await currentRole();

  return (
    <Card className="w-[600px] shadow-sm">
      <CardHeader>ADMIN</CardHeader>
      <CardContent>
        <RoleGate allowedRole={Role.ADMIN}>
          <FormSuccess message="You are an admin" />
        </RoleGate>
        <p>User: {role}</p>
      </CardContent>
    </Card>
  );
};

export default ServerPage;
