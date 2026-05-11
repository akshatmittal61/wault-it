import { Auth } from "@/components";
import { AppSeo } from "@/constants";
import { Typography } from "@/library";
import { stylesConfig } from "@/utils";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import styles from "./styles.module.scss";

const classes = stylesConfig(styles, "landing-hero");

export const Hero: React.FC = () => {
	const router = useRouter();

	const onScrollClick = () => {
		window.scrollTo({
			top: window.innerHeight,
			behavior: "smooth",
		});
	};

	return (
		<section className={classes("")}>
			<div className={classes("-container")}>
				<div className={classes("-content")}>
					<Typography
						size="head-1"
						as="h1"
						weight="semi-bold"
						family="montserrat"
						className={classes("-title")}
					>
						The Most Secure Way <br /> to{" "}
						<span>Vault Your Life.</span>
					</Typography>
					<Typography
						size="lg"
						as="p"
						weight="light"
						className={classes("-description")}
					>
						{AppSeo.description}
					</Typography>
					<div className={classes("-actions")}>
						<Auth.Button
							onClick={() => {
								router.push("/__/oauth/google");
							}}
						/>
						<Typography
							size="xs"
							className={classes("-terms")}
							weight="light"
						>
							No credit card required. Free forever for
							individuals.
						</Typography>
					</div>
				</div>
				<div className={classes("-visual")}>
					<Image
						src="/images/lock-key.png"
						alt="Security Visual"
						width={1920}
						height={1080}
						priority
					/>
				</div>
			</div>
			<div
				className={classes("-scroll-indicator")}
				onClick={onScrollClick}
			>
				<div className={classes("-mouse")}>
					<div className={classes("-wheel")} />
				</div>
			</div>
		</section>
	);
};
