import { getCurrentUser } from "../lib/auth";
import { redirect } from "next/navigation";
import { Role } from "../types";

const Dashboard = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  console.log("role in dashbaord", user.role)

  switch (user.role) {
    case Role.ADMIN:
      redirect("/dashboard/admin");
    case Role.MANAGER:
      redirect("/dashboard/manager");
    case Role.USER:
      redirect("/dashboard/user");
    default:
      redirect("/dashboard/user");
  }
};

export default Dashboard;
