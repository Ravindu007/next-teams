import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import UserDashboard from "@/components/dashboard/UserDashboard";
import { redirect } from "next/navigation";

const UserPage = async () => {
  //check user and permission
  const user = await getCurrentUser();

  if (!user) {
    redirect("login");
  }

  //fetch user specific data
  const primsaMyTeamMembers = user.teamId
    ? prisma.user.findMany({
        where: {
          teamId: user.teamId,
          role: { not: Role.ADMIN },
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      })
    : [];

  return <UserDashboard teamMembers={primsaMyTeamMembers} CurrentUser={user} />;
};

export default UserPage;
