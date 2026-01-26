import { ArtifactController } from "@/controllers";
import { ApiRoute } from "@/server";

const apiRoute = new ApiRoute(
	{ POST: ArtifactController.importArtifactsFromCsv },
	{ db: true, auth: true, validatePrivateKey: true }
);

export default apiRoute.getHandler();
