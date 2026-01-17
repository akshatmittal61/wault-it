import { AuthApi } from "@/api";
import { redirectToLogin } from "@/constants";
import { IUser, ServerSideAuthInterceptor, ServerSideResult } from "@/types";
import { UserUtils } from "@/utils";
import { GetServerSidePropsContext } from "next";

export const authRouterInterceptor: ServerSideAuthInterceptor = async (
	context,
	actions
) => {
	const { req } = context;
	const cookies = req.cookies;
	if (!cookies.accessToken || !cookies.refreshToken) {
		return actions.onLoggedOut();
	}
	try {
		const headers = { cookie: req.headers.cookie };
		const user = await AuthApi.verifyUserIfLoggedIn(headers).then(
			(res) => res.data
		);
		if ("onLoggedIn" in actions) {
			return actions.onLoggedIn(user, headers);
		} else {
			if (UserUtils.isUserOnboarded(user)) {
				return actions.onLoggedInAndOnboarded(user, headers);
			} else {
				return actions.onLoggedInAndNotOnboarded(user, headers);
			}
		}
	} catch (error: any) {
		return actions.onLoggedOut();
	}
};

export const withAuthPage = <T = any>(
	handler: (
		_user: IUser,
		_context: GetServerSidePropsContext
	) => ServerSideResult<T> | Promise<ServerSideResult<T>>
) => {
	return async (context: GetServerSidePropsContext) =>
		authRouterInterceptor<ServerSideResult<T>>(context, {
			onLoggedIn: (user) => handler(user, context),
			onLoggedOut: () => ({
				redirect: {
					destination: redirectToLogin(context.req.url),
					permanent: false,
				},
			}),
		});
};
