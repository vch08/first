import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "@mantine/core/styles.css";
// import { MantineProvider } from "@mantine/core";

export const metadata: Metadata = {
  title: {
    template: "%s | Blogic",
    default: "Blogic",
  },
};

interface Props {
  children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  return children;
}
