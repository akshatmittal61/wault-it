import { Artifact, Schema } from "@/types";
import { ObjectId } from "@/db";

export const ArtifactSchema: Schema<Artifact> = {
	service: {
		type: String,
		required: true,
	},
	identifier: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	author: {
		type: ObjectId,
		ref: "User",
		required: true,
	},
	comment: {
		type: String,
		default: "",
	},
};
