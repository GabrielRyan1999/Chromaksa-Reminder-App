import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Reminder App",
  description: "Log in or sign up to your Reminder App account.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
