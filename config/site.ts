export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Next.js",
  description:
    "Beautifully designed components built with Radix UI and Tailwind CSS.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    { title: "Demo", href: "/demo" },
  ],
  links: {
    github: "https://github.com/AnishDe12020/ardent-protocol",
  },
}
