import { BooleanUtils, CollectionUtils, StringUtils } from "@/utils";

export class Routes {
	// Web routes
	public static readonly ROOT = "/";
	public static readonly ABOUT = "/about";
	public static readonly REPORT = "/report";
	public static readonly PRIVACY_POLICY = "/privacy-policy";
	public static readonly TERMS_AND_CONDITIONS = "/terms-and-conditions";
	public static readonly HELP = "/help";
	public static readonly CONTACT = "/contact";
	public static readonly ERROR = "/500";
	public static readonly NOT_FOUND = "/404";

	// Auth Routes
	public static readonly LOGIN = "/login";
	public static readonly LOGOUT = "/logout";
	public static readonly ONBOARDING = "/onboarding";

	// App Routes
	public static readonly HOME = "/home";
	public static readonly SEARCH = "/search";
	public static readonly ROOM = (name: string) => {
		if (name.length === 0) return "/room";
		const queryParams = { name };
		return `/room?${new URLSearchParams(queryParams).toString()}`;
	};
	public static readonly PROFILE = "/profile";
	public static readonly SETTINGS = "/settings";

	// Admin Routes
	public static readonly ADMIN = "/__/admin";
	public static readonly CACHE = "/__/admin/cache";
	public static readonly LOGS = "/__/admin/logs";
	public static readonly LOG_FILE = (file: string) =>
		`/__/admin/logs/${file}`;

	public static isProtected(path: string) {
		const protectedRoutes: Array<String | Function> = [
			Routes.ADMIN,
			Routes.CACHE,
			Routes.LOGS,
			Routes.LOG_FILE,
			Routes.PROFILE,
			Routes.ROOM(""),
			Routes.SEARCH,
		];
		return protectedRoutes.includes(path);
	}

	public static supportsAppContainer(path: string) {
		const appContainerSupportedRoutes: Array<string | Function> = [
			Routes.HOME,
			Routes.ADMIN,
			Routes.CACHE,
			Routes.PROFILE,
			Routes.ROOM(""),
			Routes.SEARCH,
		];
		if (CollectionUtils.includes(appContainerSupportedRoutes, path)) {
			return BooleanUtils.True.value;
		}
		if (StringUtils.equals(path, Routes.CONTACT)) {
			return BooleanUtils.True.value;
		}
		return BooleanUtils.False.value;
	}

	public static supportsFooter(path: string) {
		const footerSupportedRoutes: Array<string> = [
			Routes.ROOT,
			Routes.PRIVACY_POLICY,
			Routes.ABOUT,
			Routes.REPORT,
			Routes.CONTACT,
		];
		return footerSupportedRoutes.includes(path);
	}

	public static redirectToLogin(path: string = StringUtils.EMPTY) {
		return Routes.LOGIN + `?redirect=${path}`;
	}
}
