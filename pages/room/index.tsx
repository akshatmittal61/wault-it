import { ArtifactsApi } from "@/api";
import { withAuthPage } from "@/client";
import { Home as Components, Room, Service } from "@/components";
import { navigation } from "@/constants";
import { useHttpClient } from "@/hooks";
import { Masonry, Page } from "@/layouts";
import { Loader, Typography } from "@/library";
import { useAppStore, useArtifactsStore, useHeader } from "@/store";
import styles from "@/styles/pages/Room.module.scss";
import { IUser } from "@/types";
import { CollectionUtils, Notify, StringUtils, stylesConfig } from "@/utils";
import React, { useEffect, useState } from "react";

const classes = stylesConfig(styles, "room");

type RoomPageProps = { user: IUser; service: string };

const RoomPage: React.FC<RoomPageProps> = (props) => {
	const serviceName = props.service;
	const [openAddArtifactPopup, setOpenAddArtifactPopup] = useState(false);
	const { artifacts } = useArtifactsStore();
	const {
		trigger: getArtifacts,
		data: artifactsForService,
		loading: gettingArtifacts,
	} = useHttpClient({
		trigger: ArtifactsApi.getArtifactsForService,
		onError: Notify.error,
		data: artifacts.filter((item) =>
			StringUtils.equals(item.service, serviceName)
		),
	});

	const refreshArtifactsForService = () => {
		void getArtifacts(serviceName);
	};

	useHeader([navigation.home]);

	const { setHeaderContent } = useAppStore({
		onMount: () => {
			setHeaderContent(
				<Components.Head onAdd={() => setOpenAddArtifactPopup(true)} />
			);
		},
		onUnmount: () => {
			setHeaderContent(null);
		},
	});

	useEffect(() => {
		refreshArtifactsForService();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [serviceName]);

	return (
		<>
			<Page id="room" className={classes("")}>
				<Room.Header
					serviceName={serviceName}
					artifacts={artifactsForService}
					onAdd={() => setOpenAddArtifactPopup(true)}
				/>
				{gettingArtifacts &&
				CollectionUtils.isEmpty(artifactsForService) ? (
					<Loader.Spinner />
				) : CollectionUtils.isEmpty(artifactsForService) ? (
					<Typography>
						No artifacts found for {serviceName}
					</Typography>
				) : (
					<Masonry
						xlg={4}
						lg={4}
						md={3}
						sm={2}
						xsm={1}
						className={classes("-listing")}
					>
						{artifactsForService.map((artifact) => (
							<Service.Artifact
								key={`room-${serviceName}-${artifact.id}`}
								artifact={artifact}
								onUpdate={refreshArtifactsForService}
								onDelete={refreshArtifactsForService}
							/>
						))}
					</Masonry>
				)}
			</Page>
			{openAddArtifactPopup ? (
				<Service.AddArtifact
					onAdd={refreshArtifactsForService}
					onClose={() => setOpenAddArtifactPopup(false)}
					defaults={{
						service: serviceName,
					}}
				/>
			) : null}
		</>
	);
};

export default RoomPage;

export const getServerSideProps = withAuthPage<RoomPageProps>(
	(user, context) => {
		const service = StringUtils.getNonEmptyString(context.query.name);
		return {
			props: { user, service },
		};
	}
);
