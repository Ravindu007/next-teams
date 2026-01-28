"use client";

import { apiClient } from "@/app/lib/apiClient";
import { useAuth } from "@/app/provider/AuthProvider";
import { User } from "@/app/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  user: User | null;
}

const Header = ({ user }: HeaderProps) => {
  const { logout } = useAuth();

  const pathName = usePathname();
  const navigationItems = [
    { name: "home", href: "/", show: true },
    { name: "Dashboard", href: "/dashboard", show: true },
  ].filter((item) => item.show);

  //dynamic class appliy for nav link
  const getNavItemClass = (href: string) => {
    let isActive = false;
    if (href === "/") {
      isActive = pathName === "/"; //(isActive = true/false)
    } else if ((href = "/dashboard")) {
      isActive = pathName.startsWith(href);
    }

    return `px-3 py-2 rounded text-sm font-medium transition-colors ${isActive ? "bg-blue-600 text-white" : "text-salte-300 hover:bg-slate-800 hover:text-whaite"}`;
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-white/10">
      <div className="text-xl font-semibold">TeamAccess</div>
      {/* navigation items */}
      <div className="flex items-center gap-6">
        {navigationItems.map((item, index) => (
          <Link
            href={item.href}
            className={getNavItemClass(item.href)}
            key={index}
          >
            {item.name}{" "}
          </Link>
        ))}
      </div>
      {/* user-info */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="flex items-center gap-4">{user.name}</div>
            <button
              className="rounded-md bg-red-600 px-5 py-2 text-sm font-medium hover:bg-red-700"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* auth div */}
            <div className="flex items-center gap-4">
              <Link
                href={"/login"}
                className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium hover:bg-blue-700"
              >
                Login
              </Link>
              <Link
                href={"/register"}
                className="rounded-md border border-white/20 px-5 py-2 text-sm font-medium text-gray-300 hover:bg-white/10"
              >
                Register
              </Link>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
