export interface RegistryFile {
  name: string;
  path: string;
  language: string;
  content: string;
}

export interface RegistryComponent {
  slug: string;
  name: string;
  summary: string;
  category: string;
  tags: string[];
  dependencies: string[];
  demoPath: string;
  modifiedAt: string;
  readme: string;
  files: RegistryFile[];
}

export interface WorklabsSnapshot {
  version: 1;
  name: string;
  sourceLabel: string;
  syncedAt: string;
  readme: string;
  components: RegistryComponent[];
}

export type DetailTab = "preview" | "readme" | "source";

export type AppRoute =
  | { kind: "home" }
  | { kind: "components" }
  | { kind: "templates" }
  | { kind: "about" }
  | { kind: "component"; slug: string; tab: DetailTab; file?: string };
