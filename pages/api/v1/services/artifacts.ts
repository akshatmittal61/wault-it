import { ArtifactController } from "@/controllers";
import { ApiRoute } from "@/server";

const apiRoute = new ApiRoute(
	{ POST: ArtifactController.getArtifactsByService },
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
