import { ArtifactSchema, AuthMappingSchema, UserSchema } from "@/schema";
import { Artifact, AuthMapping, User } from "@/types";
import { ModelFactory } from "./base";

export const ArtifactModel = new ModelFactory<Artifact>(
	"Artifact",
	ArtifactSchema
).model;
export const AuthMappingModel = new ModelFactory<AuthMapping>(
	"AuthMapping",
	AuthMappingSchema
).model;
export const UserModel = new ModelFactory<User>("User", UserSchema).model;
