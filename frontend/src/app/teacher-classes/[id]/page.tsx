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

type Material = {
  id: number;
  title: string;
  uploaded_at: string;
};

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
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [classCode, setClassCode] = useState<string>("");
  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

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
        setClassCode(res.data.code);
      } catch (error) {
        console.error("Error fetching class details:", error);
        alert("❌ Failed to fetch class details.");
      }
    };

    const fetchMaterials = async () => {
      if (!id) return;
      try {
        setMaterialsLoading(true);
        const token = localStorage.getItem("access");
        const res = await axios.get(
          `http://127.0.0.1:8000/api/classrooms/materials/?classroom=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMaterials(res.data);
      } catch (error) {
        console.error("Error fetching materials:", error);
        alert("❌ Failed to fetch class materials.");
      } finally {
        setMaterialsLoading(false);
      }
    };

    if (id) {
      fetchClassDetails();
      fetchMaterials();
    }
  }, [id, router]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) return;
        const res = await axios.get("http://127.0.0.1:8000/api/users/me/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsername(res.data.username);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUser();
  }, []);

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
    if (!title.trim()) {
      alert("Please enter a title for the PDF.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("access");
      const formData = new FormData();
      formData.append("classroom", id as string);
      formData.append("file", file);
      formData.append("title", title.trim());

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
      setTitle("");
      router.refresh(); // Refresh page to re-fetch materials
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
              label: username ?? "Loading...",
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
      <div className="flex flex-col w-full items-center gap-6 p-4 md:p-8 dark:bg-neutral-900 rounded-md overflow-y-auto">
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
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter PDF title"
            className="w-full border p-2 rounded"
            required
          />
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

        {/* Materials Grid */}
        <div className="w-full mt-6">
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
            Uploaded Materials
          </h2>
          {materialsLoading ? (
            <p className="text-neutral-500">Loading materials...</p>
          ) : materials.length === 0 ? (
            <p className="text-neutral-500">No materials uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {materials.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const MaterialCard = ({ material }: { material: Material }) => (
  <figure
    className={cn(
      "relative mx-auto w-full max-w-[400px] overflow-hidden rounded-2xl p-4",
      "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      "dark:bg-neutral-900 dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
    )}
  >
    <div className="flex flex-row items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-2xl bg-neutral-700">
        <span className="text-white text-lg">📄</span>
      </div>
      <div className="flex flex-col overflow-hidden">
        <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
          <span className="text-sm sm:text-lg truncate">{material.title}</span>
        </figcaption>
        <p className="text-sm font-normal text-gray-500 dark:text-white/60">
          Uploaded on {new Date(material.uploaded_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  </figure>
);

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
      Side Panel
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
