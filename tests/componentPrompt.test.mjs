import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { buildComponentPrompt } from "../src/lib/componentPrompt.ts";

const snapshot = JSON.parse(await readFile(new URL("../src/generated/worklabs.json", import.meta.url), "utf8"));

test("each component gets a self-contained, component-specific integration prompt", () => {
  const prompts = snapshot.components.map((component) => {
    const prompt = buildComponentPrompt(component);
    assert.ok(prompt.startsWith(`Integrate the Worklabs ${component.name} component`));
    assert.ok(prompt.includes(`Registry path: registry/${component.slug}`));
    assert.ok(prompt.includes(component.summary));
    assert.ok(prompt.includes(component.readme));
    for (const dependency of component.dependencies) assert.ok(prompt.includes(dependency));
    for (const file of component.files.filter((file) => file.language !== "markdown")) {
      assert.ok(prompt.includes(`### ${file.path}`));
      assert.ok(prompt.includes(file.content));
    }
    for (const other of snapshot.components.filter((item) => item.slug !== component.slug)) {
      for (const file of other.files.filter((file) => file.language !== "markdown")) {
        assert.ok(!prompt.includes(`### ${file.path}`));
      }
    }
    return prompt;
  });
  assert.equal(new Set(prompts).size, snapshot.components.length);
});

test("reference blocks cannot be closed by backticks inside the README or source", () => {
  const component = {
    ...snapshot.components[0],
    readme: "# Example\n```tsx\nexample\n```\n`````",
    files: [{ path: "registry/example/example.tsx", language: "tsx", content: "const ticks = '````';" }],
    dependencies: [],
  };
  const prompt = buildComponentPrompt(component);
  assert.ok(prompt.includes(`\`\`\`\`\`\`markdown\n${component.readme}\n\`\`\`\`\`\``));
  assert.ok(prompt.includes(`\`\`\`\`\`tsx\n${component.files[0].content}\n\`\`\`\`\``));
  assert.ok(prompt.includes("no additional npm dependencies are listed"));
});
