import { CacheParameter } from "./enum";

type CachePayloadMap = {
	USER: { id: string } | { email: string };
	AUTH_MAPPING: { id: string } | { identifier: string; provider: string };
	EXPENSE: { id: string };
	GROUP: { id: string };
	GROUP_DETAILS: { id: string };
	MEMBER: { id: string };
	USER_GROUPS: { userId: string };
	GROUP_EXPENSES: { groupId: string };
};
export type CachePayloadGenerator<T extends CacheParameter> =
	CachePayloadMap[T];
