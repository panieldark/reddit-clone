import { Post } from "./entities/Post";
import { __prod__ } from "./consts";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { User } from "./entities/User";

require("dotenv").config();
export default {
	migrations: {
		path: path.join(__dirname, "./migrations"),
		pattern: /^[\w-]+\d+\.[tj]s$/,
	},
	entities: [Post, User],
	dbName: "lireddit",
	type: "postgresql",
	user: "postgres",
	password: process.env.pg_pw,
	debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
