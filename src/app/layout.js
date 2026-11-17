import "@fontsource-variable/bricolage-grotesque/standard.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "./globals.css";

export const metadata = {
  title: "Pragadeeshvaran S — Full stack & AI engineer",
  description:
    "Full stack and AI engineer in Chennai. LangGraph agents, MCP servers and Java/Python microservices at Workday.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
