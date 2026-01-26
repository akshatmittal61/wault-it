import { CreateModel, UnModel, UpdateModel } from "./parser";
import { Artifact, AuthMapping, User } from "./schema";

// Types prefixed with `I` are client-specific models

export type IUser = User;
export type IUpdateUser = Omit<UpdateModel<IUser>, "email">;
export type IAuthMapping = Omit<AuthMapping, "user"> & { user: IUser | null };

// Concealed artifacts to be shown in normal client views
export type IConcealedArtifact = Omit<Artifact, "author" | "password">;
// Revealed artifacts when the user enters the key to reveal an artifact
export type IRevealedArtifact = Omit<Artifact, "author">;
// By default, the artifact view is the concealed artifact till user reveals
export type IArtifact = IConcealedArtifact;

export type ISensitiveInfo = { password: string; privateKey: string };

// For artifacts, backend requires Author details, but not the key
export type CreateArtifactModel = CreateModel<Artifact>;
// For artifacts, user needs to specify the real password and the key
export type ICreateArtifact = Omit<UnModel<Artifact>, "author"> &
	ISensitiveInfo;
// User can update the artifact normally, but for changing the key or the password, they need to specify both
export type IUpdateArtifact = UpdateModel<UnModel<IConcealedArtifact>> &
	// eslint-disable-next-line no-unused-vars
	(ISensitiveInfo | { [K in keyof ISensitiveInfo]?: never });
export type UpdateArtifact = IUpdateArtifact;

// sorts Artifacts on service-level
export type IArtifactsBucket = {
	service: string;
	artifacts: IArtifact[];
};

// Encrypted data to be stored in database
export type EncryptedData = {
	iv: string;
	data: string;
};
