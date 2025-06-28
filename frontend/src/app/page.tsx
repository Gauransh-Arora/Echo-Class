"use client";
 
import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { h1 } from "motion/react-client";
import LoginPage from "./login/page";

export default function Home() {
  return (
    LoginPage()
  );
}
