import { StringUtils } from "@/utils";

export const routes = Object.freeze({
	ROOT: "/",
	HOME: "/home",
	ABOUT: "/about",
	SEARCH: "/search",
	LOGIN: "/login",
	LOGOUT: "/logout",
	ONBOARDING: "/onboarding",
	ROOM: (name: string) => {
		if (name.length === 0) return "/room";
		const queryParams = { name };
		return `/room?${new URLSearchParams(queryParams).toString()}`;
	},
	PROFILE: "/profile",
	SETTINGS: "/settings",
	ERROR: "/500",
	ADMIN: "/__/admin",
	CACHE: "/__/admin/cache",
	LOGS: "/__/admin/logs",
	LOG_FILE: (file: string) => `/__/admin/logs/${file}`,
	REPORT: "/report",
	PRIVACY_POLICY: "/privacy-policy",
	TERMS_AND_CONDITIONS: "/terms-and-conditions",
	HELP: "/help",
	CONTACT: "/contact",
});

export const protectedRoutes: Array<String | Function> = [
	routes.ADMIN,
	routes.CACHE,
	routes.LOGS,
	routes.LOG_FILE,
	routes.PROFILE,
	routes.ROOM(""),
	routes.SEARCH,
];

export const routesSupportingContainer: Array<string | Function> = [
	routes.HOME,
	routes.ADMIN,
	routes.CACHE,
	routes.PROFILE,
	routes.ROOM(""),
	routes.SEARCH,
];

export const routesSupportingFooter: Array<string> = [
	routes.ROOT,
	routes.PRIVACY_POLICY,
	routes.ABOUT,
	routes.REPORT,
	routes.CONTACT,
];

export const redirectToLogin = (currentPath: string = StringUtils.EMPTY) => {
	return routes.LOGIN + `?redirect=${currentPath}`;
};
