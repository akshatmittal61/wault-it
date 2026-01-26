import { ArtifactController } from "@/controllers";
import { ApiRoute, ServerMiddleware } from "@/server";

const apiRoute = new ApiRoute(
	{
		GET: ArtifactController.getArtifactById,
		POST: ServerMiddleware.validatePrivateKey(
			ArtifactController.createArtifact
		),
		PATCH: ArtifactController.updateArtifact,
		DELETE: ArtifactController.deleteArtifact,
	},
	{ db: true, auth: true }
);

export default apiRoute.getHandler();
