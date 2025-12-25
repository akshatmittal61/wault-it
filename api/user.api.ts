import { http } from "@/client";
import { ApiRes, IUpdateUser, IUser } from "@/types";

export class UserApi {
	public static async updateProfile(
		body: IUpdateUser
	): Promise<ApiRes<IUser>> {
		const response = await http.patch("/profile", body);
		return response.data;
	}
}
