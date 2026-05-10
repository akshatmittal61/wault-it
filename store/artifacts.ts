import { ArtifactsApi } from "@/api";
import { useHttpClient } from "@/hooks";
import { createBaseStore, Getter, Setter } from "@/store/base";
import {
	IArtifactsBucket,
	IConcealedArtifact,
	ICreateArtifact,
	IUpdateArtifact,
} from "@/types";
import { BooleanUtils, Notify, StringUtils } from "@/utils";
import { useEffect } from "react";

type State = {
	services: Array<string>;
	artifacts: Array<IConcealedArtifact>;
	searchQuery: string;
	isSyncing: boolean;
};

type Action = {
	getServices: Getter<State, "services">;
	getArtifacts: Getter<State, "artifacts">;
	getSearchQuery: Getter<State, "searchQuery">;
	getIsSyncing: Getter<State, "isSyncing">;
	setServices: Setter<State, "services">;
	setArtifacts: Setter<State, "artifacts">;
	setSearchQuery: Setter<State, "searchQuery">;
	setIsSyncing: Setter<State, "isSyncing">;
};

type Options = {
	syncOnMount?: boolean;
};

type Extras = {
	// store sync util
	sync: () => Promise<void>;
	// loading states
	isGettingAllServices: boolean;
	isGettingAllArtifacts: boolean;
	isCreatingArtifact: boolean;
	isUpdatingArtifact: boolean;
	isDeletingArtifact: boolean;
	isSearchingServices: boolean;
	isRenamingRoom: boolean;
	// handlers
	getAllServices: () => Promise<Array<string>>;
	getAllArtifacts: () => Promise<Array<IArtifactsBucket>>;
	createArtifact: (_artifact: ICreateArtifact) => Promise<IConcealedArtifact>;
	updateArtifact: (
		_id: string,
		_artifact: IUpdateArtifact
	) => Promise<IConcealedArtifact>;
	deleteArtifact: (_id: string) => Promise<IConcealedArtifact>;
	searchForServices: (_query: string) => Promise<Array<string>>;
	renameRoom: (_original: string, _updated: string) => Promise<null>;
};

export const useArtifactsStore = createBaseStore<
	State,
	Action,
	Options,
	Extras
>({
	createState: (set, get) => ({
		services: [],
		artifacts: [],
		searchQuery: StringUtils.EMPTY,
		isSyncing: BooleanUtils.False.value,
		getServices: () => get().services,
		getArtifacts: () => get().artifacts,
		getSearchQuery: () => get().searchQuery,
		getIsSyncing: () => get().isSyncing,
		setServices: (services: Array<string>) => set({ services }),
		setArtifacts: (artifacts: Array<IConcealedArtifact>) => {
			const allServices = artifacts.map((artifact) => artifact.service);
			const distinctServices = Array.from(new Set(allServices));
			// sort them alphatebically
			const sortedServices = distinctServices.sort();
			set({ artifacts, services: sortedServices });
		},
		setSearchQuery: (query: string) => set({ searchQuery: query }),
		setIsSyncing: (state: boolean) => set({ isSyncing: state }),
	}),
	useSetup: ({ store, options }) => {
		const { trigger: getAllServices, loading: isGettingAllServices } =
			useHttpClient({
				trigger: ArtifactsApi.getAllServices,
				onSuccess: store.getState().setServices,
				onError: Notify.error,
			});

		const { trigger: getAllArtifacts, loading: isGettingAllArtifacts } =
			useHttpClient({
				trigger: ArtifactsApi.getAllArtifacts,
				onSuccess: (buckets) => {
					const artifacts = buckets.flatMap(
						(bucket) => bucket.artifacts
					);
					store.getState().setArtifacts(artifacts);
				},
				onError: Notify.error,
			});

		const sync = async () => {
			store.getState().setIsSyncing(true);
			await Promise.all([getAllServices(), getAllArtifacts()]);
			store.getState().setIsSyncing(false);
		};

		const { trigger: createArtifact, loading: isCreatingArtifact } =
			useHttpClient({
				trigger: ArtifactsApi.createArtifact,
				onSuccess: (createdArtifact) => {
					store
						.getState()
						.setArtifacts([
							...store.getState().getArtifacts(),
							createdArtifact,
						]);
				},
				onError: Notify.error,
			});

		const { trigger: updateArtifact, loading: isUpdatingArtifact } =
			useHttpClient({
				trigger: ArtifactsApi.updateArtifact,
				onSuccess: (updatedArtifact) => {
					const originalArtifacts = store.getState().getArtifacts();
					const artifactsToSet = originalArtifacts.map((old) => {
						if (StringUtils.equals(old.id, updatedArtifact.id)) {
							return updatedArtifact;
						} else {
							return old;
						}
					});
					store.getState().setArtifacts(artifactsToSet);
				},
				onError: Notify.error,
			});

		const { trigger: deleteArtifact, loading: isDeletingArtifact } =
			useHttpClient({
				trigger: ArtifactsApi.deleteArtifact,
				onSuccess: (deletedArtifact) => {
					const originalArtifacts = store.getState().getArtifacts();
					const artifactsToSet = originalArtifacts.filter(
						(old) => !StringUtils.equals(old.id, deletedArtifact.id)
					);
					store.getState().setArtifacts(artifactsToSet);
				},
				onError: Notify.error,
			});

		const { trigger: searchForServices, loading: isSearchingServices } =
			useHttpClient({
				trigger: ArtifactsApi.searchForServices,
				onSuccess: store.getState().setServices,
				onError: Notify.error,
			});

		const {
			trigger: importArtifactsFromCsv,
			loading: isImportingArtifactsFromCsv,
		} = useHttpClient({
			trigger: ArtifactsApi.importArtifactsFromCsv,
			onSuccess: () => sync(),
			onError: Notify.error,
		});

		const { trigger: renameRoom, loading: isRenamingRoom } = useHttpClient({
			trigger: ArtifactsApi.renameRoom,
			onSuccess: () => sync(),
			onError: Notify.error,
		});

		useEffect(() => {
			if (BooleanUtils.True.equals(options.syncOnMount)) {
				void sync();
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [options.syncOnMount]);

		return {
			sync,
			isGettingAllServices,
			isGettingAllArtifacts,
			isCreatingArtifact,
			isUpdatingArtifact,
			isDeletingArtifact,
			isSearchingServices,
			isImportingArtifactsFromCsv,
			isRenamingRoom,
			getAllServices,
			getAllArtifacts,
			createArtifact,
			updateArtifact,
			deleteArtifact,
			searchForServices,
			importArtifactsFromCsv,
			renameRoom,
		};
	},
});
