"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = require("./entities/Post");
const consts_1 = require("./consts");
const path_1 = __importDefault(require("path"));
require("dotenv").config();
const pw = process.env.pg_pw;
exports.default = {
    migrations: {
        path: path_1.default.join(__dirname, "./migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Post_1.Post],
    dbName: "lireddit",
    type: "postgresql",
    user: "postgres",
    password: pw,
    debug: !consts_1.__prod__,
};
//# sourceMappingURL=mikro-orm.config.js.map