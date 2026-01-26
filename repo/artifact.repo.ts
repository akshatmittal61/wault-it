import { FilterQuery } from "@/db";
import { InaccessibleMethodError } from "@/errors";
import { ArtifactModel } from "@/models";
import {
	Artifact,
	CreateArtifactModel,
	IArtifact,
	IConcealedArtifact,
	IRevealedArtifact,
	UpdateArtifact,
} from "@/types";
import { CollectionUtils, omitKeys, SafetyUtils } from "@/utils";
import { BaseRepo } from "./base";

class ArtifactRepo extends BaseRepo<Artifact, IArtifact> {
	protected model = ArtifactModel;

	public parser(input: Artifact | null): IConcealedArtifact | null {
		const res = super.parser(input);
		if (!res) return null;
		return omitKeys(res, ["password", "author"]);
	}

	public parseRevealed(input: Artifact | null): IRevealedArtifact | null {
		const res = super.parser(input);
		if (!res) return null;
		return omitKeys(res, ["author"]);
	}

	/**
	 * @throws InaccessibleMethodError
	 * @deprecated
	 * Please use `findOneForUser` instead.
	 */
	public async findOne(): Promise<IArtifact | null> {
		throw new InaccessibleMethodError("findOne", "findOneForUser");
	}

	/**
	 * @throws InaccessibleMethodError.
	 * @deprecated
	 * Please use `findByIdForUser` instead.
	 * Attempts to find an artifact but will throw an error.
	 */
	public async findById(_: string): Promise<IArtifact | null> {
		throw new InaccessibleMethodError("findById", "findByIdForUser");
	}

	/**
	 * @throws InaccessibleMethodError.
	 * @deprecated
	 * Please use `findForUser` instead.
	 * Attempts to find artifacts but will throw an error.
	 */
	public async find(): Promise<Array<IArtifact> | null> {
		throw new InaccessibleMethodError("find", "findForUser");
	}

	/**
	 * @throws InaccessibleMethodError
	 * @deprecated
	 * This method is deprecated. Please use `findAllForUser` instead.
	 * Attempts to find all artifacts but will throw an error.
	 */
	public async findAll(): Promise<Array<IArtifact>> {
		throw new InaccessibleMethodError("findAll", "findAllForUser");
	}

	/**
	 * @throws InaccessibleMethodError
	 * @deprecated
	 * This method is deprecated. Please use `createForUser` instead.
	 * Attempts to create an artifact but will throw an error.
	 */
	public async create(): Promise<IArtifact> {
		throw new InaccessibleMethodError("create", "createForUser");
	}

	/**
	 * @throws InaccessibleMethodError
	 * @deprecated
	 * This method is deprecated. Please use `updateForUser` instead.
	 * Attempts to update an artifact but will throw an error.
	 */
	public async update(): Promise<IArtifact | null> {
		throw new InaccessibleMethodError("update", "updateForUser");
	}

	/**
	 * @throws InaccessibleMethodError
	 * @deprecated
	 * This method is deprecated. Please use `removeForUser` instead.
	 * Attempts to remove an artifact but will throw an error.
	 */
	public async remove(): Promise<IArtifact | null> {
		throw new InaccessibleMethodError("remove", "removeForUser");
	}

	/**
	 * Finds a single artifact for a specific user based on the provided query.
	 * The method filters artifacts by the user ID and excludes the password field from the result.
	 *
	 * @param query - The filter query to find the artifact.
	 * @param userId - The ID of the user for whom the artifact is being retrieved.
	 * @returns The artifact object without the password if found, otherwise null.
	 */
	public async findOneForUser(
		query: FilterQuery<Artifact>,
		userId: string
	): Promise<IArtifact | null> {
		const res = await this.model
			.findOne<Artifact>({ ...query, author: userId })
			.select("-password");
		return this.parser(res);
	}

	/**
	 * Finds a single artifact by its ID for a specific user.
	 * The method filters artifacts by the user ID and excludes the password field from the result.
	 *
	 * @param id - The ID of the artifact to retrieve.
	 * @param userId - The ID of the user for whom the artifact is being retrieved.
	 * @returns The artifact object without the password if found, otherwise null.
	 */
	public async findByIdForUser(
		id: string,
		userId: string
	): Promise<IConcealedArtifact | null> {
		return await this.model
			.findOne<Artifact>({ _id: id, author: userId })
			.select("-password -author")
			.then(this.parser)
			.catch((error: any) => {
				if (error.kind === "ObjectId") return null;
				throw error;
			});
	}

	public async revealByIdForUser(
		id: string,
		userId: string
	): Promise<IRevealedArtifact | null> {
		return await this.model
			.findOne<Artifact>({ _id: id, author: userId })
			.then(this.parseRevealed)
			.catch((error: any) => {
				if (error.kind === "ObjectId") return null;
				throw error;
			});
	}

