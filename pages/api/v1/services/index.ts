import { ArtifactController } from "@/controllers";
import { ApiRoute } from "@/server";

const apiRoute = new ApiRoute(
	{ GET: ArtifactController.getServicesForUser },
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
