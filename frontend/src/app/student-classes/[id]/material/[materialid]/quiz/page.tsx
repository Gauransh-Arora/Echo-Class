"use client";

import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconClipboardText,
} from "@tabler/icons-react";
import { motion } from "motion/react";

type QuestionType = {
  question: string;
  type: "multiple_choice" | "short_answer" | "true_false";
  options: string[];
  answer: string;
};

export default function Quiz() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

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
      href: "/profile-page",
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

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden md:flex-row",
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
                  alt="Avatar"
                />
              ),
            }}
          />
        </SidebarBody>
      </Sidebar>
      <QuizContent />
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
        Side Panel
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => (
  <a
    href="#"
    className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
  >
    <div className="h-5 w-6 shrink-0 rounded bg-black dark:bg-white" />
  </a>
);

// --- Main Quiz Content ---
const QuizContent = () => {
  const params = useParams();
  const materialId = params?.materialid;
  const router = useRouter();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!materialId) return;

    const fetchQuiz = async () => {
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
        const quizData = JSON.parse(res.data.quiz);
        setQuestions(quizData);
      } catch (err) {
        console.error(err);
        setError("Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [materialId]);

  const handleChange = (index: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const handleSubmit = () => {
    console.log("Submitted Answers:", answers);
    alert("Quiz submitted!");
    router.push("/student-classes"); // Redirect after submission
  };

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-lg">Loading quiz...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:p-10 overflow-y-auto bg-white dark:bg-neutral-900">
      <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
        Quiz
      </h1>
      {questions.map((q, idx) => (
        <div
          key={idx}
          className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700"
        >
          <p className="mb-2 font-medium text-neutral-900 dark:text-white">
            {q.question}
          </p>

          {q.type === "multiple_choice" && (
            <div className="flex flex-col gap-2">
              {q.options.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300"
                >
                  <input
                    type="radio"
                    name={`question-${idx}`}
                    value={opt}
                    checked={answers[idx] === opt}
                    onChange={() => handleChange(idx, opt)}
                    className="accent-black dark:accent-white"
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}

          {q.type === "true_false" && (
            <div className="flex flex-col gap-2">
              {["True", "False"].map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300"
                >
                  <input
                    type="radio"
                    name={`question-${idx}`}
                    value={opt}
                    checked={answers[idx] === opt}
                    onChange={() => handleChange(idx, opt)}
                    className="accent-black dark:accent-white"
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}

          {q.type === "short_answer" && (
            <input
              type="text"
              value={answers[idx] || ""}
              onChange={(e) => handleChange(idx, e.target.value)}
              className="mt-2 w-full rounded border border-neutral-300 px-3 py-2 text-neutral-800 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
              placeholder="Your answer..."
            />
          )}
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="mt-4 self-start rounded-md bg-black px-4 py-2 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
      >
        Submit Quiz
      </button>
    </main>
  );
};
