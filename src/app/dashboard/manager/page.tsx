import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import ManagerDashboard from "@/components/dashboard/ManagerDashboard";
import { redirect } from "next/navigation";

const ManagerPage = async () => {
  //check user and permission
  const user = await getCurrentUser();

  if (!user || !checkUserPermission(user, Role.MANAGER)) {
    redirect("/unauthorized");
  }

  //fetch manager's own team members
  const primsaMyTeamMembers = user.teamId
    ? prisma.user.findMany({
        where: {
          teamId: user.teamId,
          role: { not: Role.ADMIN },
        },
        include: {
          team: true,
        },
      })
    : [];

  //fetch all team members exclude Managers of cross-teams (cross-team-view)
  const primsaAllTeamMembers = prisma.user.findMany({
    where: {
      role: { notIn: [Role.ADMIN, Role.MANAGER] },
    },
    include: {
      team: {
        select: {
          id: true,
          name: true,
          code: true,
          description: true,
        },
      },
    },
    orderBy:{teamId:"desc"}
  });

  return (
    <ManagerDashboard
      myTeamMembers={primsaMyTeamMembers}
      allTeamMembers={primsaAllTeamMembers}
      CurrentUser={user}
    />
  );
};

export default ManagerPage;
