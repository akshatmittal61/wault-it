import { withAuthPage } from "@/client";
import { Home as Components, Placeholder, Service } from "@/components";
import { Page, ProtectedPageProps } from "@/layouts";
import { Loader } from "@/library";
import { useArtifactsStore, useAppStore } from "@/store";
import styles from "@/styles/pages/Home.module.scss";
import { CollectionUtils, StringUtils, stylesConfig } from "@/utils";
import React, { useState } from "react";

const classes = stylesConfig(styles, "home");

type HomePageProps = ProtectedPageProps;

const HomePage: React.FC<HomePageProps> = () => {
	const [openAddArtifactPopup, setOpenAddArtifactPopup] = useState(false);
	const [openImporterPopup, setOpenImporterPopup] = useState(false);

	const { isGettingAllServices, services, searchQuery } = useArtifactsStore({
		syncOnMount: true,
	});

	const { setHeaderContent } = useAppStore({
		onMount: () => {
			setHeaderContent(
				<Components.Head
					onAdd={() => setOpenAddArtifactPopup(true)}
					onImport={() => setOpenImporterPopup(true)}
					enableSearch={true}
				/>
			);
		},
		onUnmount: () => {
			setHeaderContent(null);
		},
	});

	return (
		<>
			<Page id="home" className={classes("")}>
				{CollectionUtils.isNotEmpty(services) ? (
					<Components.Services />
				) : isGettingAllServices ? (
					<Loader.Spinner />
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
			</Page>
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
					onAdd={() => setOpenAddArtifactPopup(false)}
					onClose={() => setOpenAddArtifactPopup(false)}
				/>
			) : null}
		</>
	);
};

export default HomePage;

export const getServerSideProps = withAuthPage<HomePageProps>((user) => ({
	props: { user },
}));
