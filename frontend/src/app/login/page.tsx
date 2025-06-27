"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Vortex } from "@/components/ui/vortex";

export default function LoginPage() {
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [formData, setFormData] = useState({ username: "", password: "" });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/users/login/", {
        username: formData.username,
        password: formData.password,
      });

      const accessToken = res.data.access;
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      const meRes = await axios.get("http://127.0.0.1:8000/api/users/me/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userRole = meRes.data.role;
      alert(`Logged in as ${userRole}`);

      if (userRole === "teacher") {
        router.push("/teacher-dashboard");
      } else {
        router.push("/student-dashboard");
      }
    } catch (err: any) {
      alert("Login failed");
      console.error("Error response:", err.response?.data || err.message);
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
      >      <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          Welcome to EchoClass
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
          Login to EchoClass if you can because we don&apos;t have a login flow yet
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
          <LabelInputContainer className="mb-4">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="Tyler"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </LabelInputContainer>

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit"
          >
            Login &rarr;
            <BottomGradient />
          </button>

          <div className="mt-4 text-center text-sm text-neutral-600 dark:text-neutral-300">
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Sign up
            </a>
          </div>

          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

          <div className="flex flex-col space-y-4">
            <button
              className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
              type="button"
              onClick={() => alert("GitHub login not implemented")}
            >
              <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">GitHub</span>
              <BottomGradient />
            </button>
            <button
              className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
              type="button"
              onClick={() => alert("Google login not implemented")}
            >
              <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">Google</span>
              <BottomGradient />
            </button>
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
  <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
);
