import { HTTP } from "@/constants";
import { ApiFailure, ApiSuccess } from "@/server";
import { ArtifactService } from "@/services";
import {
	ApiRequest,
	ApiRequests,
	ApiResponse,
	ApiResponses,
	CreateArtifactModel,
	UpdateArtifact,
} from "@/types";
import { getSearchParam, SafetyUtils, StringUtils } from "@/utils";

export class ArtifactController {
	public static async getAllArtifacts(
		req: ApiRequest<ApiRequests.GetAllArtifacts>,
		res: ApiResponse
	) {
		const userId = StringUtils.getNonEmptyString(req.user?.id);
		const buckets =
			await ArtifactService.getAllArtifactBucketsForUser(userId);
		return new ApiSuccess<ApiResponses.GetAllArtifacts>(res).send(buckets);
	}

	public static async getArtifactsByService(
		req: ApiRequest<ApiRequests.GetArtifactsForService>,
		res: ApiResponse
	) {
		const userId = StringUtils.getNonEmptyString(req.user?.id);
		const service = StringUtils.getNonEmptyString(req.body.service);
		const artifacts = await ArtifactService.getArtifactsByServiceForUser({
			service,
			userId,
		});
		return new ApiSuccess<ApiResponses.GetArtifactsForService>(res).send(
			artifacts
		);
	}

	public static async getArtifactById(
		req: ApiRequest<ApiRequests.GetArtifactById>,
		res: ApiResponse
	) {
		const userId = StringUtils.getNonEmptyString(req.user?.id);
		const artifactId = StringUtils.getNonEmptyString(
			getSearchParam(req.url, "id")
		);
		const artifact = await ArtifactService.getArtifactForUser({
			artifactId,
			userId,
		});
		if (SafetyUtils.isNonNull(artifact)) {
			return new ApiSuccess<ApiResponses.GetArtifactById>(res).send(
				artifact
			);
		} else {
			return new ApiFailure(res).send(
				"Artifact not found",
				HTTP.status.NOT_FOUND
			);
		}
	}

	public static async revealArtifact(
		req: ApiRequest<ApiRequests.RevealArtifact>,
		res: ApiResponse
	) {
		const userId = StringUtils.getNonEmptyString(req.user?.id);
		const artifactId = StringUtils.getNonEmptyString(
			getSearchParam(req.url, "id")
		);
		const privateKey = StringUtils.getNonEmptyString(req.body.privateKey);
		const artifact = await ArtifactService.revealArtifactForUser({
			artifactId,
			userId,
			privateKey,
		});
		return new ApiSuccess<ApiResponses.RevealArtifact>(res).send(artifact);
	}

	public static async createArtifact(
		req: ApiRequest<ApiRequests.CreateArtifact>,
		res: ApiResponse
	) {
		const userId = StringUtils.getNonEmptyString(req.user?.id);
		const service = StringUtils.getNonEmptyString(req.body.service);
		const identifier = StringUtils.getNonEmptyString(req.body.identifier);
		const password = StringUtils.getNonEmptyString(req.body.password);
		const comment = SafetyUtils.safeParse(
			StringUtils.getNonEmptyString,
			req.body.comment
		);
		const privateKey = StringUtils.getNonEmptyString(req.body.privateKey);
		const payload: CreateArtifactModel = {
			service,
			identifier,
			password,
			author: userId,
		};
		if (StringUtils.isNotEmpty(comment)) {
			payload.comment = comment;
		}
		const artifact = await ArtifactService.createNewArtifactForUser(
			payload,
			privateKey,
			userId
		);
		return new ApiSuccess<ApiResponses.CreateArtifact>(res)
			.status(HTTP.status.CREATED)
			.send(artifact);
	}

