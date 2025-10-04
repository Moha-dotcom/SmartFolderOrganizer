import path from "path";
import fs from "fs/promises";
import { existsSync } from "node:fs";
import e from "express";

export class FileOrganizer {
  constructor(dirPath) {
    this.dirPath = dirPath;
    this.OrginalStateFolder = [];
    this.OrganizedStateFolder = []
    this.baseDir = "/Users/user/"
  }

  // return an Annay OrganizedFolder List
  getOrganizedStateFolder() {
    return this.OrganizedStateFolder
  }
  //Return an array of OriginalState of the Folder
   getOrginalStateFolder() {
    return this.OrginalStateFolder
  }

  // Read all files in a folder
  async organizerFolder() {
    try {
      // Check if dirPath itself is valid and a directory


      const rootStats = await fs.stat(this.dirPath);
      if (rootStats.isFile()) {
        console.error("❌ Your dirPath points to a file, not a folder.");
        return;
      }

      const Orginalitems = await fs.readdir(this.dirPath);
      this.OrginalStateFolder.push({data : Orginalitems, length : Orginalitems.length})
  
      for (let i = 0; i < Orginalitems.length; i++) {
        const itemPath = path.join(this.dirPath, Orginalitems[i]);
        const stats = await fs.stat(itemPath);

        if (stats.isFile()) {
          // Get extension
          const extname = path.extname(Orginalitems[i]).slice(1);
          if (!extname) continue; // skip files with no extension

          const filename = path.basename(Orginalitems[i]);
          const folderToCreate = path.join(this.dirPath, extname);

          // Create folder if it doesn’t exist
          if (!this.#checkFolderExist(extname)) {
            // console.log(`📂 Creating folder: ${folderToCreate}`);
            await fs.mkdir(folderToCreate, { recursive: true });
          }

          // Move file into folder
          const src = itemPath;
          const dest = path.join(folderToCreate, filename);
          await this.#moveFile(src, dest);
        } else {
          // If it's already a directory, skip it
          console.log(`ℹ️ Skipping directory: ${Orginalitems[i]}`);
        }
      }
    } catch (error) {
      console.error("❌ Something went wrong:", error.message);
    }

    // We get to read the Folder again to get all the Items 
    const Organizeditems = await fs.readdir(this.dirPath);
    this.OrganizedStateFolder.push({data : Organizeditems, length : Organizeditems.length})
    let count = Organizeditems.length
    console.log(`The Count of the Organized Foler is ${count}`)
    console.table(this.getOrganizedStateFolder())



    const response = {
      folder:  {
         OrginalStateFolder :{
         data : this.OrginalStateFolder[0].data,
         length : this.OrginalStateFolder[0].length,
      },

      OrganizedStateFolder : {
        data : this.OrganizedStateFolder[0].data,
        length : this.OrganizedStateFolder[0].length,
      }
        
      }
    }
    
    return response;
  }

  // Moves files
  async #moveFile(src, dest) {
    try {
      await fs.rename(src, dest);
      console.log(`✅ Moved: ${path.basename(src)} → ${path.dirname(dest)}`);
    } catch (err) {
      console.error(`❌ Error moving ${src}:`, err.message);
    }
  }

  // Checks if directory exists
   #checkFolderExist(dir) {
    let folder = path.join(this.dirPath, dir);
    return existsSync(folder);
  }

  async getDirectoryFiles(){
          const items = await fs.readdir(this.dirPath);
          return{
             items : items,
             count : items.length
          }
  }

  
}

// // Example usage
// const organizer = new FileOrganizer("/Users/user/documents");

// organizer.organizerFolder();
//       // console.log(path.resolve("Desktop", "..", "..", "."))

// // console.log(await organizer.getDirectoryFiles())

// // import fs from "fs/promises";
// // import path from "path";
