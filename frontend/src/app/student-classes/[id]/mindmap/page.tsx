"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import dynamic from "next/dynamic";

// Dynamically import react-d3-tree (avoids SSR issues)
const Tree = dynamic(() => import("react-d3-tree"), { ssr: false });

export default function ClassMindmapPage() {
  const [prompt, setPrompt] = useState<string>("");
  const [mindmap, setMindmap] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const generateMindmap = async () => {
    if (!prompt || prompt.trim() === "") {
      setError("Please enter a prompt before generating.");
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const res = await axios.post(
        "http://127.0.0.1:8000/api/classrooms/mindmap/",
        { summaries: [prompt] },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Mindmap response:", res.data);

      // If your backend returns the mindmap object itself
      // instead of { mindmap: {...} }, do this:
      setMindmap(transformNode(res.data));
    } catch (err: any) {
      console.error("Error response:", err?.response?.data || err);
      setError("Failed to generate mindmap.");
    } finally {
      setLoading(false);
    }
  };

  // Recursively transform the node
  const transformNode = (node: any) => ({
    name: node.name,
    attributes: { description: node.description },
    children:
      node.children && node.children.length > 0
        ? node.children.map(transformNode)
        : undefined,
  });

  // Custom node rendering
  const renderCustomNode = ({ nodeDatum }: any) => {
    const padding = 6;
    const maxCharsPerLine = 40;

    const nameText = nodeDatum.name || "";
    const descText = nodeDatum.attributes?.description || "";

    const splitText = (text: string) => {
      const words = text.split(" ");
      const lines: string[] = [];
      let currentLine = "";

      words.forEach((word: string) => {
        if ((currentLine + " " + word).trim().length > maxCharsPerLine) {
          lines.push(currentLine.trim());
          currentLine = word;
        } else {
          currentLine += " " + word;
        }
      });
      if (currentLine.trim()) {
        lines.push(currentLine.trim());
      }
      return lines;
    };

    const descLines = descText ? splitText(descText) : [];
    const textLines = [nameText, ...descLines];
    const rectWidth = maxCharsPerLine * 6 + padding * 2;
    const rectHeight = textLines.length * 16 + padding * 2;

    return (
      <g>
        {/* Connection circle */}
        <circle r={8} fill="#3498DB" />

        {/* Rectangle with text */}
        <g transform="translate(15, -10)">
          <rect
            width={rectWidth}
            height={rectHeight}
            fill="#33FF57"
            rx={4}
            ry={4}
          />
          {textLines.map((line, i) => (
            <text
              key={i}
              fill="#3498DB"
              fontSize="11"
              x={padding}
              y={padding + 12 + i * 16}
            >
              {line}
            </text>
          ))}
        </g>
      </g>
    );
  };

  return (
    <main className="flex flex-1 flex-col p-4 bg-white dark:bg-neutral-900">
      <h1 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-neutral-100">
        Generate Mindmap
      </h1>

      <div className="mb-4 flex flex-col gap-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a summary or description..."
          className="w-full rounded border border-neutral-300 px-3 py-2 text-neutral-800 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
          rows={4}
        />
        <button
          onClick={generateMindmap}
          disabled={loading}
          className="self-start bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Mindmap"}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {mindmap && (
        <div className="w-full h-[80vh] bg-neutral-200 dark:bg-neutral-800 rounded">
          <Tree
            data={mindmap}
            orientation="vertical"
            translate={{ x: 400, y: 50 }}
            zoomable
            collapsible
            renderCustomNodeElement={renderCustomNode}
            pathFunc="elbow"
            pathClassFunc={() => "custom-link"}

            nodeSize={{ x: 300, y: 150 }}
          />
          <style jsx global>{`
            .custom-link {
              stroke: white !important;
              stroke-width: 2;
            }
          `}</style>
        </div>
      )}
    </main>
  );
}
