import { AppSeo, Routes } from "@/constants";
import { Button, Typography } from "@/library";
import { stylesConfig } from "@/utils";
import Image from "next/image";
import Link from "next/link";
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
			<header className={classes("-header")}>
				<div className={classes("-header-inner")}>
					<div className={classes("-header-brand")}>
						<Image
							src={AppSeo.favicon || "/favicon.png"}
							alt={AppSeo.title || "Wault It"}
							width={28}
							height={28}
						/>
						<Typography as="span" size="sm" weight="medium">
							{AppSeo.title || "Wault It"}
						</Typography>
					</div>
					<nav className={classes("-nav")}>
						<Link href={Routes.PRIVACY_POLICY}>Privacy</Link>
						<Link href={Routes.TERMS_AND_CONDITIONS}>Terms</Link>
						<button
							className={classes("-nav-cta")}
							onClick={() => router.push(Routes.LOGIN)}
						>
							Login
						</button>
					</nav>
				</div>
			</header>
			<div className={classes("-hero")}>
				<div className={classes("-hero-inner")}>
					<div className={classes("-phone")}>
						<Image
							src="/images/phone-display.png"
							alt="app preview"
							width={520}
							height={1060}
							priority
						/>
					</div>
					<div className={classes("-copy")}>
						<Typography
							as="h1"
							family="montserrat"
							size="xxl"
							weight="medium"
						>
							{AppSeo.title || "Wault It"}
						</Typography>
						<Typography
							as="p"
							family="montserrat"
							size="lg"
							weight="light"
							className={classes("-muted")}
						>
							{AppSeo.description}
						</Typography>
						<div className={classes("-actions")}>
							<Button
								size="large"
								onClick={() => router.push(Routes.LOGIN)}
								icon={<FiLogIn />}
								iconPosition="right"
							>
								Continue
							</Button>
						</div>
					</div>
				</div>
			</div>
			<section className={classes("-blocks")}>
				<div className={classes("-blocks-inner")}>
					<div
						className={
							classes("-block") + " " + classes("-block-wide")
						}
					>
						<Typography as="h2" size="xl" weight="medium">
							Encrypted behind your private phrase
						</Typography>
						<Typography
							as="p"
							size="sm"
							className={classes("-block-muted")}
						>
							Your passwords are stored encrypted. Reveal only
							when needed and copy in one click.
						</Typography>
					</div>
					<div className={classes("-grid")}>
						<div className={classes("-block")}>
							<Typography as="h3" size="lg" weight="medium">
								Organize by service
							</Typography>
							<Typography
								as="p"
								size="sm"
								className={classes("-block-muted")}
							>
								Keep everything grouped the way you think.
							</Typography>
						</div>
						<div className={classes("-block")}>
							<Typography as="h3" size="lg" weight="medium">
								Fast search
							</Typography>
							<Typography
								as="p"
								size="sm"
								className={classes("-block-muted")}
							>
								Find credentials instantly as your vault grows.
							</Typography>
						</div>
						<div className={classes("-block")}>
							<Typography as="h3" size="lg" weight="medium">
								Reveal on demand
							</Typography>
							<Typography
								as="p"
								size="sm"
								className={classes("-block-muted")}
							>
								Hidden by default. Reveal only when you need it.
							</Typography>
						</div>
						<div className={classes("-block")}>
							<Typography as="h3" size="lg" weight="medium">
								Import your vault
							</Typography>
							<Typography
								as="p"
								size="sm"
								className={classes("-block-muted")}
							>
								Bring existing passwords in via CSV.
							</Typography>
						</div>
					</div>
				</div>
			</section>
		</section>
	);
};

export default LandingHero;
