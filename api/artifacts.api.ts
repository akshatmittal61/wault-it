import { http } from "@/client";
import {
	ApiRequests,
	ApiRes,
	ApiResponses,
	ICreateArtifact,
	IUpdateArtifact,
} from "@/types";

export class ArtifactsApi {
	public static async getAllServices(headers?: any) {
		const response = await http.get<
			ApiRes<ApiResponses.GetServicesForUser>
		>("/services", { headers });
		return response.data;
	}

	public static async getAllArtifacts(headers?: any) {
		const response = await http.get<ApiRes<ApiResponses.GetAllArtifacts>>(
			"/artifacts",
			{ headers }
		);
		return response.data;
	}

	public static async getArtifactsForService(service: string, headers?: any) {
		const response = await http.post<
			ApiRes<ApiResponses.GetArtifactsForService>,
			ApiRequests.GetArtifactsForService
		>("/services/artifacts", { service }, { headers });
		return response.data;
	}

	public static async getRevealedArtifact(
		{ artifactId, privateKey }: { artifactId: string; privateKey: string },
		headers?: any
	) {
		const response = await http.post<
			ApiRes<ApiResponses.RevealArtifact>,
			ApiRequests.RevealArtifact
		>(`/artifact/reveal?id=${artifactId}`, { privateKey }, { headers });
		return response.data;
	}

	public static async searchForServices(query: string) {
		const res = await http.post<
			ApiRes<ApiResponses.SearchByService>,
			ApiRequests.SearchByService
		>("/services/search", { query });
		return res.data;
	}

	public static async createArtifact(
		artifact: ICreateArtifact,
		headers?: any
	) {
		const response = await http.post<
			ApiRes<ApiResponses.CreateArtifact>,
			ApiRequests.CreateArtifact
		>("/artifact", artifact, { headers });
		return response.data;
	}

	public static async updateArtifact(
		id: string,
		artifact: IUpdateArtifact,
		headers?: any
	) {
		const response = await http.patch<
			ApiRes<ApiResponses.UpdateArtifact>,
			ApiRequests.UpdateArtifact
		>(`/artifact?id=${id}`, artifact, { headers });
		return response.data;
	}

	public static async deleteArtifact(id: string, headers?: any) {
		const response = await http.delete<
			ApiRes<ApiResponses.DeleteArtifact>,
			ApiRequests.DeleteArtifact
		>(`/artifact?id=${id}`, { headers });
		return response.data;
	}

	public static async importArtifactsFromCsv(
		dataUri: string,
		privateKey: string,
		headers?: any
	) {
		const response = await http.post<
			ApiRes<ApiResponses.ImportArtifactsFromCsv>,
			ApiRequests.ImportArtifactsFromCsv
		>("/artifacts/import", { file: dataUri, privateKey }, { headers });
		return response.data;
	}
}
