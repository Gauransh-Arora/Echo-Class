"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconClipboardText,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation"; 
import { label } from "motion/react-client";

export default function TeacherDashboard() {
  const [open, setOpen] = useState(true); 
  const router = useRouter(); 

  const handleLogout = () => {
    console.log("Teacher logging out...");
    router.push("/login"); 
  };

  const links = [
    {
      label: "Dashboard",
      href: "/teacher-dashboard",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Classes",
      href: "/teacher-classes",
      icon: (
        <IconClipboardText className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Profile",
      href: "/profile",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft
          onClick={handleLogout} 
          className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200 cursor-pointer"
        />
      ),
    },
  ];

  return (
    <div
      className={cn(
        "mx-auto flex w-full  flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen"
      )}
    >
      {}
      <button
        onClick={() => setOpen(!open)}
        className="absolute top-4 left-4 z-50 rounded-md bg-white px-3 py-1 shadow-md md:hidden"
      >
        {open ? "Close" : "Menu"}
      </button>

      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <img
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {}
      <Dashboard />
    </div>
  );
}

export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Acet Labs
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};


const Dashboard = () => {
  const router = useRouter();
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          Welcome back, Teacher!
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 p-4 text-white shadow">
            <h3 className="text-lg">Active Classes</h3>
            <p className="text-2xl font-bold">3</p>
          </div>

          <div className="rounded-lg bg-gradient-to-r from-red-400 to-red-600 p-4 text-white shadow">
            <h3 className="text-lg">Pending Reviews</h3>
            <p className="text-2xl font-bold">7</p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-lg font-medium text-black dark:text-white mb-2">
            Quick Actions
          </h4>
          <div className="flex gap-4">
            <button 
            onClick={() => router.push("/teacher-classes")}
            className="rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600">
              Create Class
            </button>
            <button className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">
              Grade Submissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
