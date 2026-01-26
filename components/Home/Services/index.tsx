import { Routes } from "@/constants";
import { Masonry } from "@/layouts";
import { Typography } from "@/library";
import { useArtifactsStore } from "@/store";
import { stylesConfig } from "@/utils";
import { useRouter } from "next/router";
import React from "react";
import { FiArrowRight } from "react-icons/fi";
import styles from "./styles.module.scss";

interface IHomeServicesProps {}

const classes = stylesConfig(styles, "home-services");

const HomeServices: React.FC<IHomeServicesProps> = () => {
	const { services } = useArtifactsStore();
	const router = useRouter();
	return (
		<section id="home-services" className={classes("")}>
			<Masonry
				className={classes("-masonry")}
				xlg={4}
				lg={4}
				md={3}
				sm={2}
				xsm={2}
			>
				{services.map((service) => (
					<div
						key={`home-services-${service.toString()}`}
						className={classes("-service")}
						onClick={() => {
							void router.push(Routes.ROOM(service));
						}}
					>
						<Typography
							size="s"
							className={classes("-service__text")}
						>
							{service}
						</Typography>
						<FiArrowRight className={classes("-service__icon")} />
					</div>
				))}
			</Masonry>
		</section>
	);
};

export default HomeServices;
