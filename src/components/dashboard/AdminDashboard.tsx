"use client";

import { apiClient } from "@/app/lib/apiClient";
import { Role, Team, User } from "@/app/types";
import { useTransition } from "react";

interface AdminDashboardProps {
  users: User[];
  teams: Team[];
  currentUser: User;
}

const AdminDashboard = ({ users, teams, currentUser }: AdminDashboardProps) => {
  //Allows components to avoid undesirable loading states by waiting for content to load before transitioning to the next screen.
  const [isPending, startTransisition] = useTransition();

  //team assignment
  const handleTeamAssignment = async (
    userId: string,
    teamId: string | null,
  ) => {
    startTransisition(async () => {
      try {
        await apiClient.assignUserToTeam(userId, teamId);
        window.location.reload();
      } catch (error) {
        alert(error instanceof Error ? error.message : "Errror assigning team");
      }
    });
  };

  //role assignment
  const handleRoleAssignment = async (userId: string, newRole: Role) => {
    if (userId === currentUser.id) {
      alert("You cannot update your own role");
    }

    startTransisition(async () => {
      try {
        await apiClient.updateUserRole(userId, newRole);
        window.location.reload();
      } catch (error) {
        alert(error instanceof Error ? error.message : "Errror assigning role");
      }
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm">User and team management</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Users Card */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl border border-slate-800">
          <div className="p-4 border-b border-slate-800">
            <h2 className="font-semibold">Users ({users.length})</h2>
            <p className="text-sm text-slate-400">
              Manage roles and team assignment
            </p>
          </div>

          <div className="p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr className="border-b border-slate-800">
                  <th className="text-left py-2">Name</th>
                  <th className="text-left">Role</th>
                  <th className="text-left">Team</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-800 last:border-none"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p>{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <select
                        className="bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs"
                        value={user.role}
                        onChange={(e) => {
                          handleRoleAssignment(user.id, e.target.value as Role);
                        }}
                        disabled={isPending || user.id === currentUser.id}
                      >
                        <option value={Role.ADMIN}>ADMIN</option>
                        <option value={Role.MANAGER}>MANAGER</option>
                        <option value={Role.USER}>USER</option>
                      </select>
                    </td>

                    <td>
                      <select
                        className="bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs"
                        value={user.teamId || ""}
                        onChange={(e) => {
                          handleTeamAssignment(user.id, e.target.value || null);
                        }}
                        disabled={isPending}
                      >
                        <option value={""}>No Team</option>
                        {teams.map((team) => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                      {user.team && (
                        <span className="ml-2 text-xs text-blue-400">
                          {user.team.code}
                        </span>
                      )}
                    </td>

                    <td>
                      {user.team && (
                        <button
                          className="text-red-400 text-xs hover:underline"
                          onClick={() => {
                            handleTeamAssignment(user.id, null);
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Teams Card */}
        <div className="bg-linear-to-b from-slate-900 to-slate-950 rounded-xl border border-slate-800">
          <div className="p-4 border-b border-slate-800">
            <h2 className="font-semibold">Teams {teams.length}</h2>
            <p className="text-sm text-gray-400">Team Overview</p>
          </div>

          <div className="p-4">
            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr className="border-b border-slate-800">
                  <th className="text-left py-2">Name</th>
                  <th className="text-left">Code</th>
                  <th className="text-left">Members</th>
                  <th className="text-left">Managers</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, idx) => {
                  const teamMembers = users.filter(
                    (user) => user.teamId === team.id,
                  );

                  const teamManagers = teamMembers.filter(
                    (user) => user.role === Role.MANAGER,
                  );

                  return (
                    <tr key={team.id}>
                      <td>{team.code}</td>
                      <td>{team.name}</td>
                      <td>{teamMembers.length} users</td>
                      <td>
                        {teamMembers.length > 0 ? (
                          teamManagers.map((manager) => (
                            <span key={manager.id}>{manager.name}</span>
                          ))
                        ) : (
                          <span>No Manager</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
