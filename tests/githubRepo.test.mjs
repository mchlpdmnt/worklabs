import assert from "node:assert/strict";
import test from "node:test";
import { githubRepoUrl, worklabsGithubRepoUrl } from "../src/lib/githubRepo.ts";

test("Worklabs has the supplied repository as its default destination", () => {
  assert.equal(worklabsGithubRepoUrl, "https://github.com/mchlpdmnt/worklabs");
  assert.equal(githubRepoUrl(worklabsGithubRepoUrl), worklabsGithubRepoUrl);
});

test("GitHub navbar links accept and normalize real repository URLs", () => {
  assert.equal(githubRepoUrl(" https://github.com/example/worklabs/ "), "https://github.com/example/worklabs");
  assert.equal(githubRepoUrl("https://github.com/example/worklabs.git"), "https://github.com/example/worklabs");
  assert.equal(githubRepoUrl("https://github.com/example/worklabs?tab=readme#readme"), "https://github.com/example/worklabs");
});

test("missing, malformed, and non-repository links remain disabled", () => {
  for (const value of [undefined, "", "bad URL", "http://github.com/example/worklabs", "https://github.com/example", "https://github.com/example/worklabs/issues", "https://github.com.evil.test/example/worklabs", "https://user:password@github.com/example/worklabs", "javascript:alert(1)"]) {
    assert.equal(githubRepoUrl(value), undefined);
  }
});
