import extract from "extract-zip";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export const extractProject = async (zipPath, tempRoot) => {
  // Create a unique folder for this upload
  const folderName = crypto.randomUUID();

  const extractPath = path.join(tempRoot, folderName);

  await fs.mkdir(extractPath, { recursive: true });

  await extract(zipPath, {
    dir: extractPath,
  });

  return extractPath;
};