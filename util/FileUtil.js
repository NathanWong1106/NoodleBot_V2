const fs = require('fs');
const path = require('path');
const commandPath = path.join(path.dirname(path.resolve("bot.js")),"commands");

/**
 * Any file IO functions should be here
 */
class FileUtil {
    /**
     * Returns all js files (including nested files) in a directory
     * @param {String} dir directory to search through
     */
    static getCommandFiles(dir=commandPath) {
        let files = [];
        for(const i of fs.readdirSync(dir)) {
            const iPath = path.join(dir, i)
            const isDir = fs.lstatSync(iPath).isDirectory()

            if(i.endsWith(".js") && !isDir) {
                files.push(iPath);
            } 
            else if (isDir) {
                files = files.concat(this.getCommandFiles(iPath));
            }
        }
        return files;
    }
}

module.exports = FileUtil;