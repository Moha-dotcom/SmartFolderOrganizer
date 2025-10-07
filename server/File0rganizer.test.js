
// // We’ll test the following behaviors:
// // 	1.	✅ Constructor validates folder name input
// // 	2.	✅ organizeFolder() creates directory and returns a structured response
// // 	3.	✅ Private methods are indirectly tested (via public behavior)
// // 	4.	🧩 Mock fs operations so we don’t actually touch your disk

// // ⸻


// import {FileOrganizer} from "../server/FileOrganzer.js"
const { FileOrganizer } = await import("../server/FileOrganzer.js");
import { jest, describe, test, expect, beforeEach } from "@jest/globals";
import path  from "path";
// Mock fs/promises and node:fs using unstable_mockModule
const fs = {
  mkdir: jest.fn(),
  readdir: jest.fn(),
  stat: jest.fn(),
  rename: jest.fn(),
};

const existsSync = jest.fn();

// Tell Jest to mock these modules BEFORE importing your class
jest.unstable_mockModule("fs/promises", () => fs);
jest.unstable_mockModule("node:fs", () => ({ existsSync }));

describe("FileOrganizer", () => {
  const baseDir = "/Users/user";
  const dirName = "test-folder";
  const fullDirPath = path.join(baseDir, dirName);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ Test 1: Constructor validation
  test("throws error when folder name is invalid", () => {
    expect(() => new FileOrganizer()).toThrow("Folder name must be a valid string");
    expect(() => new FileOrganizer(123)).toThrow("Folder name must be a valid string");
  });

  // ✅ Test 2: Constructor sets properties correctly
  test("initializes with correct paths and empty arrays", () => {
    const organizer = new FileOrganizer(dirName);
    expect(organizer.dirPath).toBe(fullDirPath);
    expect(organizer.OriginalStateFolder).toEqual([]);
    expect(organizer.OrganizedStateFolder).toEqual([]);
  });

  // ✅ Test 3: organizeFolder() logic
  test("organizes folder correctly and returns expected structure", async () => {
    const organizer = new FileOrganizer(dirName);

    // Mock folder content
    const fakeFiles = ["file1.txt", "file2.js"];
    const fakeStats = { isFile: () => true };

    // Mock FS methods
    fs.mkdir.mockResolvedValue();
    fs.readdir
      .mockResolvedValueOnce(fakeFiles) // before organizing
      .mockResolvedValueOnce(["txt", "js"]); // after organizing
    fs.stat.mockResolvedValue(fakeStats);
    fs.rename.mockResolvedValue();
    existsSync.mockReturnValue(false); // simulate subfolders not existing

    const result = await organizer.organizeFolder();

    // Verify fs interactions
    expect(fs.mkdir).toHaveBeenCalledWith(fullDirPath, { recursive: true });
    expect(fs.readdir).toHaveBeenCalledTimes(2);
    expect(fs.stat).toHaveBeenCalledTimes(2);
    expect(fs.rename).toHaveBeenCalledTimes(2);

    // Verify final structure
    expect(result).toEqual({
      folder: {
        OrginalStateFolder: {
          data: fakeFiles,
          length: 2,
        },
        OrganizedStateFolder: {
          data: ["txt", "js"],
          length: 2,
        },
      },
    });
  });
});