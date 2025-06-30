"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import dynamic from "next/dynamic";

// Dynamically import react-d3-tree (avoids SSR issues)
const Tree = dynamic(() => import("react-d3-tree"), { ssr: false });

export default function MindmapPage() {
  const params = useParams();
  const materialId = params?.materialid;
  const router = useRouter();
  const [mindmap, setMindmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!materialId) return;

    const fetchMindmap = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `http://127.0.0.1:8000/api/classrooms/material/${materialId}/mindmap/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Raw mindmap data:", res.data);
        setMindmap(transformNode(res.data.mindmap));
      } catch (err) {
        console.error(err);
        setError("Failed to load mindmap.");
      } finally {
        setLoading(false);
      }
    };

    fetchMindmap();
  }, [materialId]);

  // Recursively transform the node
  const transformNode = (node: any) => ({
    name: node.name,
    attributes: { description: node.description },
    children:
      node.children && node.children.length > 0
        ? node.children.map(transformNode)
        : undefined,
  });

  // Custom node rendering: circle + name + description
  const renderCustomNode = ({ nodeDatum }: any) => {
    const padding = 6;
    const maxCharsPerLine = 40;

    // Instead of using name, treat it as a description line
    const allTextLines = [
      nodeDatum.name || "",
      ...(nodeDatum.attributes?.description
        ? [nodeDatum.attributes.description]
        : []),
    ];

    const splitLines = allTextLines.flatMap((text) => {
      const words = text.split(" ");
      const lines: string[] = [];
      let currentLine = "";

      words.forEach((word:string) => {
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
    });

    const rectWidth = maxCharsPerLine * 6 + padding * 2;
    const rectHeight = splitLines.length * 16 + padding * 2;

    return (
      <g>
        <circle r={8} fill="#3498DB" />
        <g transform="translate(15, -10)">
          <rect
            width={rectWidth}
            height={rectHeight}
            fill="#33FF57"
            rx={4}
            ry={4}
          />
          {splitLines.map((line, i) => (
            <text
              key={i}
              fill="#000"
              fontSize="11"
              fontWeight="normal"
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

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p>Loading mindmap...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col p-4 bg-white dark:bg-neutral-900">
      <h1 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-neutral-100">
        Mindmap
      </h1>
      <div className="w-full h-[80vh] bg-neutral-200 dark:bg-neutral-800 rounded">
        <Tree
          data={mindmap}
          orientation="vertical"
          translate={{ x: 400, y: 50 }}
          zoomable
          collapsible
          renderCustomNodeElement={renderCustomNode}
          pathFunc="elbow"
          nodeSize={{ x: 300, y: 150 }}
          pathClassFunc={() => "custom-link"}
        />
      </div>
      <style jsx global>{`
        .custom-link {
          stroke: white !important;
          stroke-width: 2;
        }
      `}</style>
    </main>
  );
}
