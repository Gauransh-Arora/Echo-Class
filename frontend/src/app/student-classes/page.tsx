"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
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
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

type ClassType = {
  id: number;
  code: string;
};

export default function StudentClasses() {
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
      href: "/profile",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      router.push("/login"); // redirect to login if token is missing
      return;
    }
    fetchClasses();
  }, []);

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh");
    if (!refreshToken) return false;

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/users/token/refresh/",
        { refresh: refreshToken }
      );
      localStorage.setItem("access", res.data.access);
      return true;
    } catch (err) {
      console.error("Token refresh failed:", err);
      return false;
    }
  };

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) throw new Error("No access token");

      const res = await axios.get(
        "http://127.0.0.1:8000/api/classrooms/student-classrooms/",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setClasses(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) return fetchClasses();
        alert("Session expired. Please log in again.");
        router.push("/login");
      } else {
        console.error("Fetch error:", err);
        alert("Failed to fetch classes.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) throw new Error("No access token");

      await axios.post(
        "http://127.0.0.1:8000/api/classrooms/join/",
        { code },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setCode("");
      setShowModal(false);
      fetchClasses();
    } catch (err: any) {
      if (err.response?.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) return handleJoinClass(e);
        alert("Session expired. Please log in again.");
        router.push("/login");
      } else {
        console.error("Join class error:", err.response?.data || err.message);
        alert(
          err.response?.data?.error ||
            "Failed to join class. Make sure the code is correct."
        );
      }
    }
  };

  const handleCardClick = (id: number) => {
    router.push(`/student-classes/${id}`);
  };

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen"
      )}
    >
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
        </SidebarBody>
      </Sidebar>

      <div className="flex flex-1 flex-col rounded-tl-2xl border border-neutral-200 bg-white p-6 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="  px-4 py-2 rounded bg-gradient-to-b from-green-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset] "
          >
            + Join Class
          </button>
        </div>

        <div className="flex flex-wrap gap-6">
          {loading ? (
            <div className="text-gray-500 dark:text-gray-400">
              Loading classes...
            </div>
          ) : classes.length > 0 ? (
            classes.map((cls) => (
              <div
                key={cls.id}
                className="cursor-pointer"
                onClick={() => handleCardClick(cls.id)}
              >
                <CardContainer className="inter-var" containerClassName="!py-0">
                  <CardBody className="relative group/card dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] sm:w-[20rem] rounded-xl p-6 border bg-gray-50">
                    <CardItem
                      translateZ="50"
                      className="text-lg font-bold text-neutral-700 dark:text-white"
                    >
                      {cls.name || cls.code}
                    </CardItem>
                    <CardItem
                      as="p"
                      translateZ="40"
                      className="text-sm text-neutral-500 mt-1 dark:text-neutral-300"
                    >
                      {cls.description || "Click to view class"}
                    </CardItem>

                    <CardItem
                      as="p"
                      translateZ="60"
                      className="text-neutral-500 text-sm mt-2 dark:text-neutral-300"
                    ></CardItem>
                    <CardItem translateZ="100" className="w-full mt-4">
                      <div
                        className="h-60 w-full rounded-xl group-hover/card:shadow-xl"
                        style={{ backgroundColor: getRandomColor() }}
                      ></div>
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </div>
            ))
          ) : (
            <div className="text-gray-500 dark:text-gray-400">
              You have not joined any classes yet.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
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
      {/* Chatbot Floating Button */}
    </div>
  );
}

export const Logo = () => (
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

export const LogoIcon = () => (
  <a
    href="#"
    className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
  >
    <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
  </a>
);

const getRandomColor = () => {
  const colors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#F1C40F",
    "#E74C3C",
    "#8E44AD",
    "#3498DB",
    "#2ECC71",
    "#FF33A8",
    "#FF8C33",
    "#1ABC9C",
    "#9B59B6",
    "#34495E",
    "#D35400",
    "#7D3C98",
    "#16A085",
    "#27AE60",
    "#2980B9",
    "#C0392B",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
