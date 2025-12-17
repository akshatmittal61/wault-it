import { Artifact, User } from "./schema";
import { UnModel, UpdateModel } from "@/types/parser";

export type IUser = User;
export type IUpdateUser = Omit<UpdateModel<IUser>, "email">;

export type IArtifact = Artifact;
export type IConcealedArtifact = Omit<Artifact, "author" | "password">;
export type IRevealedArtifact = Omit<Artifact, "author">;

export type ISensitiveInfo = { password: string; privateKey: string };

export type ICreateArtifact = Omit<UnModel<Artifact>, "author"> &
	ISensitiveInfo;
export type IUpdateArtifact = UpdateModel<UnModel<Artifact> & ISensitiveInfo>;
