'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Icon } from '@iconify/react'
import "@/lib/icons";
import Link from "next/link";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  ArrowRight,
  ExternalLink,
  Download,
  Sun,
  Moon,
  Code2,
  Briefcase,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Theme = "light" | "dark";

type ThemeCtx = { theme: Theme; setTheme: (t: Theme) => void };
const ThemeContext = createContext<ThemeCtx | null>(null);

function LocalThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    try {
      const stored = (localStorage.getItem("theme") as Theme | null) ?? null;
      const systemDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
      setThemeState(stored === "light" || stored === "dark" ? stored : systemDark ? "dark" : "light");
    } catch {}
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try { localStorage.setItem("theme", theme); } catch {}
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useLocalTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useLocalTheme must be used within LocalThemeProvider");
  return ctx;
}

function ModeToggle() {
  const { theme, setTheme } = useLocalTheme();
  const isDark = useMemo(() => theme === "dark", [theme]);
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="gap-2"
      aria-label="Toggle theme"
      data-testid="mode-toggle"
    >
      <Sun className="h-4 w-4 hidden dark:block" />
      <Moon className="h-4 w-4 block dark:hidden" />
      <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
    </Button>
  );
}

const ease = [0.22, 1, 0.36, 1] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

function Section(
  {
    id,
    className,
    children,
    focusKey,
  }: { id: string; className?: string; children: React.ReactNode; focusKey: string }
) {
  const controls = useAnimation();

  useEffect(() => {
    if (focusKey === id) {
      (async () => {
        await controls.start({ scale: [1, 1.02, 1], transition: { duration: 0.6, ease } });
      })();
    }
  }, [focusKey, id, controls]);

  return (
    <motion.section
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={fadeIn}
      data-anim="section"
    >
      <motion.div variants={stagger} animate={controls}>
        {children}
      </motion.div>
    </motion.section>
  );
}

const nav = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

const socials = [
  { href: "https://github.com/turbomerr", icon: Github, label: "GitHub" },
  { href: "https://www.linkedin.com/in/%C3%B6mer-g%C3%B6kbakar-1043a7235/", icon: Linkedin, label: "LinkedIn" },
] as const;

const experiences = [
  {
    role: "Full-Stack Developer",
    company: "Acme Co.",
    period: "2023 — Present",
    desc:
      "Building scalable web apps with Next.js, TypeScript and serverless. Led performance optimizations (TTFB ↓38%).",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "AWS"],
  },
  {
    role: "Backend Developer",
    company: "Startup XYZ",
    period: "2021 — 2023",
    desc:
      "Designed REST/GraphQL APIs, improved CI/CD and observability, reduced error rate by 25% via robust input validation.",
    tech: ["Node.js", "Express", "MongoDB", "Docker"],
  },
] as const;

const projects = [
  {
    title: "Admin Dashboard",
    description: "The Admin Dashboard is a modern, responsive, and feature-rich web application designed for efficient management and visualization of data. Built with React, Tailwind CSS, and Recharts, this project provides a seamless user experience with an intuitive and sleek design.",
    tags: ["React", "Recharts", "Tailwind"],
    links: [
      { href: "https://github.com/turbomerr/admin-dashboard", label: "Code" },
    ],
  },
  {
    title: "PostgreSQL Store",
    description:
      "A simple store app showcasing CRUD operations on PostgreSQL, built with Node.js/Express and Prisma, and deployed on Render. The goal is to practice relational schema design, migrations, and production deployment.",
    tags: ["Node.js", "Express", "PostgreSQL", "NeonDB", "React", "Tailwind", "Vercel"],
    links: [
      { href: "https://posgresql-store.onrender.com/", label: "Demo" },
      { href: "https://github.com/turbomerr/pern-store", label: "Code" },
    ],
  },
  {
    title: "Product Store",
    description:
      "MERN product management app with product CRUD. React + Chakra UI on the frontend, Node.js/Express API with MongoDB on the backend",
    tags: ["React", "ChakraUI", "Node.js", "Express", "MongoDB"],
    links: [{ href: "https://github.com/turbomerr/StoreProduct", label: "Code" }],
  },
] as const;

const skills = [
  { name: "TypeScript", icon: "simple-icons:typescript" },
  { name: "JavaScript", icon: "simple-icons:javascript" },
  { name: "Tailwind", icon: "simple-icons:tailwindcss" },
  { name: "Next.js", icon: "simple-icons:nextdotjs" },
  { name: "React", icon: "simple-icons:react" },
  { name: "Node.js", icon: "simple-icons:nodedotjs" },
  { name: "Express", icon: "simple-icons:express" },
  { name: "MongoDB", icon: "simple-icons:mongodb" },
  { name: "PostgreSQL", icon: "simple-icons:postgresql" },
  { name: "Prisma", icon: "simple-icons:prisma" },
  { name: "Docker", icon: "simple-icons:docker" },
  { name: "Git", icon: "simple-icons:git" },
] as const;

