import { HTTP, regex } from "@/constants";
import { ApiError } from "@/errors";
import { Logger } from "@/log";
import { EncryptedData } from "@/types";
import { CollectionUtils } from "@/utils";
import crypto from "crypto";

export class VaultService {
	public static validateKey(key: string) {
		const errors: Array<string> = [];
		Logger.debug("In starting, Key: ", key, " | Errors: ", errors);
		if (!regex.key.test(key)) {
			if (key.length !== 32) {
				errors.push("Key must be 32 characters long");
			}
			if (!regex.hasUpperCase.test(key)) {
				errors.push("Key must contain at least one uppercase letter");
			}
			if (!regex.hasLowerCase.test(key)) {
				errors.push("Key must contain at least one lowercase letter");
			}
			if (!regex.hasNumber.test(key)) {
				errors.push("Key must contain at least one number");
			}
			if (!regex.hasSpecialChar.test(key)) {
				errors.push(
					"Key must contain at least one special character, !@#$%& and can't contain any other"
				);
			}
			if (regex.hasSpaces.test(key)) {
				errors.push("Key must not contain spaces");
			}
		}
		Logger.debug("In ending, Key: ", key, " | Errors: ", errors);
		if (CollectionUtils.isNotEmpty(errors)) {
			throw new ApiError(HTTP.status.BAD_REQUEST, errors.join(", "));
		}
		return true;
	}

	public static encrypt(password: string, privateKey: string): EncryptedData {
		try {
			VaultService.validateKey(privateKey);
			const iv = crypto.randomBytes(16); // Initialization vector
			const cipher = crypto.createCipheriv(
				"aes-256-cbc",
				Buffer.from(privateKey),
				iv
			);
			let encrypted = cipher.update(password, "utf-8", "hex");
			encrypted += cipher.final("hex");
			return {
				iv: iv.toString("hex"),
				data: encrypted,
			};
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}
			throw new ApiError(
				HTTP.status.INTERNAL_SERVER_ERROR,
				"Unable to process data"
			);
		}
	}

	public static decrypt(
		encryptedData: EncryptedData,
		privateKey: string
	): string {
		try {
			VaultService.validateKey(privateKey);
			const { iv, data } = encryptedData;
			const decipher = crypto.createDecipheriv(
				"aes-256-cbc",
				Buffer.from(privateKey),
				Buffer.from(iv, "hex")
			);
			let decrypted = decipher.update(data, "hex", "utf-8");
			decrypted += decipher.final("utf-8");
			return decrypted;
		} catch (error: any) {
			if (error instanceof ApiError) {
				throw error;
			}
			if (error?.message?.includes("bad decrypt")) {
				throw new ApiError(HTTP.status.BAD_REQUEST, "Invalid key");
			}
			throw new ApiError(
				HTTP.status.INTERNAL_SERVER_ERROR,
				"Unable to process data"
			);
		}
	}
}
