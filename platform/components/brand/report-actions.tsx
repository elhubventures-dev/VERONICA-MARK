"use client";

import * as React from "react";
import { Download, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

type ReportActionsProps = {
  reportTitle: string;
  reportFormat: "CSV" | "XLSX" | "PDF";
  href: string;
};

export function ReportActions({ reportTitle, reportFormat, href }: ReportActionsProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    toast.success(`${reportTitle} regenerated`, {
      description: `${reportFormat} export is ready for download in this demo workspace.`,
    });
    setIsGenerating(false);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 300));

    if (href && href !== "#") {
      window.open(href, "_blank", "noopener,noreferrer");
    }

    toast.success(`Download started for ${reportTitle}`, {
      description: "This is a demo action wired to the workspace UI.",
    });
    setIsDownloading(false);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button type="button" onClick={handleGenerate} disabled={isGenerating} className="sm:flex-1">
        <RefreshCw className={isGenerating ? "animate-spin" : undefined} aria-hidden />
        {isGenerating ? "Generating..." : "Generate demo"}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={handleDownload}
        disabled={isDownloading}
        className="sm:flex-1"
      >
        <Download aria-hidden />
        {isDownloading ? "Preparing..." : "Download demo"}
      </Button>
    </div>
  );
}
