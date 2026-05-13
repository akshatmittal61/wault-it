import { Cache } from "@/cache";
import { cacheParameter, TTL_SECONDS } from "@/constants";
import { InvalidDataFormatException } from "@/errors";
import { Logger } from "@/log";
import {
	CacheParameter,
	CachePayloadGenerator,
	IAuthMapping,
	IConcealedArtifact,
	IUser,
} from "@/types";
import { SafetyUtils } from "@/utils";

export class CacheService {
	private static invalidate(key: string) {
		Logger.debug(`Invalidating cache for ${key}`);
		Cache.invalidate(key);
	}

	/**
	 * Fetches a value from the cache by key,
	 * or executes a callback to retrieve the value if it's not cached
	 * and stores it in the cache for the specified time-to-live.
	 *
	 * @param {string} key - The cache key to fetch the value for.
	 * @param {() => Promise<T>} callback - A callback function to execute if the value is not cached.
	 * @param {number} ttl - The time-to-live for the cache entry in seconds.
	 * @return {Promise<T>} The cached or newly retrieved value.
	 */
	public static async fetch<T>(
		key: string,
		callback: () => Promise<T>,
		ttl: number = TTL_SECONDS
	): Promise<T> {
		if (key.length > 0 && key !== "undefined" && key !== "null") {
			const cachedValue = Cache.get<T>(key);
			if (cachedValue) {
				Logger.debug(`Cache hit for ${key}`);
				return cachedValue;
			}
			Logger.debug(`Cache miss for ${key}`);
			const newValue = await callback();
			Cache.set<T>(key, newValue, ttl);
			return newValue;
		} else {
			return callback();
		}
	}

	private static getKeySetOfRandomObject(object: any): string {
		if (SafetyUtils.isNonNull(object)) {
			const keys = Object.keys(object);
			if (keys.length > 0) {
				return `{ ${keys.filter((key) => SafetyUtils.isNonNull(object[key])).join(", ")} }`;
			} else {
				throw new InvalidDataFormatException(
					object,
					"Object with at least one non-null property"
				);
			}
		} else {
			throw new InvalidDataFormatException(
				object,
				"Object with at least one non-null property"
			);
		}
	}

	public static getKey<T extends CacheParameter>(
		parameter: T,
		data: CachePayloadGenerator<T>
	): string {
		let key = "";
		Logger.debug(
			`Generating key for ${parameter} with data ${this.getKeySetOfRandomObject(data)}`
		);
		if (parameter === cacheParameter.USER) {
			const payload = data as CachePayloadGenerator<"USER">;
			if ("id" in payload) {
				key = `user:${payload.id}`;
			} else if ("email" in payload) {
				key = `user:${payload.email}`;
			} else {
				throw new InvalidDataFormatException(
					this.getKeySetOfRandomObject(data),
					"{ id } | { email }"
				);
			}
		} else if (parameter === cacheParameter.AUTH_MAPPING) {
			const payload = data as CachePayloadGenerator<"AUTH_MAPPING">;
			if ("id" in payload) {
				key = `auth-mapping:${payload.id}`;
			} else if ("identifier" in payload && "provider" in payload) {
				key = `auth-mapping:${payload.provider}:${payload.identifier}`;
			} else {
				throw new InvalidDataFormatException(
					this.getKeySetOfRandomObject(data),
					"{ id } | { identifier, provider }"
				);
			}
		} else if (parameter === cacheParameter.ARTIFACT) {
			const payload = data as CachePayloadGenerator<"ARTIFACT">;
			if ("userId" in payload && "artifactId" in payload) {
				key = `user:${payload.userId}:artifact:${payload.artifactId}`;
			} else {
				throw new InvalidDataFormatException(
					this.getKeySetOfRandomObject(data),
					"{ userId, artifactId }"
				);
			}
		} else if (parameter === cacheParameter.ARTIFACTS) {
			const payload = data as CachePayloadGenerator<"ARTIFACTS">;
			if ("userId" in payload) {
				key = `user:${payload.userId}:artifacts`;
			} else {
				throw new InvalidDataFormatException(
					this.getKeySetOfRandomObject(data),
					"{ userId }"
				);
			}
		} else if (parameter === cacheParameter.ARTIFACTS_BY_SERVICE) {
			const payload =
				data as CachePayloadGenerator<"ARTIFACTS_BY_SERVICE">;
			if ("userId" in payload && "service" in payload) {
				key = `user:${payload.userId}:service:${payload.service}:artifacts`;
			} else {
				throw new InvalidDataFormatException(
					this.getKeySetOfRandomObject(data),
					"{ userId, service }"
				);
			}
		} else {
			throw new InvalidDataFormatException(
				this.getKeySetOfRandomObject(data),
				"cache parameter not supported"
			);
		}
		Logger.debug(`Generated key: ${key}`);
		return key;
	}

