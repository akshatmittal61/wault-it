import { http } from "@/client";
import { ApiRequests, ApiRes, ApiResponses, IUpdateUser, IUser } from "@/types";

export class UserApi {
	public static async updateProfile(
		body: IUpdateUser
	): Promise<ApiRes<IUser>> {
		const response = await http.patch<
			ApiRes<ApiResponses.UpdateUser>,
			ApiRequests.UpdateUser
		>("/profile", body);
		return response.data;
	}
}
