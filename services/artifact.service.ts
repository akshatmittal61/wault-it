import { HTTP } from "@/constants";
import { ApiError } from "@/errors";
import { artifactRepo } from "@/repo";
import {
	CreateArtifactModel,
	IArtifact,
	IArtifactsBucket,
	ICreateArtifact,
	UpdateArtifact,
} from "@/types";
import { VaultService } from "./vault.service";
import { SafetyUtils, StringUtils } from "@/utils";

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
		body: ICreateArtifact,
		privateKey: string,
		userId: string
	) {
		const password = body.password;
		const encryptedPassword = VaultService.encrypt(password, privateKey);
		body.password = JSON.stringify(encryptedPassword);
		return await artifactRepo.createForUser(body, userId);
	}

	public static async updateArtifactForUser({
		artifactId,
		body,
		privateKey,
		userId,
	}: {
		artifactId: string;
		body: UpdateArtifact;
		privateKey: string;
		userId: string;
	}): Promise<IArtifact | null> {
		if (body.password) {
			VaultService.validateKey(privateKey);
			const password = body.password;
			const encryptedPassword = VaultService.encrypt(
				password,
				privateKey
			);
			body.password = JSON.stringify(encryptedPassword);
		}
		return await artifactRepo.updateForUser(
			{ id: artifactId },
			body,
			userId
		);
	}

	public static async deleteArtifactForUser({
		artifactId,
		userId,
	}: {
		artifactId: string;
		userId: string;
	}) {
		return await artifactRepo.removeForUser({ id: artifactId }, userId);
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
