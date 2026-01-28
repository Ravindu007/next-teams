"use client";

import {
  createContext,
  useActionState,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContextType, Role, User } from "../types";
import { apiClient } from "../lib/apiClient";

type LoginState = {
  success?: boolean;
  user?: User | null;
  error?: string;
};

//create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//create the provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  //1. user
  const [user, setUser] = useState<User | null>(null);

  //2. login
  const [loginState, loginAction, isLoginPending] = useActionState(
    async (prevState: LoginState, formData: FormData): Promise<LoginState> => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      try {
        const data = (await apiClient.login(email, password)) as unknown as {
          user: User;
        };
        setUser(data.user);
        return { success: true, user: data.user };
      } catch (err) {
        console.error("Error", err);
        return {
          success: false,
          error: err instanceof Error ? err.message : "Login Failed",
        };
      }
    },
    {
      error: undefined,
      success: undefined,
      user: undefined,
    } as LoginState,
  );

  //3. logout
  const logout = async () => {
    try {
      await apiClient.logout();
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout Error", error);
    }
  };

  //4. hasPermission
  const hasPermission = (requiredRole: Role) => {
    if (!user) return false;

    // heirarch of roles
    const roleHierarchy = {
      [Role.GUEST]: 0,
      [Role.USER]: 1,
      [Role.MANAGER]: 2,
      [Role.ADMIN]: 3,
    };

    //if user's role is >= the requestedPermission, it return true
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  //load user on mount
  const loadUser = async () => {
    try {
      const userData = (await apiClient.getCurrentUser()) as unknown as { user: User;};
      console.log("user issss",userData.user )
      setUser(userData.user);
    } catch (error) {
      console.log("Failed to load user", error);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  //define what will be available with the context
  return (
    <AuthContext.Provider
      value={{
        user,
        login: loginAction,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

//export context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("UseAuth must be used within AuthProvider");

  return context;
};

//also export the Provider
export default AuthProvider;
