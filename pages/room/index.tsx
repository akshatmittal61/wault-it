import { withAuthPage } from "@/client";
import { Service } from "@/components";
import { useHttpClient } from "@/hooks";
import { Masonry } from "@/layouts";
import { Loader, Typography } from "@/library";
import styles from "@/styles/pages/Room.module.scss";
import { IUser } from "@/types";
import { CollectionUtils, Notify, StringUtils, stylesConfig } from "@/utils";
import React, { useEffect } from "react";
import { ArtifactsApi } from "@/api";
import { useArtifactsStore } from "@/store";

const classes = stylesConfig(styles, "room");

type RoomPageProps = { user: IUser; service: string };

const RoomPage: React.FC<RoomPageProps> = (props) => {
	const serviceName = props.service;
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

	useEffect(() => {
		refreshArtifactsForService();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [serviceName]);

	return (
		<main id="room" className={classes("")}>
			<Typography
				as="h1"
				family="montserrat"
				size="xxl"
				weight="medium"
				className={classes("-title")}
			>
				Room {serviceName}
			</Typography>
			{gettingArtifacts &&
			CollectionUtils.isEmpty(artifactsForService) ? (
				<Loader.Spinner />
			) : CollectionUtils.isEmpty(artifactsForService) ? (
				<Typography>No artifacts found for {serviceName}</Typography>
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
		</main>
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
