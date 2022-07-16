import { Database, DemoProcessor } from "bar-db";
import { app } from "electron";
import path from "path";
import { Sequelize } from "sequelize";

import { StoreAPI } from "@/api/store";
import { ReplayData } from "@/model/replay";
import { SettingsType } from "@/model/settings";

export class ReplayManager {
    protected settings: StoreAPI<SettingsType>;
    protected db?: LocalBARDatabase;
    protected replayProcessor: DemoProcessor;

    constructor(settings: StoreAPI<SettingsType>) {
        this.settings = settings;

        this.db = new LocalBARDatabase({
            host: "",
            username: "",
            password: "",
            port: 123,
            alterDbSchema: true,
            initMemoryStore: false,
            syncModel: true,
            createSchemaDiagram: false,
            logSQL: false,
        });

        this.replayProcessor = new DemoProcessor({
            db: this.db,
        });
    }

    public async init() {
        await this.db?.init();

        return this;
    }

    public async saveReplay(replayData: ReplayData) {
        //
    }
}

class LocalBARDatabase extends Database {
    protected override async initDatabase() {
        this.sequelize = new Sequelize({
            dialect: "sqlite",
            storage: path.join(app.getPath("userData"), "store", "replays.db"),
            logging: this.config.logSQL ? console.log : false,
        });

        try {
            await this.sequelize.authenticate();
            console.log("Database connection has been established successfully.");
        } catch (error) {
            console.log("Unable to connect to the database:", error);
            throw error;
        }
    }
}