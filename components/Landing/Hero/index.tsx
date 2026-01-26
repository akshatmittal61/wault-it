import { AppSeo, routes } from "@/constants";
import { Button, Typography } from "@/library";
import { stylesConfig } from "@/utils";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { FiLogIn } from "react-icons/fi";
import styles from "./styles.module.scss";

interface ILandingHeroProps {}

const classes = stylesConfig(styles, "landing-hero");

const LandingHero: React.FC<ILandingHeroProps> = () => {
	const router = useRouter();
	return (
		<section className={classes("")}>
			<Image
				src="/animations/lock.gif"
				alt="logo"
				width={480}
				height={480}
			/>
			<div className={classes("-content")}>
				<Typography size="head-1" as="h1" weight="semi-bold">
					{AppSeo.title}
				</Typography>
				<Typography size="lg" as="p">
					{AppSeo.description}
				</Typography>
				<Button
					icon={<FiLogIn />}
					iconPosition="right"
					size="large"
					onClick={() => router.push(routes.LOGIN)}
				>
					Get Started
				</Button>
			</div>
		</section>
	);
};

export default LandingHero;
