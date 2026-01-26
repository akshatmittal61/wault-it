import {
	ApiRequest,
	ApiRequests,
	ApiResponse,
	ApiResponses,
	IUpdateUser,
} from "@/types";
import { SafetyUtils, StringUtils } from "@/utils";
import { UserService } from "@/services";
import { ApiSuccess } from "@/server";

export class UserController {
	public static async updateUserProfile(
		req: ApiRequest<ApiRequests.UpdateUser>,
		res: ApiResponse
	) {
		const userId = StringUtils.getNonEmptyString(req.user?.id);
		const name = SafetyUtils.safeParse(StringUtils.valueOf, req.body.name);
		const avatar = SafetyUtils.safeParse(
			StringUtils.valueOf,
			req.body.avatar
		);
		const body: IUpdateUser = {};
		if (StringUtils.isNotEmpty(name)) body["name"] = name;
		if (StringUtils.isNotEmpty(avatar)) body["avatar"] = avatar;
		const user = await UserService.updateUserDetails(userId, body);
		return new ApiSuccess<ApiResponses.UpdateUser>(res).send(user);
	}
}
