import {
	AppNetworkStatus,
	AppTheme,
	T_API_METHODS,
	T_AUTH_MAPPING_PROVIDER,
	T_NODE_ENV,
	T_USER_ROLE,
} from "@/types";
import { getEnumeration } from "@/utils/functions";

export const apiMethods = getEnumeration<T_API_METHODS>([
	"GET",
	"POST",
	"PUT",
	"PATCH",
	"DELETE",
]);

export const USER_ROLES: Record<T_USER_ROLE, T_USER_ROLE> = {
	ADMIN: "ADMIN",
	USER: "USER",
	GUEST: "GUEST",
};

export const NODE_ENV = getEnumeration<T_NODE_ENV>([
	"development",
	"test",
	"production",
]);

export const authMappingProvider = getEnumeration<T_AUTH_MAPPING_PROVIDER>([
	"google",
]);

export const appTheme = getEnumeration<AppTheme>(["light", "dark"]);
export const appNetworkStatus = getEnumeration<AppNetworkStatus>([
	"online",
	"offline",
]);
