"use client"
import { Chatbot } from "@/components/chatbot";
import { usePathname } from "next/navigation";

export function ChatbotWidget() {
  const pathname = usePathname();
  if (pathname.startsWith("/login")) return null;
  return <Chatbot />;
}
