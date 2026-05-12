import { CacheParameter } from "./enum";

type CachePayloadMap = {
	USER: { id: string } | { email: string };
	AUTH_MAPPING: { id: string } | { identifier: string; provider: string };
	ARTIFACT: { userId: string; artifactId: string };
	ARTIFACTS: { userId: string };
	ARTIFACTS_BY_SERVICE: { userId: string; service: string };
};
export type CachePayloadGenerator<T extends CacheParameter> =
	CachePayloadMap[T];
