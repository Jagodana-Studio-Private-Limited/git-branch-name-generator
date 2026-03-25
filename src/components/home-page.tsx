"use client";

import { useCallback, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  Sparkles,
  Copy,
  Check,
  GitBranch,
  Trash2,
  Clock,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimatedGradientText } from "@/components/animated-gradient-text";
import { FAQSection } from "@/components/faq-section";
import { RelatedTools } from "@/components/related-tools";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SocialShare } from "@/components/social-share";
import { GitHubStar } from "@/components/github-star";
import { siteConfig } from "@/config/site";
import { toast } from "sonner";

// ─────────────────────────────────────────────
// Branch generator logic (client-side only)
// ─────────────────────────────────────────────

const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been",
  "for", "to", "in", "on", "at", "by", "of", "and", "or", "but",
  "with", "from", "as", "into", "that", "this", "it", "its",
  "not", "no", "so", "if", "then", "when", "where", "which",
]);

const BRANCH_TYPES = [
  { value: "feature", label: "feature/" },
  { value: "bugfix", label: "bugfix/" },
  { value: "hotfix", label: "hotfix/" },
  { value: "chore", label: "chore/" },
  { value: "release", label: "release/" },
  { value: "docs", label: "docs/" },
  { value: "test", label: "test/" },
  { value: "custom", label: "custom" },
] as const;

type BranchType = (typeof BRANCH_TYPES)[number]["value"];

interface HistoryEntry {
  branchName: string;
  timestamp: number;
}

function generateBranchName(opts: {
  title: string;
  branchType: BranchType;
  customPrefix: string;
  ticketNumber: string;
  separator: "-" | "_";
  maxLength: number;
  removeStopWords: boolean;
}): string {
  const { title, branchType, customPrefix, ticketNumber, separator, maxLength, removeStopWords } = opts;

  if (!title.trim()) return "";

  // Lowercase and split into words, stripping non-alphanumeric chars
  let words = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  // Optionally remove stop words
  if (removeStopWords) {
    const filtered = words.filter((w) => !STOP_WORDS.has(w));
    // Only use filtered if we still have words left
    if (filtered.length > 0) words = filtered;
  }

  // Build the slug part (no prefix yet)
  let slug = words.join(separator);

  // Build prefix
  let prefix = branchType === "custom" ? customPrefix.trim() : branchType;
  if (prefix && !prefix.endsWith("/")) prefix += "/";

  // Insert ticket number after prefix
  let ticketPart = "";
  if (ticketNumber.trim()) {
    ticketPart = ticketNumber.trim().toUpperCase() + separator;
  }

  const prefixFull = prefix + ticketPart;
  const budget = maxLength - prefixFull.length;

  // Trim slug to max length at word boundary
  if (budget > 0 && slug.length > budget) {
    const trimmed = slug.slice(0, budget);
    const lastSep = trimmed.lastIndexOf(separator);
    slug = lastSep > 0 ? trimmed.slice(0, lastSep) : trimmed;
  } else if (budget <= 0) {
    slug = "";
  }

  // Remove leading/trailing separators
  slug = slug.replace(new RegExp(`^${separator}+|${separator}+$`, "g"), "");

  return prefixFull + slug;
}

// ─────────────────────────────────────────────
// BranchNameGenerator component
// ─────────────────────────────────────────────

