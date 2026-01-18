import { Model } from "./parser";

/**
 * Auth Mapping Model
 * @property identifier - Identifier of the user
 * @property providerId - Provider ID of the auth service
 * @property providerName - Provider Name of the auth service
 * @property misc - Misc details provided by the Auth Provider (optionals)
 * @property user - User ID (References User model) (optional - for non-onboarded users)
 * */
export type AuthMapping = Model<{
	identifier: string;
	providerId: string;
	providerName: string;
	misc?: any;
	user: string | null;
}>;

/**
 * User Model
 * @property name - Name of the user
 * @property email - Email of the user
 * @property avatar - Avatar of the user
 * */
export type User = Model<{
	name: string;
	email: string;
	avatar?: string;
}>;

/**
 * Artifact Model
 * @property service - Service name - example, google, facebook etc
 * @property identifier - Identifier of the artifact - example, email, phone etc
 * @property password - Password (sensitive, to be encrypted)
 * @property author - Author of the artifact
 * @property comment - Comment for additional information (optional)
 * */
export type Artifact = Model<{
	service: string;
	identifier: string;
	password: string;
	author: string;
	comment?: string;
}>;
