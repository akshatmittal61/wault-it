import { Typography } from "@/library";
import { stylesConfig } from "@/utils";
import React from "react";
import {
	FiLock,
	FiRefreshCw,
	FiShare2,
	FiShield,
	FiSmartphone,
	FiZap,
} from "react-icons/fi";
import styles from "./styles.module.scss";

const classes = stylesConfig(styles, "landing-features");

const features = [
	{
		title: "Zero-Knowledge Encryption",
		description:
			"Your data is encrypted before it ever leaves your device. We can't see your passwords, and neither can anyone else.",
		icon: <FiLock />,
	},
	{
		title: "Seamless Sync",
		description:
			"Access your vault from any device, anywhere. Your data stays in sync automatically across all your browsers and apps.",
		icon: <FiRefreshCw />,
	},
	{
		title: "Security Audited",
		description:
			"Built with industry-standard encryption protocols (AES-256) and regularly audited for vulnerabilities.",
		icon: <FiShield />,
	},
	{
		title: "Mobile Ready",
		description:
			"Carry your passwords in your pocket. Our mobile-first design ensures you're never locked out.",
		icon: <FiSmartphone />,
	},
	{
		title: "Secure & Private Sharing",
		description:
			"Securely share passwords with friends and family. They can view the password but cannot copy it.",
		icon: <FiShare2 />,
	},
	{
		title: "Password Strength Checker",
		description:
			"See how strong your passwords are and get recommendations for improvement.",
		icon: <FiZap />,
	},
];

export const Features: React.FC = () => {
	return (
		<section className={classes("")}>
			<div className={classes("-container")}>
				<div className={classes("-header")}>
					<Typography
						size="head-2"
						as="h2"
						weight="semi-bold"
						family="montserrat"
						className={classes("-title")}
					>
						Everything you need for{" "}
						<span>Digital Peace of Mind.</span>
					</Typography>
					<Typography
						size="lg"
						as="p"
						className={classes("-subtitle")}
						weight="light"
					>
						Simple, secure, and built for the modern web.
					</Typography>
				</div>
				<div className={classes("-grid")}>
					{features.map((feature, index) => (
						<div
							key={`feature-${index}`}
							className={classes("-card")}
						>
							<div className={classes("-icon")}>
								{feature.icon}
							</div>
							<Typography
								size="xl"
								as="h3"
								weight="medium"
								className={classes("-card-title")}
							>
								{feature.title}
							</Typography>
							<Typography
								size="md"
								as="p"
								className={classes("-card-description")}
								weight="light"
							>
								{feature.description}
							</Typography>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
