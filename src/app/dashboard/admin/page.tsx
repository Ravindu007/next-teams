import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { transformTeams, transformUsers } from "@/app/lib/util";
import { Role } from "@/app/types";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import { redirect } from "next/navigation";

const AdminPage = async () => {
  //check user and permission
  const user = await getCurrentUser();

  if (!user || !checkUserPermission(user, Role.ADMIN)) {
    redirect("/unauthorized");
  }

  //fetch data
  const [prismaUsers, prismaTeams] = await Promise.all([
    // get all users
    prisma.user.findMany({
      include: {
        team: true,
      },
      orderBy: { createdAt: "desc" },
    }),

    //get all teams
    prisma.team.findMany({
      include: {
        members: {
          select: {
            id: true,
            name: true,
            role: true,
            email: true,
          },
        },
      },
    }),
  ]);

  const users = transformUsers(prismaUsers);
  const teams = transformTeams(prismaTeams);

  return <AdminDashboard users={users} teams={teams} currentUser={user} />;
};

export default AdminPage;
