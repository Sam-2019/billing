import shell from 'shelljs';
import mongoose from "mongoose";
import Graceful from "@ladjs/graceful";
import { ntfy } from "../alerts/ntfy.js";
import { config } from "../../config/index.js";

const graceful = new Graceful({
    mongooses: [mongoose],
});

graceful.listen();

const dbBackup = async () => {
    const { uri, name, dir } = config.database;
    if (!uri) return console.error("DB uri non-existent");
    if (!name) return console.error("DB name non-existent");
    if (!dir) return console.error("DB Dump directory non-existent");

    try {
        console.log(`[${new Date().toISOString()}] dbBackup job started.`);
        shell.exec(`mongodump --uri="${uri}" --db ${name} --gzip --out ${dir}/${name}_backup_${new Date().valueOf()}`);
        const message = `✅ DB Backup`;
        await ntfy({ payload: message });
    }
    catch (err) {
        const message = `🤬 DB Backup: ${err}`;
        await ntfy({ payload: message });
        console.error(message);
    } finally {
        console.log(`[${new Date().toISOString()}] dbBackup job finished.`);
        process.exit(0);
    }
}

await dbBackup()