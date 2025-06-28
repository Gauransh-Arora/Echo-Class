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

type Material = {
  id: number;
  file: string;
  uploaded_at: string;
};

export default function StudentParticularClass() {
  const router = useRouter();
  const params = useParams();
  const classId = params?.id;

  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!classId) return;

    const fetchMaterials = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `http://127.0.0.1:8000/api/classrooms/materials/?classroom=${classId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );
        setMaterials(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load materials.");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [classId]);

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
      href: "#",
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

  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col md:flex-row",
        "h-screen",
        "bg-gray-100 dark:bg-neutral-900"
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
              label: "Student Name",
              href: "#",
              icon: (
                <img
                  src="https://assets.aceternity.com/manu.png"
                  className="h-7 w-7 shrink-0 rounded-full"
                  alt="Avatar"
                />
              ),
            }}
          />
        </SidebarBody>
      </Sidebar>

      <main className="flex flex-1 flex-col gap-6 p-6 md:p-10 overflow-y-auto">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
          Class Materials
        </h1>
        {loading ? (
          <p className="text-neutral-500">Loading materials...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : materials.length === 0 ? (
          <p className="text-neutral-500">No materials uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {materials.map((material) => (
              <MaterialCard
                key={material.id}
                classId={classId}
                material={material}
                router={router}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const MaterialCard = ({
  classId,
  material,
  router,
}: {
  classId: string | string[] | undefined;
  material: Material;
  router: ReturnType<typeof useRouter>;
}) => (
  <figure
    onClick={() =>
      router.push(`/student-classes/${classId}/material/${material.id}`)
    }
    className={cn(
      "relative mx-auto w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
      "transition-all duration-200 ease-in-out hover:scale-[103%]",
      "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      "transform-gpu dark:bg-neutral-900 dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
    )}
  >
    <div className="flex flex-row items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-2xl bg-neutral-700">
        <span className="text-white text-lg">📄</span>
      </div>
      <div className="flex flex-col overflow-hidden">
        <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
          <span className="text-sm sm:text-lg truncate">{material.file}</span>
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
