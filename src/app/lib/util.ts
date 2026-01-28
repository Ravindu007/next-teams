import { User, Team } from "../types";


//function to transform Prisma response => to frontend-usable function
export function transformFromPrismaUserToClientUser(user: any): User {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        teamId: user.teamId || undefined,
        team: user.team || undefined,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }
}

export function transformUsers(users: any[]): User[] {
    return users.map(transformFromPrismaUserToClientUser)
}


//team transformation 
export function transformPrismaTeamToClientTeam(team: any): Team {
    return {
        id: team.id,
        name: team.name,
        description: team.description || undefined,
        code: team.code,
        members: team.members || [],
        createdAt: team.createdAt,
        updatedAt: team.updatedAt
    }
}

export function transformTeams(teams: any[]): Team[] {
    return teams.map(transformPrismaTeamToClientTeam)
}