"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
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
import { cn } from "@/lib/utils";

export default function Material() {
  const params = useParams();
  const { materialId } = params;

  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Dashboard",
      href: "/student-dashboard",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Classes",
      href: "/student-classes",
      icon: <IconClipboardText className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Profile",
      href: "#",
      icon: <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Settings",
      href: "#",
      icon: <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Logout",
      href: "#",
      icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
  ];

  // 📝 Dummy summary text
  const summaryText =
    "This material covers the basics of Artificial Intelligence including definitions, history, and applications across various industries. It is designed to provide a foundational understanding of AI concepts and their relevance in today's technology landscape. It includes key terms, significant milestones in AI development, and examples of AI applications in real-world scenarios. The material is suitable for beginners and serves as an introduction to more advanced AI topics. It also includes flashcards for quick review and a quiz to test understanding of the material. The flashcards cover essential questions about AI, such as its definition, applications, and historical context. The quiz is designed to reinforce learning and assess comprehension of the material. This material is ideal for students looking to grasp the fundamentals of AI and its impact on various fields. It is structured to facilitate easy learning and retention of key AI concepts. It is a valuable resource for anyone interested in understanding the basics of AI and its significance in modern technology. ";

  // 🧠 Dummy flashcards
  const flashcards = [
    { question: "What is AI?", answer: "AI is the simulation of human intelligence in machines." },
    { question: "Name one application of AI.", answer: "Self-driving cars." },
    { question: "When did AI research begin?", answer: "In the 1950s." },
    { question: "What is machine learning?", answer: "A subset of AI that enables systems to learn from data." },
    { question: "What is natural language processing?", answer: "A field of AI that focuses on the interaction between computers and human language." },
    { question: "What is deep learning?", answer: "A type of machine learning that uses neural networks with many layers." },
    { question: "What is reinforcement learning?", answer: "A type of machine learning where an agent learns by interacting with its environment." },
    { question: "What is computer vision?", answer: "A field of AI that enables machines to interpret and understand visual information." },
    { question: "What is the Turing Test?", answer: "A test to determine if a machine can exhibit intelligent behavior equivalent to, or indistinguishable from, that of a human." },
    { question: "What is a neural network?", answer: "A computational model inspired by the way biological neural networks in the human brain process information." },
    { question: "What is the difference between AI and machine learning?", answer: "AI is a broader concept that encompasses machine learning, which is a specific approach to achieving AI." },
    { question: "What is supervised learning?", answer: "A type of machine learning where the model is trained on labeled data." },
    { question: "What is unsupervised learning?", answer: "A type of machine learning where the model learns from unlabeled data." },
    { question: "What is a chatbot?", answer: "An AI application that simulates human conversation through text or voice interactions." },
    { question: "What is the role of data in AI?", answer: "Data is essential for training AI models and improving their accuracy." },
    { question: "What are some ethical concerns related to AI?", answer: "Bias in algorithms, privacy issues, and job displacement." },
  ];

  const timelineData = [
    {
      title: "Summary",
      content: (
        <div>
          <p className="mb-4 text-sm text-neutral-800 dark:text-neutral-200">{summaryText}</p>
        </div>
      ),
    },
    {
      title: "Flashcards",
      content: (
        <div className="grid gap-4">
          {flashcards.map((card, index) => (
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
          ))}
        </div>
      ),
    },
    {
      title: "Quiz",
      content: (
        <button
          onClick={() => alert("Quiz will start soon!")}
          className="mt-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Start Quiz
        </button>
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
              label: "Manu Arora",
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

      {/* Timeline Content */}
      <main className="flex flex-1 flex-col overflow-y-auto p-6 md:p-10">
        <h1 className="mb-6 text-2xl font-bold text-neutral-800 dark:text-neutral-100">
          Material Details
        </h1>
        <div className="relative w-full overflow-clip">
          <Timeline data={timelineData} />
        </div>
      </main>
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