	/**
	 * Finds all artifacts for a specific user based on the provided query.
	 * The method filters artifacts by the user ID and excludes the password and author fields from the result.
	 *
	 * @param query - The filter query to find the artifacts.
	 * @param userId - The ID of the user for whom the artifacts are being retrieved.
	 * @returns An array of artifact objects without the password and author if found, otherwise null.
	 */
	public async findForUser(
		query: FilterQuery<Artifact>,
		userId: string
	): Promise<Array<IConcealedArtifact> | null> {
		const res = await this.model
			.find<Artifact>({ ...query, author: userId })
			.select("-password -author");
		const parsedRes = res.map(this.parser).filter(SafetyUtils.isNonNull);
		if (CollectionUtils.isEmpty(parsedRes)) return null;
		return parsedRes;
	}

	/**
	 * Finds all artifacts for a specific user.
	 * The method filters artifacts by the user ID, excludes the password and author fields from the result, and sorts them by creation time in descending order.
	 *
	 * @param userId - The ID of the user for whom the artifacts are being retrieved.
	 * @returns An array of artifact objects without the password and author if found, otherwise an empty array.
	 */
	public async findAllForUser(
		userId: string
	): Promise<Array<IConcealedArtifact>> {
		const res = await this.model
			.find<Artifact>({ author: userId })
			.select("-password -author")
			.sort({ createdAt: -1 });
		const parsedRes = res.map(this.parser).filter((obj) => obj != null);
		if (parsedRes.length > 0) return parsedRes;
		return [];
	}

	/**
	 * Creates a new artifact in the database.
	 *
	 * The method takes a CreateModel<Artifact> object as input, inserts it into the database,
	 * and returns the created artifact object after parsing. It ensures that the returned
	 * artifact does not contain any null values.
	 *
	 * @param body - The artifact creation data.
	 * @param userId - The ID of the user creating the artifact.
	 * @returns The created artifact object.
	 */
	public async createForUser(
		body: CreateArtifactModel
	): Promise<IConcealedArtifact> {
		const res = await this.model.create(body);
		return SafetyUtils.getNonNullValue(this.parser(res));
	}

	/**
	 * Updates an artifact for a specific user.
	 *
	 * The method applies the given update to an artifact that matches the provided query,
	 * ensuring that the artifact belongs to the specified user. It excludes the password
	 * and author fields from the result.
	 *
	 * @param query - The filter query to identify the artifact to be updated.
	 * @param update - The update data to be applied to the artifact.
	 * @param userId - The ID of the user, ensuring the artifact belongs to them.
	 * @returns The updated artifact object without the password and author fields, if found; otherwise, null.
	 */
	public async updateForUser(
		query: FilterQuery<Artifact>,
		update: UpdateArtifact,
		userId: string
	): Promise<IConcealedArtifact | null> {
		const filter = query.id
			? { _id: query.id, author: userId }
			: { ...query, author: userId };
		const res = await this.model
			.findOneAndUpdate<Artifact>(filter, update, { new: true })
			.select("-password -author");
		return this.parser(res);
	}

	/**
	 * Deletes an artifact for a specific user.
	 *
	 * The method removes an artifact that matches the provided query, ensuring that the artifact
	 * belongs to the specified user. It excludes the password and author fields from the result.
	 *
	 * @param query - The filter query to identify the artifact to be removed.
	 * @param userId - The ID of the user, ensuring the artifact belongs to them.
	 * @returns The removed artifact object without the password and author fields, if found; otherwise, null.
	 */
	public async removeForUser(
		query: FilterQuery<Artifact>,
		userId: string
	): Promise<IConcealedArtifact | null> {
		const filter = query.id
			? { _id: query.id, author: userId }
			: { ...query, author: userId };
		const res = await this.model
			.findOneAndDelete<Artifact>(filter)
			.select("-password -author");
		return this.parser(res);
	}

	public async getServicesForUser(userId: string) {
		return this.model
			.find<Artifact>({ author: userId })
			.distinct("service");
	}

	public async searchByServiceForUser(
		query: string,
		userId: string
	): Promise<Array<string>> {
		return this.model
			.find<Artifact>({
				service: { $regex: query, $options: "i" },
				author: userId,
			})
			.distinct("service");
	}

	public async bulkCreateForUser(
		body: Array<CreateArtifactModel>,
		userId: string
	): Promise<Array<IArtifact>> {
		const payload: Array<CreateArtifactModel> = body.map((b) => ({
			...b,
			author: userId,
		}));
		const res = await this.model.insertMany<CreateArtifactModel>(payload);
		const populatedRes = await Promise.all(
			res.map((r) => r.populate<Artifact>("author"))
		);
		const parsedRes = populatedRes
			.map(this.parser)
			.filter(SafetyUtils.isNonNull);
		if (parsedRes.length > 0) return parsedRes;
		return [];
	}
}

export const artifactRepo = ArtifactRepo.getInstance<ArtifactRepo>();
