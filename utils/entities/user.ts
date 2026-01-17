import { IUser } from "@/types";
import { BooleanUtils, SafetyUtils, StringUtils } from "@/utils";
import { fallbackAssets } from "@/constants";

export class UserUtils {
	public static isUserOnboarded(user: IUser | null) {
		if (SafetyUtils.isNonNull(user)) {
			return StringUtils.isNotEmpty(user.name);
		}
		return BooleanUtils.False.value;
	}

	public static getUserDetails(user: IUser): IUser {
		return {
			...user,
			avatar: user.avatar || fallbackAssets.avatar,
			name: user.name || user.email.split("@")[0],
		};
	}

	public static getUserAvatar(user: IUser): string {
		return user.avatar || fallbackAssets.avatar;
	}

	public static getNameOfUser(user: IUser): string {
		return user.name || user.email.split("@")[0];
	}

	public static getFirstNameOfUser(user: IUser): string {
		const fullName = UserUtils.getNameOfUser(user);
		return fullName.split(" ")[0];
	}
}
