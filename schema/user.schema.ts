import { Schema, User } from "@/types";
import { fallbackAssets } from "@/constants";

export const UserSchema: Schema<User> = {
	name: {
		type: String,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		index: {
			unique: true,
			sparse: true,
		},
	},
	avatar: {
		type: String,
		default: fallbackAssets.avatar,
	},
};
