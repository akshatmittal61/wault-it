import { http } from "@/client";
import { ApiRequests, ApiRes, ApiResponses, IUpdateUser } from "@/types";

export class UserApi {
	public static async updateProfile(body: IUpdateUser) {
		const response = await http.patch<
			ApiRes<ApiResponses.UpdateUser>,
			ApiRequests.UpdateUser
		>("/profile", body);
		return response.data;
	}
}
