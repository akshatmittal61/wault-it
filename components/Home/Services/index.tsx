import { routes } from "@/constants";
import { MaterialIcon, Typography } from "@/library";
import { stylesConfig } from "@/utils/functions";
import { useRouter } from "next/router";
import React from "react";
import styles from "./styles.module.scss";
import { useArtifactsStore } from "@/store";

interface IHomeServicesProps {}

const classes = stylesConfig(styles, "home-services");

const HomeServices: React.FC<IHomeServicesProps> = () => {
	const { services } = useArtifactsStore();
	const router = useRouter();
	return (
		<section id="home-services" className={classes("")}>
			{services.map((service) => (
				<div
					key={`home-services-${service.toString()}`}
					className={classes("-service")}
					onClick={() => {
						void router.push(routes.ROOM(service));
					}}
				>
					<Typography size="s">{service}</Typography>
					<MaterialIcon icon="chevron_right" />
				</div>
			))}
		</section>
	);
};

export default HomeServices;