function DevChecks() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const ids = ["home", "about", "experience", "projects", "skills", "contact"];
    ids.forEach((id) => {
      console.assert(!!document.getElementById(id), `❌ Missing section #${id}`);
    });

    console.assert(
      document.querySelectorAll('section[data-anim="section"]').length >= ids.length,
      "❌ Motion not attached to all sections"
    );

    console.assert(
      !!document.querySelector('[data-testid="nav-contact"]'),
      "❌ Contact nav button missing"
    );

    const root = document.documentElement;
    const before = root.classList.contains("dark");
    root.classList.toggle("dark");
    console.assert(root.classList.contains("dark") !== before, "❌ Theme did not toggle");
    root.classList.toggle("dark");
    console.assert(root.classList.contains("dark") === before, "❌ Theme did not revert");

    console.log("✅ Dev checks passed");
  }, []);
  return null;
}

export default function Page() {
  const [focusKey, setFocusKey] = useState<string>("");
  const [sheetOpen, setSheetOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", `#${id}`);
    setFocusKey(id);
  };

  return (
    <LocalThemeProvider>
      <DevChecks />
      <AnimatePresence>
        <motion.div
          key="page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease }}
          className="min-h-screen bg-background text-foreground"
        >
          <header className="fixed left-0 top-0 z-50 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <button
                onClick={() => scrollTo("home")}
                className="flex items-center gap-2 font-semibold"
                aria-label="Go to home"
              >
                <Code2 className="h-5 w-5" />
                <span>Turbomerr.dev</span>
              </button>

              <div className="hidden md:block">
                <NavigationMenu>
                  <NavigationMenuList>
                    {nav.map((n) => (
                      <NavigationMenuItem key={n.id}>
                        <NavigationMenuLink asChild>
                          <button className="px-3 py-2 text-sm" onClick={() => scrollTo(n.id)}>
                            {n.label}
                          </button>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>

              <div className="flex items-center gap-2">
                <ModeToggle />
                <Button size="sm" onClick={() => scrollTo("contact")} data-testid="nav-contact">
                  Contact <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
                      <span aria-hidden>≡</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-64">
                    <nav className="mt-6 grid gap-1">
                      {nav.map((n) => (
                        <SheetClose asChild key={n.id}>
                          <Button
                            variant="ghost"
                            className="justify-start"
                            onClick={() => scrollTo(n.id)}
                          >
                            {n.label}
                          </Button>
                        </SheetClose>
                      ))}
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-6xl px-4 pt-28 md:pt-32">
            <Section id="home" focusKey={focusKey} className="py-16 md:py-24">
              <div className="grid items-center gap-10 md:grid-cols-5">
                <motion.div className="md:col-span-3" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }}>
                  <motion.h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl" variants={fadeInUp}>
                    Hey, I’m <span className="text-primary">Omer Gokbakar</span> —
                    <br className="hidden md:block" /> building modern web experiences
                  </motion.h1>
                  <motion.p className="mt-4 max-w-prose text-muted-foreground" variants={fadeInUp}>
                    I craft clear, accessible interfaces and a solid back end. I build scalable, dependable APIs with secure authentication and well-structured data, turning real problems into fast, delightful products.
                  </motion.p>
                  <motion.div className="mt-6 flex flex-wrap items-center gap-3" variants={fadeInUp}>
                    <Button onClick={() => scrollTo("projects")}>
                      View Projects <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="/OmerGokbakarCV.pdf" download="OmerGokbakarCV.pdf">
                        Download CV <Download className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                    <div className="ml-1 flex items-center gap-2">
                      {socials.map((s) => (
                        <Button key={s.label} variant="outline" size="icon" aria-label={s.label} data-testid={`social-${s.label.toLowerCase()}`} asChild>
                          <Link href={s.href} target="_blank" rel="noreferrer">
                            <s.icon className="h-5 w-5" />
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>

                {/* <motion.div className="md:col-span-2" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }}>
                  <Card className="mx-auto h-60 w-60 overflow-hidden">
                    <CardContent className="p-0">
                      <Avatar className="h-60 w-60 rounded-none">
                        <AvatarImage src="/omer-foto.JPG" alt="Portrait" />
                        <AvatarFallback>YN</AvatarFallback>
                      </Avatar>
                    </CardContent>
                  </Card>
                </motion.div> */}
              </div>
            </Section>

            <Separator />

            <Section id="about" focusKey={focusKey} className="py-16">
              <div className="grid gap-8 md:grid-cols-3">
                <motion.div className="md:col-span-1" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }}>
                  <h2 className="flex items-center gap-2 text-2xl font-semibold">
                    <Sparkles className="h-6 w-6" /> About
                  </h2>
                </motion.div>
                <motion.div className="md:col-span-2 max-w-prose leading-relaxed space-y-4 text-muted-foreground" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }}>
                  <motion.p variants={fadeInUp}>
                    From interface to database, I build the whole path: usable UIs, secure endpoints, and data that tells the truth. I optimize for clarity, performance, and long-term maintainability.
                  </motion.p>
                  <motion.p variants={fadeInUp}>
                    From interface to database, I own the path: usable UIs, secure endpoints, and honest data models. Curious self-learner who digs deep and keeps improving.
                  </motion.p>
                </motion.div>
              </div>
            </Section>

            <Separator />

            <Section id="experience" focusKey={focusKey} className="py-16">
              <div className="mb-8 flex items-center gap-2">
                <Briefcase className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Experience</h2>
              </div>
              <div className="grid gap-6">
                {experiences.map((e) => (
                  <motion.div key={e.role} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">{e.role} · {e.company}</CardTitle>
                        <CardDescription>{e.period}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{e.desc}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {e.tech.map((t) => (
                            <Badge key={t} variant="secondary">{t}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Section>

            <Separator />

            <Section id="projects" focusKey={focusKey} className="py-16">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Projects</h2>
                <Button asChild variant="link" className="px-0">
                  <Link href="https://github.com/turbomerr">View all on GitHub</Link>
                </Button>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {projects.map((p) => (
                  <motion.div key={p.title} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }}>
                    <Card className="group">
                      <CardHeader>
                        <CardTitle className="text-lg leading-snug">{p.title}</CardTitle>
                        <CardDescription>{p.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4 flex flex-wrap gap-2">
                          {p.tags.map((t) => (
                            <Badge key={t} variant="outline" className="text-primary">{t}</Badge>
                          ))}
                        </div>
                        <div className="flex gap-3">
                          {p.links.map((l) => (
                            <Button key={l.href} asChild variant="outline" size="sm">
                              <Link href={l.href} target="_blank" rel="noreferrer">
                                {l.label} <ExternalLink className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Section>

            <Separator />

            <Section id="skills" focusKey={focusKey} className="py-16">
              <h2 className="mb-6 text-2xl font-semibold">Skills</h2>
              <motion.ul
                className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
              >
                {skills.map(({ name, icon }) => (
                  <motion.li
                    key={name}
                    variants={fadeInUp}
                    className="flex items-center gap-2 rounded-xl border px-3 py-2 bg-background/80"
                    whileHover={{ y: -2 }}
                  >
                    <Icon icon={icon} className="h-5 w-5 text-primary" aria-hidden />
                    <span className="text-sm">{name}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </Section>

            <Separator />

            <Section id="contact" focusKey={focusKey} className="py-16">
              <h2 className="mb-6 text-2xl font-semibold">Contact</h2>
              <div className="grid gap-8 md:grid-cols-2">
                <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Send a message</CardTitle>
                      <CardDescription>I usually reply within 24 hours.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium">Name</label>
                        <Input placeholder="Your name" required />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">Email</label>
                        <Input type="email" placeholder="you@example.com" required />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">Message</label>
                        <Textarea placeholder="How can I help?" className="min-h-[120px]" />
                      </div>
                      <Button>
                        Send <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Find me online</CardTitle>
                      <CardDescription>Prefer email or socials?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      <p>
                        Email:{" "}
                        <Link
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                            "turbofullstack.dev10@gmail.com"
                          )}&su=${encodeURIComponent("Hello from your portfolio")}&body=${encodeURIComponent(
                            "Hi Ömer,\n\nI saw your portfolio and..."
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium underline underline-offset-4"
                        >
                          turbofullstack.dev10@gmail.com
                        </Link>
                      </p>
                      <div className="flex gap-2">
                        {socials.map((s) => (
                          <Button key={s.label} asChild variant="outline">
                            <Link href={s.href} target="_blank" rel="noreferrer">
                              <s.icon className="mr-2 h-4 w-4" /> {s.label}
                            </Link>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </Section>
          </main>

          <footer className="border-t py-10 text-sm">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 md:flex-row">
              <p>© {new Date().getFullYear()} Your Name. All rights reserved.</p>
              <Button variant="outline" size="sm" onClick={() => scrollTo("home")}>Back to top</Button>
            </div>
          </footer>
        </motion.div>
      </AnimatePresence>
    </LocalThemeProvider>
  );
}
