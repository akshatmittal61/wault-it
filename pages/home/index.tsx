import { withAuthPage } from "@/client";
import { Home as Components, Placeholder, Service } from "@/components";
import styles from "@/styles/pages/Home.module.scss";
import { IUser } from "@/types";
import { CollectionUtils, StringUtils, stylesConfig } from "@/utils";
import React, { useState } from "react";
import { useArtifactsStore, useUiStore } from "@/store";
import { Loader } from "@/library";

const classes = stylesConfig(styles, "home");

type HomePageProps = { user: IUser };

const HomePage: React.FC<HomePageProps> = () => {
	const [openAddArtifactPopup, setOpenAddArtifactPopup] = useState(false);
	const [openImporterPopup, setOpenImporterPopup] = useState(false);

	const { isGettingAllServices, services, searchQuery } = useArtifactsStore({
		syncOnMount: true,
	});

	const { setHeaderContent } = useUiStore({
		onMount: () => {
			setHeaderContent(
				<Components.Head
					onAdd={() => setOpenAddArtifactPopup(true)}
					onImport={() => setOpenImporterPopup(true)}
				/>
			);
		},
		onUnmount: () => {
			setHeaderContent(null);
		},
	});

	return (
		<>
			<main id="home" className={classes("")}>
				{isGettingAllServices && CollectionUtils.isEmpty(services) ? (
					<Loader.Spinner />
				) : CollectionUtils.isNotEmpty(services) ? (
					<Components.Services />
				) : (
					<Placeholder
						title={(() => {
							if (StringUtils.isNotEmpty(searchQuery)) {
								if (searchQuery.length > 3) {
									return "No results for " + searchQuery;
								} else {
									return "Use more than 3 characters to search";
								}
							}
							return "No services found";
						})()}
						subtitle={
							StringUtils.isNotEmpty(searchQuery)
								? ""
								: "Add a service"
						}
						cta={(() => {
							if (StringUtils.isNotEmpty(searchQuery)) {
								return undefined;
							} else {
								return {
									label: "Add a service",
									action: () => setOpenAddArtifactPopup(true),
								};
							}
						})()}
					/>
				)}
			</main>
			{openImporterPopup ? (
				<Service.Importer
					onClose={() => setOpenImporterPopup(false)}
					onImport={() => {
						setOpenImporterPopup(false);
					}}
				/>
			) : null}
			{openAddArtifactPopup ? (
				<Service.AddArtifact
					onClose={() => setOpenAddArtifactPopup(false)}
					onAdd={() => {
						setOpenAddArtifactPopup(false);
					}}
				/>
			) : null}
		</>
	);
};

export default HomePage;

export const getServerSideProps = withAuthPage<HomePageProps>((user) => ({
	props: { user },
}));
