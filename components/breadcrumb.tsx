"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getOrganizationById } from "@/api/org";
import { getProjectById } from "@/api/project";

import { UserProfile } from "./user-profile";

type BreadcrumbData = {
  [key: string]: string;
};

const isUUID = (str: string) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    str
  );
};

const Breadcrumb = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const [breadcrumbData, setBreadcrumbData] = useState<BreadcrumbData>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchDisplayNames = async () => {
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];

        if (isUUID(segment)) {
          const prevSegment = i > 0 ? segments[i - 1] : null;

          // Fetch organization name
          if (prevSegment === "organizations") {
            setLoading((prev) => ({ ...prev, [segment]: true }));
            try {
              const org = await getOrganizationById(segment);
              setBreadcrumbData((prev) => ({ ...prev, [segment]: org.name }));
            } catch (error) {
              console.error("Error fetching organization:", error);
              setBreadcrumbData((prev) => ({
                ...prev,
                [segment]: segment.slice(0, 8),
              }));
            }
            setLoading((prev) => ({ ...prev, [segment]: false }));
          }
          // Fetch project name
          else if (i >= 2 && isUUID(segments[i - 1])) {
            setLoading((prev) => ({ ...prev, [segment]: true }));
            try {
              const project = await getProjectById(segment);
              setBreadcrumbData((prev) => ({
                ...prev,
                [segment]: project.name,
              }));
            } catch (error) {
              console.error("Error fetching project:", error);
              setBreadcrumbData((prev) => ({
                ...prev,
                [segment]: segment.slice(0, 8),
              }));
            }
            setLoading((prev) => ({ ...prev, [segment]: false }));
          }
        }
      }
    };

    if (segments.length > 0) {
      fetchDisplayNames();
    }
  }, [pathname]);

  const getDisplayName = (segment: string): string => {
    if (isUUID(segment)) {
      return breadcrumbData[segment] || segment.slice(0, 8);
    }

    // Special case for organizations -> Dashboard
    if (segment.toLowerCase() === "organizations") {
      return "Dashboard";
    }

    // Capitalize and format segment names
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const crumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const isLast = i === segments.length - 1;
    const displayName = getDisplayName(seg);
    const isLoadingSegment = isUUID(seg) && loading[seg];

    return (
      <li key={href} className="inline-flex items-center">
        {!isLast ? (
          <Link
            className="text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors duration-200"
            href={href}
          >
            {isLoadingSegment ? (
              <span className="inline-block w-24 h-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            ) : (
              displayName
            )}
          </Link>
        ) : (
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {isLoadingSegment ? (
              <span className="inline-block w-24 h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            ) : (
              displayName
            )}
          </span>
        )}
        {!isLast && (
          <svg
            className="mx-3 h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0"
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
    );
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className="h-16 bg-blue-300 dark:bg-blue-950 dark:border-b dark:border-gray-700 fixed top-0 w-full z-40 flex items-center shadow-sm"
    >
      <div className="w-full flex flex-1 px-6">
        <span className="ml-2 font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-tr from-blue-600 to-purple-500 tracking-tight select-none logo-font">
          CrossCut
        </span>
        <ol className="flex items-center gap-1">
          <li className="inline-flex items-center">
            {segments.length > 0 && (
              <svg
                className="mx-3 h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0"
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
          {crumbs}
        </ol>
      </div>
      <div className="w-fit flex justify-end items-end px-4">
        <UserProfile />
      </div>
    </nav>
  );
};

export default Breadcrumb;
