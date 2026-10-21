import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ANDROID_ROOT = "android";
const CENTRAL_MIRRORS = [
  '        maven { url "https://maven-central.storage-download.googleapis.com/maven2/" }',
  '        maven { url "https://repo1.maven.org/maven2/" }',
];

function gradleFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (entry.name === ".gradle" || entry.name === "build") continue;
      files.push(...gradleFiles(join(directory, entry.name)));
    } else if (entry.isFile() && entry.name.endsWith(".gradle")) {
      files.push(join(directory, entry.name));
    }
  }
  return files;
}

const files = gradleFiles(ANDROID_ROOT);
let changed = 0;

for (const file of files) {
  const source = readFileSync(file, "utf8");
  if (source.includes(CENTRAL_MIRRORS[0]) || !/repositories\s*\{\s*google\(\)/.test(source)) {
    continue;
  }

  const updated = source.replace(
    /(repositories\s*\{\s*google\(\))/g,
    "$1\n" + CENTRAL_MIRRORS.join("\n")
  );

  if (updated !== source) {
    writeFileSync(file, updated);
    changed += 1;
  }
}

if (!changed) {
  console.log("No Gradle repository blocks needed the Maven Central fallback.");
} else {
  console.log("Added Google Cloud and repo1 Maven Central fallback endpoints to " + changed + " Gradle file(s).");
}
