"use client";

import { codeInput } from "@sanity/code-input";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

const resolvedProjectId = projectId || "your-project-id";

export default defineConfig({
  name: "generative-ai-optimization",
  title: "GAiO Insights",
  basePath: "/studio",
  projectId: resolvedProjectId,
  dataset,
  apiVersion,
  plugins: [
    structureTool({ structure }),
    visionTool(),
    codeInput(),
  ],
  schema: { types: schemaTypes },
});
