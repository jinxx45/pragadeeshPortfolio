import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata = {
  title: "Pragadeeshvaran S — Full stack & AI engineer",
  description:
    "Full stack and AI engineer in Chennai. LangGraph agents, MCP servers and Java/Python microservices at Workday.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body>{children}</body>
    </html>
  );
}
