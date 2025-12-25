import { AuthApi } from "@/api";
import { Logger } from "@/log";
import { ServerSideAuthMiddleware } from "@/types";

export const authenticatedPage: ServerSideAuthMiddleware = async (
	context: any,
	{ onLoggedInAndNotOnboarded, onLoggedInAndOnboarded, onLoggedOut }
) => {
	const { req } = context;
	const cookies = req.cookies;
	if (!cookies.accessToken || !cookies.refreshToken) {
		return onLoggedOut();
	}
	try {
		const headers = { cookie: req.headers.cookie };
		const { data: user } = await AuthApi.verifyUserIfLoggedIn(headers);
		if (user.name) {
			return onLoggedInAndOnboarded(user, headers);
		} else {
			return onLoggedInAndNotOnboarded(user, headers);
		}
	} catch (error: any) {
		Logger.error(error.message);
		return onLoggedOut();
	}
};
