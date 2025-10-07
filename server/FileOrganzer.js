import path from "path";
import fs from "fs/promises";
import { existsSync } from "node:fs";

export class FileOrganizer {
  constructor(dirPath) {
    if (!dirPath || typeof dirPath !== "string") {
      throw new Error("Folder name must be a valid string");
    }

    this.baseDir = "/Users/user";
    this.dirPath = path.join(this.baseDir, dirPath);
    this.OriginalStateFolder = [];
    this.OrganizedStateFolder = [];
  }

  async organizeFolder() {
    await fs.mkdir(this.dirPath, { recursive: true });

    const originalItems = await fs.readdir(this.dirPath);
    this.OriginalStateFolder.push({ data: originalItems, length: originalItems.length });

    for (let i = 0; i < originalItems.length; i++) {
      const itemPath = path.join(this.dirPath, originalItems[i]);
      const stats = await fs.stat(itemPath);

      if (stats.isFile()) {
        const extname = path.extname(originalItems[i]).slice(1);
        if (!extname) continue;

        const filename = path.basename(originalItems[i]);
        const folderToCreate = path.join(this.dirPath, extname);

        if (!this.#checkFolderExist(extname)) {
          await fs.mkdir(folderToCreate, { recursive: true });
        }

        const dest = path.join(folderToCreate, filename);
        await this.#moveFile(itemPath, dest);
      }
    }

    const organizedItems = await fs.readdir(this.dirPath);
    this.OrganizedStateFolder.push({ data: organizedItems, length: organizedItems.length });

    const response = {
      folder:  {
         OrginalStateFolder :{
         data : this.OriginalStateFolder[0].data,
         length : this.OriginalStateFolder[0].length,
      },

      OrganizedStateFolder : {
        data : this.OrganizedStateFolder[0].data,
        length : this.OrganizedStateFolder[0].length,
      }
        
      }
    }
    
    return response;
  }

  async #moveFile(src, dest) {
    try {
      await fs.rename(src, dest);
      console.log(`✅ Moved: ${path.basename(src)} → ${path.dirname(dest)}`);
    } catch (err) {
      console.error(`❌ Error moving ${src}:`, err.message);
    }
  }

  #checkFolderExist(dir) {
    const folder = path.join(this.dirPath, dir);
    return existsSync(folder);
  }
}

