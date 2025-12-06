"use client";

import { useState } from "react";
import { User } from "@heroui/user";
import { Button } from "@heroui/button";

// import { useUser } from "@/context/UserContext";
// import { logoutUser } from "@/api/auth";

export const UserProfile = () => {
  const user = {
    username: "John Doe",
    email: "john.doe@example.com",
    picture: "",
  };
  // const { user, clearUser } = useUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // const handleLogout = async () => {
  //   setIsLoggingOut(true);
  //   try {
  //     await logoutUser();
  //     clearUser();
  //     // Redirect will be handled by middleware after clearing the cookie
  //     window.location.href = "/login";
  //   } catch {
  //     // Handle logout error if needed
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
    <div className="relative">
      <Button
        onPress={() => setShowActions((v) => !v)}
        className="flex items-center gap-3 bg-blue-300/60 dark:bg-blue-950/80 px-0 pl-1 pr-4 py-7 rounded-xl hover:bg-blue-300/80 dark:hover:bg-blue-900/80 transition"
      >
        <User
          className="text-gray-900 dark:text-gray-100 text-left"
          avatarProps={{
            src: user.picture,
            name: user.username,
          }}
          description={
            <span className="text-gray-700 dark:text-gray-300">
              {user.email}
            </span>
          }
          name={user.username}
        />
      </Button>

      {showActions && (
        <div className="absolute right-0 mt-2 w-36 rounded-xl bg-white shadow-lg ring-1 ring-black/5 dark:bg-gray-900 dark:ring-white/10">
          <Button
            fullWidth
            color="danger"
            disabled={isLoggingOut}
            size="sm"
            variant="flat"
            className="justify-start"
            onPress={() => {
              alert("Logout clicked");
            }}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      )}
    </div>
  );
};