	public static async updateArtifact(
		req: ApiRequest<ApiRequests.UpdateArtifact>,
		res: ApiResponse
	) {
		const userId = StringUtils.getNonEmptyString(req.user?.id);
		const artifactId = StringUtils.getNonEmptyString(
			getSearchParam(req.url, "id")
		);
		const service = SafetyUtils.safeParse(
			StringUtils.getNonEmptyString,
			req.body.service
		);
		const identifier = SafetyUtils.safeParse(
			StringUtils.getNonEmptyString,
			req.body.identifier
		);
		const password = SafetyUtils.safeParse(
			StringUtils.getNonEmptyString,
			req.body.password
		);
		const privateKey = SafetyUtils.safeParse(
			StringUtils.getNonEmptyString,
			req.body.privateKey
		);
		const comment = SafetyUtils.safeParse(
			StringUtils.valueOf,
			req.body.comment
		);
		let payload: UpdateArtifact = {};
		if (
			(StringUtils.isEmpty(password) &&
				StringUtils.isNotEmpty(privateKey)) ||
			(StringUtils.isNotEmpty(password) &&
				StringUtils.isEmpty(privateKey))
		) {
			return new ApiFailure(res).send(
				"Password and private key must be updated together",
				HTTP.status.BAD_REQUEST
			);
		}
		if (
			StringUtils.isNotEmpty(password) &&
			StringUtils.isNotEmpty(privateKey)
		) {
			payload = { ...payload, password, privateKey };
		}
		if (StringUtils.isNotEmpty(service)) {
			payload.service = service;
		}
		if (StringUtils.isNotEmpty(identifier)) {
			payload.identifier = identifier;
		}
		if (SafetyUtils.isNonNull(comment)) {
			payload.comment = comment;
		}
		const artifact = await ArtifactService.updateArtifactForUser({
			artifactId,
			payload,
			userId,
		});
		return new ApiSuccess<ApiResponses.UpdateArtifact>(res).send(artifact);
	}

	public static async deleteArtifact(
		req: ApiRequest<ApiRequests.DeleteArtifact>,
		res: ApiResponse
	) {
		const userId = StringUtils.getNonEmptyString(req.user?.id);
		const artifactId = StringUtils.getNonEmptyString(
			getSearchParam(req.url, "id")
		);
		const artifact = await ArtifactService.deleteArtifactForUser({
			artifactId,
			userId,
		});
		return new ApiSuccess<ApiResponses.DeleteArtifact>(res).send(artifact);
	}

	public static async getServicesForUser(
		req: ApiRequest<ApiRequests.GetServicesForUser>,
		res: ApiResponse
	) {
		const userId = StringUtils.getNonEmptyString(req.user?.id);
		const services = await ArtifactService.getServicesForUser(userId);
		return new ApiSuccess<ApiResponses.GetServicesForUser>(res).send(
			services
		);
	}

	public static async searchByService(
		req: ApiRequest<ApiRequests.SearchByService>,
		res: ApiResponse
	) {
		const query = StringUtils.getNonEmptyString(req.body.query);
		const userId = StringUtils.getNonEmptyString(req.user?.id);
		const matchingServices = await ArtifactService.searchByServiceForUser(
			query,
			userId
		);
		return new ApiSuccess<ApiResponses.SearchByService>(res).send(
			matchingServices
		);
	}

	public static async importArtifactsFromCsv(
		req: ApiRequest<ApiRequests.ImportArtifactsFromCsv>,
		res: ApiResponse
	) {
		const userId = StringUtils.getNonEmptyString(req.user?.id);
		const privateKey = StringUtils.getNonEmptyString(req.body.privateKey);
		const services = await ArtifactService.importArtifactsFromCsvForUser(
			req.body.file,
			privateKey,
			userId
		);
		return new ApiSuccess<ApiResponses.ImportArtifactsFromCsv>(res).send(
			services
		);
	}

	public static async renameRoom(
		req: ApiRequest<ApiRequests.RenameRoom>,
		res: ApiResponse
	) {
		const userId = StringUtils.getNonEmptyString(req.user?.id);
		const { original, updated } = req.body;
		await ArtifactService.renameRoom({
			original,
			updated,
			userId,
		});
		return new ApiSuccess<ApiResponses.RenameRoom>(res).send();
	}
}
