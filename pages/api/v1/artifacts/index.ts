import { ArtifactController } from "@/controllers";
import { ApiRoute } from "@/server";

const apiRoute = new ApiRoute(
	{ GET: ArtifactController.getAllArtifacts },
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
