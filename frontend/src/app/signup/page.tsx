"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js router
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { Vortex } from "@/components/ui/vortex";

export default function SignupPage() {
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/users/register/", {
        name: formData.name,
        username: formData.username,
        password: formData.password,
        role: role,
      });
      alert("Registration successful");
      router.push("/login");
    } catch (err: any) {
      alert("Registration failed");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="w-[calc(100%-4rem)] mx-auto rounded-md  h-screen overflow-hidden">
      <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={500}
        baseHue={120}
        className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"
      >
        <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
            Welcome to EchoClass
          </h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
            Create your EchoClass account if you want to use the app.
          </p>

          <div className="my-4 flex space-x-2">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={cn(
                "w-full rounded-md border p-2 text-sm font-medium",
                role === "student"
                  ? "bg-gradient-to-b from-green-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]"
                  : "bg-gray-100 text-black dark:bg-zinc-800 dark:text-neutral-300"
              )}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={cn(
                "w-full rounded-md border p-2 text-sm font-medium",
                role === "teacher"
                  ? "bg-gradient-to-b from-green-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]"
                  : "bg-gray-100 text-black dark:bg-zinc-800 dark:text-neutral-300"
              )}
            >
              Teacher
            </button>
          </div>

          <form className="my-8" onSubmit={handleSubmit}>
            <LabelInputContainer>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Tyler"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </LabelInputContainer>

            <LabelInputContainer className="mt-4">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="tylerthecreator"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </LabelInputContainer>

            <LabelInputContainer className="mt-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </LabelInputContainer>

            <button
              className="group/btn relative mt-6 block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
              type="submit"
            >
              Sign up &rarr;
              <BottomGradient />
            </button>

            <div className="mt-4 text-center text-sm text-neutral-600 dark:text-neutral-300">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Login
              </a>
            </div>
          </form>
        </div>
      </Vortex>
    </div>
  );
}

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);
