import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import { Role, User } from "../types"
import { cookies } from "next/headers"
import { prisma } from "./db"

// for password hashing
export const hashpassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, 12)
}

//verify password
export const verifyPassword = (originalPassword: string, hashPassword: string): Promise<boolean> => {
    return bcrypt.compare(originalPassword, hashPassword)
}


const JWT_SECRET = process.env.JWT_SECRET!;

// generate a token (has to pass a payload, to generate a token, in here it is user id)
export const generateToken = (userId: string): string => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

//verify a token
export const verifyToken = (token: string): { userId: string } => {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
}



// Get Current User (which is used in "api/auth/me")
export const getCurrentUser = async (): Promise<User | null> => {
    try {
        //extract the cookie (comes with next/headers)
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return null;

        // if we have the token
        const decode = verifyToken(token) //which returns the payload{userId}

        //now we have the userId, lets get details from the DB
        const userFromDb = await prisma.user.findUnique({
            where: {
                id: decode.userId
            }
        })

        if(!userFromDb) return null

        //if we have the user
        const {password, ...user} = userFromDb;
        return user as User
    } catch (error) {
        console.error(error)
        return null;
    }
}

// check user permission
export const checkUserPermission = (user:User, requiredRole:Role):boolean => {
    // heirarch of roles 
    const roleHierarchy = {
        [Role.GUEST]:0,
        [Role.USER]:1,
        [Role.MANAGER]:2,
        [Role.ADMIN]:3,
    }

    //if user's role is >= the requestedPermission, it return true
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole]; 
}

