import { ArtifactController } from "@/controllers";
import { ApiRoute } from "@/server";

const apiRoute = new ApiRoute(
	{ POST: ArtifactController.revealArtifact },
	{ db: true, auth: true, validatePrivateKey: true }
);

export default apiRoute.getHandler();
