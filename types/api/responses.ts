import {
	IArtifactsBucket,
	IConcealedArtifact,
	IRevealedArtifact,
	IUser,
} from "@/types";

// Auth

export type VerifyUser = IUser;
export type VerifyGoogleOAuth = string;
export type ContinueGoogleOAuth = IUser;
export type RequestOtp = null;
export type VerifyOtp = IUser;
export type Logout = null;

// User
export type UpdateUser = IUser;

// Artifacts
export type GetAllArtifacts = Array<IArtifactsBucket>;
export type GetArtifactsForService = Array<IConcealedArtifact>;
export type GetArtifactById = IConcealedArtifact;
export type RevealArtifact = IRevealedArtifact;
export type CreateArtifact = IConcealedArtifact;
export type UpdateArtifact = IConcealedArtifact;
export type DeleteArtifact = IConcealedArtifact;
export type GetServicesForUser = Array<string>;
export type SearchByService = Array<string>;
// After bulk import, the response is the list of all services for the user post import
export type ImportArtifactsFromCsv = Array<string>;

// Room
export type RenameRoom = null;
