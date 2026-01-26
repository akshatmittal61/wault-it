import { http } from "@/client";
import { ApiRequests, ApiRes, ApiResponses, IUser } from "@/types";

export class AuthApi {
	public static async verifyUserIfLoggedIn(headers?: any) {
		const response = await http.get<ApiRes<ApiResponses.VerifyUser>>(
			"/auth/verify",
			{ headers }
		);
		return response.data;
	}

	public static async logout() {
		const res = await http.get<ApiRes<ApiResponses.Logout>>("/auth/logout");
		return res.data;
	}

	/**
	 * Verifies the authentication sign-in process using the code received from the OAuth provider.
	 *
	 * @param {string} code - The authentication code to verify.
	 * @return {Promise<ApiRes<string>>} - A Promise that resolves to the email of the authenticated user.
	 */
	public static async verifyOAuthSignIn(
		code: string
	): Promise<ApiRes<string>> {
		const res = await http.post<
			ApiRes<ApiResponses.VerifyGoogleOAuth>,
			ApiRequests.VerifyGoogleOAuth
		>("/oauth/google/verify", { code });
		return res.data;
	}

	/**
	 * Continues the authentication sign-in process using the email of the authenticated user.
	 *
	 * @param {string} token - The email of the authenticated user.
	 * @return {Promise<ApiRes<IUser>>} - A Promise that resolves to the authenticated user.
	 */
	public static async continueOAuthWithGoogle(
		token: string
	): Promise<ApiRes<IUser>> {
		const res = await http.post<
			ApiRes<ApiResponses.ContinueGoogleOAuth>,
			ApiRequests.ContinueGoogleOAuth
		>("/oauth/google/continue", { token });
		return res.data;
	}
}
