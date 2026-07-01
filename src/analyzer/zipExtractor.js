import extract from "extract-zip";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

/**
 * Extracts an uploaded ZIP file into a unique temporary directory.
 *
 * @param {string} zipPath - Path to the uploaded ZIP file.
 * @param {string} tempRoot - Root directory where extracted projects are stored.
 * @returns {Promise<string>} - The path to the extracted project.
 */
export const extractProject = async (zipPath, tempRoot) => {
  // Generate a unique folder name for this upload
  const folderName = crypto.randomUUID();

  const extractPath = path.join(tempRoot, folderName);

  // Create the extraction directory
  await fs.mkdir(extractPath, { recursive: true });

  // Extract the ZIP
  await extract(zipPath, {
    dir: path.resolve(extractPath),
  });

  return extractPath;
};