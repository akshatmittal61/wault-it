import { ICreateArtifact, IUpdateArtifact, IUpdateUser, IUser } from "@/types";

// Auth
export type VerifyGoogleOAuth = { code: string };
export type ContinueGoogleOAuth = { token: string };
export type VerifyUser = IUser;
export type Logout = null;

// User
export type UpdateUser = IUpdateUser;

// Artifacts
export type GetAllArtifacts = null;
export type GetArtifactsForService = { service: string };
export type GetArtifactById = null;
export type RevealArtifact = { privateKey: string };
export type CreateArtifact = ICreateArtifact;
export type UpdateArtifact = IUpdateArtifact;
export type DeleteArtifact = null;
export type GetServicesForUser = null;
export type SearchByService = { query: string };
export type ImportArtifactsFromCsv = { file: string; privateKey: string };
