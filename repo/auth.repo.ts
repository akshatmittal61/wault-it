import { BaseRepo } from "./base";
import { AuthMapping, IAuthMapping } from "@/types";
import { AuthMappingModel } from "@/models";

class AuthRepo extends BaseRepo<AuthMapping, IAuthMapping> {
	protected model = AuthMappingModel;
}

export const authRepo = AuthRepo.getInstance<AuthRepo>();