function BranchNameGenerator() {
  const [title, setTitle] = useState("");
  const [branchType, setBranchType] = useState<BranchType>("feature");
  const [customPrefix, setCustomPrefix] = useState("refactor");
  const [ticketNumber, setTicketNumber] = useState("");
  const [separator, setSeparator] = useState<"-" | "_">("-");
  const [maxLength, setMaxLength] = useState(50);
  const [removeStopWords, setRemoveStopWords] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("branch-name-history");
      if (saved) setHistory(JSON.parse(saved) as HistoryEntry[]);
    } catch {
      // ignore
    }
  }, []);

  const branchName = generateBranchName({
    title,
    branchType,
    customPrefix,
    ticketNumber,
    separator,
    maxLength,
    removeStopWords,
  });

  const gitCommand = branchName ? `git checkout -b ${branchName}` : "";

  const saveToHistory = useCallback(
    (name: string) => {
      if (!name) return;
      const entry: HistoryEntry = { branchName: name, timestamp: Date.now() };
      const updated = [
        entry,
        ...history.filter((h) => h.branchName !== name),
      ].slice(0, 10);
      setHistory(updated);
      try {
        localStorage.setItem("branch-name-history", JSON.stringify(updated));
      } catch {
        // ignore
      }
    },
    [history]
  );

  const copyBranchName = useCallback(() => {
    if (!branchName) return;
    navigator.clipboard.writeText(branchName).then(() => {
      setCopied(true);
      saveToHistory(branchName);
      toast.success("Branch name copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  }, [branchName, saveToHistory]);

  const copyGitCommand = useCallback(() => {
    if (!gitCommand) return;
    navigator.clipboard.writeText(gitCommand).then(() => {
      setCopiedCmd(true);
      saveToHistory(branchName);
      toast.success("Git command copied!");
      setTimeout(() => setCopiedCmd(false), 2000);
    });
  }, [gitCommand, branchName, saveToHistory]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem("branch-name-history");
    } catch {
      // ignore
    }
    toast.success("History cleared");
  }, []);

  const useHistoryEntry = useCallback(
    (entry: HistoryEntry) => {
      navigator.clipboard.writeText(entry.branchName).then(() => {
        toast.success("Branch name copied from history!");
      });
    },
    []
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Input Card */}
      <Card className="border-border/50 bg-muted/20">
        <CardContent className="p-6 space-y-5">
          {/* Issue title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Issue Title / Task Description
            </label>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fix login button not working on mobile devices"
              rows={3}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 resize-none"
            />
          </div>

          {/* Row: branch type + ticket */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Branch Type</label>
              <select
                value={branchType}
                onChange={(e) => setBranchType(e.target.value as BranchType)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
              >
                {BRANCH_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              {branchType === "custom" ? (
                <>
                  <label className="text-sm font-medium">Custom Prefix</label>
                  <Input
                    value={customPrefix}
                    onChange={(e) => setCustomPrefix(e.target.value)}
                    placeholder="e.g. refactor"
                    className="focus-visible:ring-brand/50"
                  />
                </>
              ) : (
                <>
                  <label className="text-sm font-medium">
                    Ticket Number{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </label>
                  <Input
                    value={ticketNumber}
                    onChange={(e) => setTicketNumber(e.target.value)}
                    placeholder="e.g. JIRA-123 or GH-45"
                    className="focus-visible:ring-brand/50"
                  />
                </>
              )}
            </div>
          </div>

          {/* Separator & max length */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Separator</label>
              <div className="flex gap-2">
                {(
                  [
                    { value: "-", label: "Hyphen (-)" },
                    { value: "_", label: "Underscore (_)" },
                  ] as const
                ).map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSeparator(s.value)}
                    className={`flex-1 px-3 py-2 rounded-lg border text-sm transition-colors ${
                      separator === s.value
                        ? "border-brand bg-brand/10 text-brand font-medium"
                        : "border-input bg-background text-muted-foreground hover:border-brand/50"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex justify-between">
                <span>Max Length</span>
                <span className="text-brand font-semibold">{maxLength}</span>
              </label>
              <input
                type="range"
                min={30}
                max={100}
                value={maxLength}
                onChange={(e) => setMaxLength(Number(e.target.value))}
                className="w-full accent-[#f97316]"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>30</span>
                <span>100</span>
              </div>
            </div>
          </div>

          {/* Stop words toggle */}
          <div className="flex items-center gap-3">
            <button
              role="switch"
              aria-checked={removeStopWords}
              onClick={() => setRemoveStopWords((v) => !v)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 ${
                removeStopWords ? "bg-brand" : "bg-input"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  removeStopWords ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
            <label className="text-sm">
              Remove stop words{" "}
              <span className="text-muted-foreground">
                (the, a, an, is, for…)
              </span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Output Card */}
      <motion.div
        key={branchName}
        initial={{ opacity: 0.8, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
      >
        <Card className="border-brand/30 bg-brand/5">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <GitBranch className="h-4 w-4 text-brand" />
              <span className="text-sm font-medium text-brand">
                Generated Branch Name
              </span>
            </div>

            {branchName ? (
              <>
                {/* Branch name output */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-lg border border-brand/20 bg-background px-4 py-3 font-mono text-sm break-all">
                    {branchName}
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={copyBranchName}
                    className="shrink-0 border-brand/30 hover:bg-brand/10 hover:text-brand"
                    aria-label="Copy branch name"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-brand" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Length badge */}
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      branchName.length > maxLength
                        ? "bg-destructive/10 text-destructive"
                        : "bg-brand/10 text-brand"
                    }`}
                  >
                    {branchName.length} chars
                  </Badge>
                </div>

                {/* Git command preview */}
                <div className="space-y-2">
                  <span className="text-xs text-muted-foreground">
                    Git command:
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 rounded-lg border border-border/50 bg-muted/40 px-4 py-2.5 font-mono text-xs break-all text-muted-foreground">
                      {gitCommand}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={copyGitCommand}
                      className="shrink-0 hover:bg-brand/10 hover:text-brand"
                      aria-label="Copy git command"
                    >
                      {copiedCmd ? (
                        <Check className="h-4 w-4 text-brand" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Enter an issue title above to generate a branch name.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Clock className="h-4 w-4" />
              Recent Branch Names
            </div>
            <button
              onClick={clearHistory}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              Clear
            </button>
          </div>
          <div className="space-y-2">
            {history.map((entry) => (
              <motion.div
                key={entry.timestamp}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 group"
              >
                <div className="flex-1 rounded-lg border border-border/40 bg-muted/20 px-3 py-2 font-mono text-xs text-muted-foreground break-all">
                  {entry.branchName}
                </div>
                <button
                  onClick={() => useHistoryEntry(entry)}
                  className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-brand hover:bg-brand/10 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Copy from history"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// HomePage
// ─────────────────────────────────────────────

export function HomePage() {
  const scrollToTool = useCallback(() => {
    document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-screen-xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 mb-6"
          >
            <Sparkles className="h-4 w-4 text-brand" />
            <span className="text-sm text-brand font-medium">
              {siteConfig.hero.badge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight"
          >
            {siteConfig.hero.titleLine1}
            <br className="hidden sm:block" />
            <AnimatedGradientText>
              {siteConfig.hero.titleGradient}
            </AnimatedGradientText>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {siteConfig.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              size="lg"
              onClick={scrollToTool}
              aria-label="Scroll to tool section"
              className="gap-2 bg-gradient-to-r from-brand to-brand-accent text-white shadow-lg shadow-brand/25 px-8 py-6 text-lg"
            >
              Try Now
              <ArrowDown className="h-5 w-5" />
            </Button>
          </motion.div>
        </section>

        {/* Feature Cards */}
        <section className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {siteConfig.featureCards.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-muted/30 border border-border/50"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Tool Section */}
        <section id="tool" className="scroll-mt-24 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <BranchNameGenerator />
          </motion.div>
        </section>

        {/* Share + GitHub Star */}
        <section className="flex items-center justify-center gap-3 mb-20">
          <SocialShare />
          <GitHubStar />
        </section>

        {/* FAQ Section */}
        <section className="text-center mb-20">
          <FAQSection />
        </section>

        {/* Related Tools */}
        <section className="text-center">
          <RelatedTools />
        </section>
      </main>

      <Footer />
    </div>
  );
}
