"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Timeline } from "@/components/ui/timeline";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconClipboardText,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import ChatbotModal from "@/components/ChatbotModal";

type MaterialType = {
  id: number;
  file: string;
  summary: string | null;
  flashcards: string | null;
};

export default function MaterialPage() {
  const params = useParams();
  const router = useRouter();
  const materialId = params?.materialid; // ✅ FIXED param name
  const [showChatbot, setShowChatbot] = useState<boolean>(false);

  const [material, setMaterial] = useState<MaterialType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!materialId) return;

    const fetchMaterial = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `http://127.0.0.1:8000/api/classrooms/materials/${materialId}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );
        setMaterial(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load material.");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [materialId]);

  const formatSummary = (text: string | null) => {
    if (!text) return null;
    return text
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line, idx) => (
        <p key={idx} className="mb-2">
          {line}
        </p>
      ));
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

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">{error ?? "Material not found."}</p>
      </div>
    );
  }

  const timelineData = [
    {
      title: "Summary",
      content: material.summary ? (
        <div className="text-gray-800 dark:text-gray-200 leading-relaxed dark:bg-neutral-800 bg-neutral-100 p-4 rounded-lg">
          {formatSummary(material.summary)}
        </div>
      ) : (
        <p className="text-gray-500 italic">
          Processing... Summary not available yet.
        </p>
      ),
    },
    {
      title: "Flashcards",
      content: material.flashcards ? (
        <div className="grid gap-4">
          {JSON.parse(material.flashcards).map(
            (card: { question: string; answer: string }, index: number) => (
              <div
                key={index}
                className="rounded-lg bg-neutral-100 p-4 dark:bg-neutral-800"
              >
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Q: {card.question}
                </p>
                <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                  A: {card.answer}
                </p>
              </div>
            )
          )}
        </div>
      ) : (
        <p className="text-gray-500 italic">
          Processing... Flashcards not available yet.
        </p>
      ),
    },
    {
      title: "Download & Quiz",
      content: (
        <div className="flex flex-col gap-4">
          <a
            href={material.file}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow items-center justify-center"
          >
            Download PDF
          </a>
          <button
            onClick={() =>
              router.push(
                `/student-classes/${params.id}/material/${materialId}/quiz`
              )
            }
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded shadow"
          >
            Take Quiz
          </button>
        </div>
      ),
    },
  ];

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-950",
        "h-screen"
      )}
    >
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

      {/* Timeline */}
      <main className="flex flex-1 flex-col overflow-y-auto p-6 md:p-10">
        <h1 className="mb-6 text-2xl font-bold text-neutral-800 dark:text-neutral-100">
          Material Details
        </h1>
        <div className="relative w-full overflow-clip">
          <Timeline data={timelineData} />
        </div>
      </main>
      {/* Mindmap Button */}
      <button
        onClick={() =>
          router.push(
            `/student-classes/${params.id}/material/${materialId}/mindmap`
          )
        }
        className="fixed bottom-20 right-6 z-50 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-full shadow-lg"
      >
        View Mindmap
      </button>

      {/* Chatbot Button */}
      <button
        onClick={() => setShowChatbot(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg"
      >
        Ask Chatbot
      </button>

      {/* Chatbot Modal */}
      {showChatbot && <ChatbotModal onClose={() => setShowChatbot(false)} />}
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
