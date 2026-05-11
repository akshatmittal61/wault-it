import { Typography } from "@/library";
import { stylesConfig } from "@/utils";
import React from "react";
import styles from "./styles.module.scss";

const classes = stylesConfig(styles, "landing-security");

export const Security: React.FC = () => {
	return (
		<section className={classes("")}>
			<div className={classes("-container")}>
				<div className={classes("-content")}>
					<Typography
						size="head-2"
						as="h2"
						weight="semi-bold"
						family="montserrat"
						className={classes("-title")}
					>
						Built on the principle of <span>Zero Trust.</span>
					</Typography>
					<Typography
						size="lg"
						as="p"
						className={classes("-description")}
						weight="light"
					>
						We believe privacy is a fundamental human right.
						That&apos;s why we&apos;ve built Wault It with a
						zero-knowledge architecture. Your master paraphrase
						never leaves your device, and your data is encrypted
						locally before being synced.
					</Typography>

					<div className={classes("-stats")}>
						<div className={classes("-stat")}>
							<Typography size="xxl" weight="bold">
								256-bit
							</Typography>
							<Typography size="sm" color="grey">
								AES Encryption
							</Typography>
						</div>
						<div className={classes("-stat")}>
							<Typography size="xxl" weight="bold">
								100%
							</Typography>
							<Typography size="sm" color="grey">
								Private & Secure
							</Typography>
						</div>
					</div>
				</div>
				<div className={classes("-visual")}>
					<div className={classes("-box")}>
						<div className={classes("-line")} />
						<div className={classes("-line")} />
						<div className={classes("-line")} />
						<div className={classes("-circle")} />
					</div>
				</div>
			</div>
		</section>
	);
};
