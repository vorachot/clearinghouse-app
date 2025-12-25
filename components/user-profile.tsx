"use client";

import { useState, useRef, useEffect } from "react";
import { User } from "@heroui/user";
import { Button } from "@heroui/button";
import { LogoutOutlined, KeyboardArrowDown } from "@mui/icons-material";

import { useUser } from "@/context/UserContext";
// import { logoutUser } from "@/api/auth";

export const UserProfile = () => {
  // const user = {
  //   username: "John Doe",
  //   email: "john.doe@example.com",
  //   picture: "",
  // };
  const { user, clearUser } = useUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showActions]);

  // const handleLogout = async () => {
  //   setIsLoggingOut(true);
  //   try {
  //     await logoutUser();
  //     clearUser();
  //     window.location.href = "/login";
  //   } catch {
  //     clearUser();
  //     window.location.href = "/login";
  //   } finally {
  //     setIsLoggingOut(false);
  //   }
  // };

  if (!user) {
    return (
      <Button as="a" href="/login" variant="flat">
        Login
      </Button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onPress={() => setShowActions((v) => !v)}
        className="flex items-center gap-3 bg-blue-300/60 dark:bg-blue-950/80 px-0 pl-1 pr-4 py-7 rounded-xl hover:bg-blue-300/80 dark:hover:bg-blue-900/80 transition-all duration-200"
      >
        <User
          className="text-gray-900 dark:text-gray-100 text-left"
          avatarProps={{
            src: "",
            name: `${user.first_name} ${user.last_name}`,
          }}
          description={
            <span className="text-gray-700 dark:text-gray-300">
              {user.email}
            </span>
          }
          name={user.first_name + " " + user.last_name}
        />
        <KeyboardArrowDown
          className={`transition-transform duration-200 ${showActions ? "rotate-180" : ""}`}
          fontSize="small"
        />
      </Button>

      {showActions && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-800 shadow-xl ring-1 ring-black/10 dark:ring-white/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-1">
            <Button
              fullWidth
              color="danger"
              disabled={isLoggingOut}
              variant="light"
              className="justify-start px-4 py-3 text-sm font-medium rounded-none hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              onPress={() => {
                alert("Logout clicked");
              }}
            >
              <div className="flex items-center gap-3">
                <LogoutOutlined fontSize="small" />
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </div>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
