import { ArtifactController } from "@/controllers";
import { ApiRoute } from "@/server";

const apiRoute = new ApiRoute(
	{ POST: ArtifactController.searchByService },
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
