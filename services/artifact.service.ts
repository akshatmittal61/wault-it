import { HTTP } from "@/constants";
import { ApiError } from "@/errors";
import { artifactRepo } from "@/repo";
import { CreateArtifactModel, IArtifactsBucket, UpdateArtifact } from "@/types";
import { SafetyUtils, StringUtils } from "@/utils";
import { VaultService } from "./vault.service";

export class ArtifactService {
	public static async getAllArtifactBucketsForUser(userId: string) {
		const userArtifacts = await artifactRepo.findAllForUser(userId);
		const artifactsMap = new Map();
		// group artifacts by service
		for (const artifact of userArtifacts) {
			if (artifactsMap.has(artifact.service)) {
				artifactsMap.get(artifact.service).push(artifact);
			} else {
				artifactsMap.set(artifact.service, [artifact]);
			}
		}
		const artifactsBuckets: Array<IArtifactsBucket> = [];
		artifactsMap.entries().forEach(([service, artifacts]) => {
			artifactsBuckets.push({ service, artifacts });
		});
		return artifactsBuckets;
	}

	public static async getArtifactForUser({
		userId,
		artifactId,
	}: {
		userId: string;
		artifactId: string;
	}) {
		return await artifactRepo.findByIdForUser(artifactId, userId);
	}

	public static async getArtifactsByServiceForUser({
		service,
		userId,
	}: {
		service: string;
		userId: string;
	}) {
		const artifacts = await artifactRepo.findForUser({ service }, userId);
		return artifacts || [];
	}

	public static async revealArtifactForUser({
		artifactId,
		privateKey,
		userId,
	}: {
		artifactId: string;
		privateKey: string;
		userId: string;
	}) {
		const artifact = await artifactRepo.revealByIdForUser(
			artifactId,
			userId
		);
		if (!SafetyUtils.isNonNull(artifact)) {
			throw new ApiError(HTTP.status.NOT_FOUND, "Artifact not found");
		}
		const password = JSON.parse(artifact.password);
		artifact.password = VaultService.decrypt(password, privateKey);
		return artifact;
	}

	public static async createNewArtifactForUser(
		body: CreateArtifactModel,
		privateKey: string,
		userId: string
	) {
		const payload: CreateArtifactModel = {
			...body,
			author: userId,
		};
		const password = payload.password;
		const encryptedPassword = VaultService.encrypt(password, privateKey);
		payload.password = JSON.stringify(encryptedPassword);
		// for the same service and same identifier, multiple artifacts can't exists
		// for example, for google.com, a@b.c can only have one password
		const foundArtifact = await artifactRepo.findForUser(
			{ service: body.service, identifier: body.identifier },
			userId
		);
		if (SafetyUtils.isNonNull(foundArtifact)) {
			throw new ApiError(
				HTTP.status.BAD_REQUEST,
				"Artifact already exists"
			);
		}
		return await artifactRepo.createForUser(payload);
	}

	public static async updateArtifactForUser({
		artifactId,
		payload,
		userId,
	}: {
		artifactId: string;
		payload: UpdateArtifact;
		userId: string;
	}) {
		if (
			StringUtils.isNotEmpty(payload.password) &&
			StringUtils.isNotEmpty(payload.privateKey)
		) {
			VaultService.validateKey(payload.privateKey);
			const encryptedPassword = VaultService.encrypt(
				payload.password,
				payload.privateKey
			);
			payload.password = JSON.stringify(encryptedPassword);
		}
		const updatedArtifact = await artifactRepo.updateForUser(
			{ id: artifactId },
			payload,
			userId
		);
		if (SafetyUtils.isNonNull(updatedArtifact)) {
			return updatedArtifact;
		} else {
			throw new ApiError(HTTP.status.NOT_FOUND, "Artifact not found");
		}
	}

	public static async deleteArtifactForUser({
		artifactId,
		userId,
	}: {
		artifactId: string;
		userId: string;
	}) {
		const deletedArtifact = await artifactRepo.removeForUser(
			{ id: artifactId },
			userId
		);
		if (SafetyUtils.isNonNull(deletedArtifact)) {
			return deletedArtifact;
		} else {
			throw new ApiError(HTTP.status.NOT_FOUND, "Artifact not found");
		}
	}

	public static async getServicesForUser(userId: string) {
		return await artifactRepo.getServicesForUser(userId);
	}

	public static async searchByServiceForUser(query: string, userId: string) {
		if (StringUtils.isEmpty(query) || query.length < 3) {
			throw new ApiError(
				HTTP.status.BAD_REQUEST,
				"Please enter at least 3 characters to search by service"
			);
		}
		query = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		return await artifactRepo.searchByServiceForUser(query, userId);
	}

	public static async importArtifactsFromCsvForUser(
		dataUri: string,
		privateKey: string,
		userId: string
	) {
		// parse csv from data uri
		const base64Data = dataUri.split(";base64,").pop();
		if (!base64Data) {
			throw new ApiError(HTTP.status.BAD_REQUEST, "Invalid data URI");
		}
		const fileBuffer = Buffer.from(base64Data, "base64");
		const csvData = fileBuffer.toString("utf-8");
		const lines = csvData.split("\n");
		const headers = lines[0].split(",");
		const recordsFromCsvToJson = [];
		for (let i = 1; i < lines.length; i++) {
			const row = lines[i].split(",");
			const artifact: any = {};
			for (let j = 0; j < headers.length; j++) {
				artifact[headers[j]] = row[j];
			}
			recordsFromCsvToJson.push(artifact);
		}
		const artifacts: Array<CreateArtifactModel> = recordsFromCsvToJson
			.filter(
				(record) =>
					record.password.length > 0 && record.username.length > 0
			)
			.map((record) => {
				return {
					service: record.name,
					identifier: record.username,
					comment: record.note,
					password: JSON.stringify(
						VaultService.encrypt(record.password, privateKey)
					),
					author: userId,
				};
			});
		await artifactRepo.bulkCreateForUser(artifacts, userId);
		return ArtifactService.getServicesForUser(userId);
	}
}
