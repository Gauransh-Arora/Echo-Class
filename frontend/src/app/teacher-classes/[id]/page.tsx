"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

export default function TeacherParticularClass() {
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

  const [open, setOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [classCode, setClassCode] = useState<string>("");

  // Fetch class code on mount
  useEffect(() => {
    const fetchClassDetails = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        alert("You are not logged in!");
        router.push("/login");
        return;
      }

      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/classrooms/classrooms/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Class Details:", res.data);
        setClassCode(res.data.code); 
      } catch (error) {
        console.error("Error fetching class details:", error);
        alert("❌ Failed to fetch class details.");
      }
    };

    if (id) fetchClassDetails();
  }, [id, router]);

  const handleCopyCode = () => {
    if (classCode) {
      navigator.clipboard.writeText(classCode);
      alert(`✅ Class code "${classCode}" copied to clipboard!`);
    } else {
      alert("❌ Class code not available.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("access");
      const formData = new FormData();
      formData.append("classroom", id as string);
      formData.append("file", file);

      await axios.post(
        "http://127.0.0.1:8000/api/classrooms/materials/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("✅ PDF uploaded successfully!");
      setFile(null);
      router.push(`/teacher-classes/${id}`);
    } catch (error: any) {
      console.error("Upload error:", error.response?.data || error.message);
      alert("❌ Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "mx-auto flex w-screen flex-1 flex-col rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-black",
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
      <div className="flex flex-col w-full items-center gap-6 p-4 md:p-8 dark:bg-neutral-900 rounded-md ">
        {/* Background Card */}
        <div className="relative w-full h-[400px] overflow-hidden rounded-xl shadow-lg border border-neutral-300 dark:border-neutral-700">
          <BackgroundGradientAnimation />
          <div className="absolute inset-0 z-10 flex items-center justify-center text-white font-bold text-3xl md:text-5xl">
            <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
              Welcome Teacher
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
          {/* Copy Code Button */}
          <button
            onClick={handleCopyCode}
            className="w-full rounded py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transition"
          >
            📋 Copy Class Code
          </button>
        </div>

        {/* Upload Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white dark:bg-neutral-800 shadow rounded-lg p-4 space-y-4 border border-neutral-200 dark:border-neutral-700"
        >
          <h2 className="text-lg font-bold text-center">Upload PDF</h2>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded py-2 text-white font-semibold ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Uploading...
              </div>
            ) : (
              "📤 Upload PDF"
            )}
          </button>
        </form>
      </div>
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
