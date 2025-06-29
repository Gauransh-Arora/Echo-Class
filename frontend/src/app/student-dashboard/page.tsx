"use client";
import React, { useState, useEffect } from "react";
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

export default function StudentDashboard() {
  const router = useRouter();

  const [open, setOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState("");

  const handleLogout = () => {
    console.log("Logging out...");
    router.push("/login");
  };

  const handleJoinClass = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) throw new Error("No access token");

      await fetch("http://127.0.0.1:8000/api/classrooms/join/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      setCode("");
      setShowModal(false);
      router.push("/student-classes");
    } catch (err: any) {
      console.error("Join class error:", err);
      alert("Failed to join class. Please check the code or try again.");
    }
  };

  const links = [
    {
      label: "Dashboard",
      href: "/student-dashboard",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Classes",
      href: "/student-classes",
      icon: (
        <IconClipboardText className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Profile",
      href: "/student-profile",
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
      {/* Menu Toggle for mobile */}
      <button
        onClick={() => setOpen(!open)}
        className="absolute top-4 left-4 z-50 rounded-md bg-white px-3 py-1 shadow-md md:hidden"
      >
        {open ? "Close" : "Menu"}
      </button>

      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="flex flex-1">
        <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Welcome back, Student!
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 p-4 text-white shadow">
              <h3 className="text-lg">Enrolled Classes</h3>
              <p className="text-2xl font-bold">5</p>
            </div>

            <div className="rounded-lg bg-gradient-to-r from-green-400 to-green-600 p-4 text-white shadow">
              <h3 className="text-lg">Upcoming Assignments</h3>
              <p className="text-2xl font-bold">2</p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-medium text-black dark:text-white mb-2">
              Quick Links
            </h4>
            <div className="flex gap-4">
              <button
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={() => setShowModal(true)}
              >
                Join Class
              </button>
              <a href="\timetable.jpg" target="_blank" rel="noopener noreferrer">
                <button className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600">
                  View Timetable
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Join Class Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Join Class</h2>
            <form onSubmit={handleJoinClass} className="space-y-4">
              <input
                type="text"
                placeholder="Class Code"
                className="w-full border p-2 rounded text-gray-800"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-black bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
