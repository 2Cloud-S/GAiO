"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

const resolvedProjectId = projectId || "your-project-id";

export default defineConfig({
  name: "generative-ai-optimization",
  title: "GAiO Insights",
  basePath: "/studio",
  projectId: resolvedProjectId,
  dataset,
  apiVersion,
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
