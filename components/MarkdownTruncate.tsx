"use client";
import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";

const MarkdownTruncate = ({
  data,
  max,
  className,
}: {
  data: string;
  max?: number;
  className?: string;
}) => {
  const [sanitizedHtml, setSanitizedHtml] = useState<string | null>(null);

  useEffect(() => {
    const processMarkdown = async () => {
      if (!data) {
        setSanitizedHtml(null);
        return;
      }

      let truncatedData = data;
      if (max && data.length > max) {
        truncatedData = data.substring(0, max) + "...";
      }

      try {
        const markedResult = await marked(truncatedData);
        const sanitized = DOMPurify.sanitize(markedResult);
        setSanitizedHtml(sanitized);
      } catch (error) {
        console.error("Error processing Markdown:", error);
        setSanitizedHtml("<p>Error rendering markdown.</p>");
      }
    };

    processMarkdown();
  }, [data, max]);

  if (sanitizedHtml === null) {
    return null; // Or a loading indicator
  }

  return (
    <div
      className={`prose ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

export default MarkdownTruncate;
