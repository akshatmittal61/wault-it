import { Auth } from "@/components";
import { Typography } from "@/library";
import { stylesConfig } from "@/utils";
import { useRouter } from "next/router";
import React from "react";
import styles from "./styles.module.scss";

const classes = stylesConfig(styles, "landing-cta");

export const CTA: React.FC = () => {
	const router = useRouter();
	return (
		<section className={classes("")}>
			<div className={classes("-container")}>
				<div className={classes("-content")}>
					<Typography
						size="head-1"
						as="h2"
						weight="semi-bold"
						family="montserrat"
						className={classes("-title")}
					>
						Ready to secure your <span>digital world?</span>
					</Typography>
					<Typography
						size="lg"
						as="p"
						className={classes("-description")}
						weight="light"
					>
						Join thousands of users who trust Wault It for their
						daily security. It&apos;s free, forever.
					</Typography>
					<div className={classes("-actions")}>
						<Auth.Button
							onClick={() => {
								router.push("/__/oauth/google");
							}}
						/>
					</div>
				</div>
			</div>
		</section>
	);
};
