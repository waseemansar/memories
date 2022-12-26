import path from "path";
import fs from "fs";

const removeImage = (filePath: string) => {
    filePath = path.join(__dirname, "..", "/public" + filePath);
    fs.unlink(filePath, (err) => {
        if (err) console.group(err);
    });
};

export { removeImage };
