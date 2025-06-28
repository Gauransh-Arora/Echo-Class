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

export default function Quiz() {
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
  const [open, setOpen] = useState(false);
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
      <QuizContent />
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

// This is the actual quiz content
const QuizContent = () => {
  const questions = [
    {
      id: 1,
      text: "What is Artificial Intelligence?",
      options: [
        "A programming language",
        "A field of computer science",
        "A hardware device",
        "A type of network",
      ],
    },
    {
      id: 2,
      text: "Which algorithm is used in supervised learning?",
      options: [
        "K-Means Clustering",
        "Linear Regression",
        "Apriori Algorithm",
        "PCA",
      ],
    },
    {
      id: 3,
      text: "Which of the following is an application of NLP?",
      options: [
        "Image Recognition",
        "Speech Recognition",
        "Game Development",
        "Circuit Design",
      ],
    },
  ];

  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const handleOptionChange = (qid: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: option }));
  };
  const handleSubmit = () => {
    console.log("Submitted Answers:", answers);
    alert("Quiz submitted!");
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:p-10 overflow-y-auto bg-white dark:bg-neutral-900">
      <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
        Quiz
      </h1>
      {questions.map((q) => (
        <div
          key={q.id}
          className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700"
        >
          <p className="mb-2 font-medium text-neutral-900 dark:text-white">
            {q.text}
          </p>
          <div className="flex flex-col gap-2">
            {q.options.map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300"
              >
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={() => handleOptionChange(q.id, opt)}
                  className="accent-black dark:accent-white"
                />
                {opt}
              </label>
            ))}
          </div>
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
