import { HTTP } from "@/constants";
import { ApiError } from "@/errors";
import { userRepo } from "@/repo";
import { CreateModel, IUser, IUpdateUser, User } from "@/types";
import { CollectionUtils, SafetyUtils, StringUtils } from "@/utils";
import { CacheService } from "./cache.service";

export class UserService {
	public static async getAllUsers(): Promise<Array<IUser>> {
		return await userRepo.findAll();
	}

	public static async getUserById(id: string): Promise<IUser | null> {
		return await CacheService.fetchUser({ id }, () =>
			userRepo.findById(id)
		);
	}

	public static async findOrCreateUser(
		body: CreateModel<User>
	): Promise<{ user: IUser; isNew: boolean }> {
		const email = StringUtils.getNonEmptyString(body.email);
		const foundUser = await UserService.getUserByEmail(email);
		if (foundUser) {
			return { user: foundUser, isNew: false };
		}
		const createdUser = await userRepo.create(body);
		CacheService.setUser({ email }, createdUser);
		return { user: createdUser, isNew: true };
	}

	public static async getUsersMapForUserIds(
		userIds: string[]
	): Promise<Map<string, IUser>> {
		const res = await userRepo.find({ _id: { $in: userIds } });
		if (CollectionUtils.isEmpty(res)) return new Map();
		return new Map<string, IUser>(res.map((user) => [user.id, user]));
	}

	public static async getUserByEmail(email: string): Promise<IUser | null> {
		try {
			return await CacheService.fetchUser({ email }, () =>
				userRepo.findOne({ email })
			);
		} catch {
			return null;
		}
	}

	public static async getUsersByEmails(
		emails: string[]
	): Promise<Array<IUser | null>> {
		// search by email, if the user is found, insert user in array,
		// else insert null in its place in array
		const users = await userRepo.find({ email: { $in: emails } });
		if (CollectionUtils.isEmpty(users)) return emails.map(() => null);
		const usersMap = new Map<string, IUser>(
			users.map((user) => [user.email, user])
		);
		return emails.map((email) => usersMap.get(email) || null);
	}

	public static async searchByEmail(
		emailQuery: string
	): Promise<Array<IUser>> {
		if (StringUtils.isEmpty(emailQuery)) {
			throw new ApiError(
				HTTP.status.BAD_REQUEST,
				"Email query is required"
			);
		}
		if (emailQuery.length < 3) {
			throw new ApiError(
				HTTP.status.BAD_REQUEST,
				"Email query too short"
			);
		}
		const query = emailQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const res = await userRepo.find({
			email: { $regex: query, $options: "i" },
		});
		if (CollectionUtils.isEmpty(res)) return CollectionUtils.EMPTY;
		return res;
	}

	public static async updateUserDetails(
		id: string,
		update: IUpdateUser
	): Promise<IUser> {
		const foundUser = await UserService.getUserById(id);
		if (!SafetyUtils.isNonNull(foundUser)) {
			throw new ApiError(HTTP.status.NOT_FOUND, "User not found");
		}
		const keysToUpdate = ["name", "phone", "avatar"];
		if (Object.keys(update).length == 0) {
			throw new ApiError(
				HTTP.status.BAD_REQUEST,
				"There is nothing to update"
			);
		}
		const updatedBody: any = {};
		Object.keys(update).forEach((key) => {
			if (keysToUpdate.includes(key)) {
				if (
					((update as any)[key] === null ||
						(update as any)[key] === undefined ||
						(update as any)[key] === "") &&
					((foundUser as any)[key] === null ||
						(foundUser as any)[key] === undefined ||
						(foundUser as any)[key] === "")
				) {
					return;
				} else if ((update as any)[key] !== (foundUser as any)[key]) {
					updatedBody[key] = (update as any)[key];
				} else if (!(foundUser as any)[key]) {
					updatedBody[key] = (update as any)[key];
				}
			}
		});
		if (StringUtils.isNotEmpty(updatedBody.phone)) {
			const userWithPhoneNo = await userRepo.findOne({
				phone: updatedBody.phone,
			});
			if (SafetyUtils.isNonNull(userWithPhoneNo)) {
				throw new ApiError(
					HTTP.status.CONFLICT,
					"Phone number already in use"
				);
			}
		}
		const updatedUser = await userRepo.update({ id }, updatedBody);
		if (!SafetyUtils.isNonNull(updatedUser)) {
			throw new ApiError(HTTP.status.NOT_FOUND, "User not found");
		}
		CacheService.invalidateUser({ id });
		CacheService.invalidateUser({ email: foundUser.email });
		return updatedUser;
	}
}