	public static getAllCacheData(): { [key: string]: any } {
		return Cache.getAllKeys().reduce((obj, key) => {
			return {
				...obj,
				[key]: Cache.get(key),
			};
		}, {});
	}

	public static setUser(keyGen: CachePayloadGenerator<"USER">, value: IUser) {
		const key = this.getKey(cacheParameter.USER, keyGen);
		Cache.set(key, value);
	}

	public static async fetchUser(
		keyGen: CachePayloadGenerator<"USER">,
		callback: () => Promise<IUser | null>
	) {
		return await CacheService.fetch(
			this.getKey(cacheParameter.USER, keyGen),
			callback
		);
	}

	public static invalidateUser(keyGen: CachePayloadGenerator<"USER">) {
		this.invalidate(this.getKey(cacheParameter.USER, keyGen));
	}

	public static clearAllCacheData() {
		Cache.flushAll();
	}

	public static setAuthMapping(
		keyGen: CachePayloadGenerator<"AUTH_MAPPING">,
		value: IAuthMapping
	) {
		const key = this.getKey(cacheParameter.AUTH_MAPPING, keyGen);
		Cache.set(key, value);
	}

	public static async fetchAuthMapping(
		keyGen: CachePayloadGenerator<"AUTH_MAPPING">,
		callback: () => Promise<IAuthMapping | null>
	) {
		return await CacheService.fetch(
			this.getKey(cacheParameter.AUTH_MAPPING, keyGen),
			callback
		);
	}

	public static invalidateAuthMapping(
		keyGen: CachePayloadGenerator<"AUTH_MAPPING">
	) {
		this.invalidate(this.getKey(cacheParameter.AUTH_MAPPING, keyGen));
	}

	public static setArtifacts(
		keyGen: CachePayloadGenerator<"ARTIFACTS">,
		value: Array<IConcealedArtifact>
	) {
		const key = this.getKey(cacheParameter.ARTIFACTS, keyGen);
		Cache.set(key, value);
	}

	public static async fetchArtifacts(
		keyGen: CachePayloadGenerator<"ARTIFACTS">,
		callback: () => Promise<Array<IConcealedArtifact> | null>
	) {
		return await CacheService.fetch(
			this.getKey(cacheParameter.ARTIFACTS, keyGen),
			callback
		);
	}

	public static setArtifact(
		keyGen: CachePayloadGenerator<"ARTIFACT">,
		value: IConcealedArtifact
	) {
		const key = this.getKey(cacheParameter.ARTIFACT, keyGen);
		Cache.set(key, value);
	}

	public static async fetchArtifact(
		keyGen: CachePayloadGenerator<"ARTIFACT">,
		callback: () => Promise<IConcealedArtifact | null>
	) {
		return await CacheService.fetch(
			this.getKey(cacheParameter.ARTIFACT, keyGen),
			callback
		);
	}

	public static invalidateArtifact(
		keyGen: CachePayloadGenerator<"ARTIFACT">
	) {
		this.invalidate(this.getKey(cacheParameter.ARTIFACT, keyGen));
	}

	public static invalidateAllArtifactsForUser(userId: string) {
		this.invalidate(this.getKey(cacheParameter.ARTIFACTS, { userId }));
	}

	public static removeArtifact(keyGen: CachePayloadGenerator<"ARTIFACT">) {
		Cache.del(this.getKey(cacheParameter.ARTIFACT, keyGen));
	}

	public static removeArtifacts(keyGen: CachePayloadGenerator<"ARTIFACTS">) {
		Cache.del(this.getKey(cacheParameter.ARTIFACTS, keyGen));
	}

	public static setArtifactsByService(
		keyGen: CachePayloadGenerator<"ARTIFACTS_BY_SERVICE">,
		value: Array<IConcealedArtifact>
	) {
		const key = this.getKey(cacheParameter.ARTIFACTS_BY_SERVICE, keyGen);
		Cache.set(key, value);
	}

	public static async fetchArtifactsByService(
		keyGen: CachePayloadGenerator<"ARTIFACTS_BY_SERVICE">,
		callback: () => Promise<Array<IConcealedArtifact> | null>
	) {
		return await CacheService.fetch(
			this.getKey(cacheParameter.ARTIFACTS_BY_SERVICE, keyGen),
			callback
		);
	}

	public static invalidateArtifactsByService(
		keyGen: CachePayloadGenerator<"ARTIFACTS_BY_SERVICE">
	) {
		this.invalidate(
			this.getKey(cacheParameter.ARTIFACTS_BY_SERVICE, keyGen)
		);
	}
}
