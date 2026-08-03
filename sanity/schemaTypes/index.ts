import type { SchemaTypeDefinition } from "sanity";
import { commentType } from "./comment";
import { postType } from "./post";

export const schemaTypes: SchemaTypeDefinition[] = [postType, commentType];
