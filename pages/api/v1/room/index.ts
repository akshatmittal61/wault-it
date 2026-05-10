import { ApiRoute } from "@/server";
import { ArtifactController } from "@/controllers";

const apiRoute = new ApiRoute(
	{ PATCH: ArtifactController.renameRoom },
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
