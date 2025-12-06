"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SwitchAccessShortcut } from "@mui/icons-material";

import { UserProfile } from "./user-profile";

// import { useBreadcrumb } from "@/context/BreadCrumbContext";
// import { getDisplayName } from "@/utils/helper";

const Breadcrumb = () => {
  const pathname = usePathname();
  // const { breadcrumbData } = useBreadcrumb();
  const segments = pathname.split("/").filter(Boolean);

  // const crumbs = segments.map((seg, i) => {
  //   const href = "/" + segments.slice(0, i + 1).join("/");
  //   const isLast = i === segments.length - 1;
  //   const displayName = getDisplayName(seg, breadcrumbData);

  //   // Show loading state for UUID segments without proper display name
  //   const isUUID =
  //     /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
  //       seg
  //     );
  //   const isLoading = isUUID && displayName === seg && !breadcrumbData?.[seg];

  //   return (
  //     <li key={href} className="inline-flex items-center font-medium">
  //       {!isLast ? (
  //         <Link
  //           className="capitalize text-[18px] hover:text-blue-600 hover:underline"
  //           href={href}
  //         >
  //           {isLoading ? (
  //             <span className="inline-block w-20 h-5 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
  //           ) : (
  //             displayName
  //           )}
  //         </Link>
  //       ) : (
  //         <span className="capitalize text-[18px] text-gray-500 dark:text-gray-400 cursor-default">
  //           {isLoading ? (
  //             <span className="inline-block w-20 h-5 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
  //           ) : (
  //             displayName
  //           )}
  //         </span>
  //       )}
  //       {!isLast && (
  //         <svg
  //           className="text-[18px] mx-2 h-4 w-4 text-gray-400"
  //           fill="none"
  //           stroke="currentColor"
  //           strokeWidth="2"
  //           viewBox="0 0 24 24"
  //         >
  //           <path
  //             d="M9 5l7 7-7 7"
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //           />
  //         </svg>
  //       )}
  //     </li>
  //   );
  // });

  return (
    <nav
      aria-label="Breadcrumb"
      className="h-16 bg-blue-300 dark:bg-blue-950 dark:border-gray-700 fixed top-0 w-full py-2 z-40 flex justify-between items-center"
    >
      <div className="w-fit flex-1 px-4">
        <ol className="container py-4 flex items-center text-gray-700 dark:text-gray-300 text-sm">
          <li className="inline-flex items-center">
            <div className="w-fit flex justify-start items-start">
              <UserProfile />
            </div>
            {segments.length > 0 && (
              <svg
                className="mx-2 h-4 w-4 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </li>
          {/* {crumbs} */}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
