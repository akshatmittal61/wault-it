import { authRouterInterceptor } from "@/client";
import { Auth as Components } from "@/components";
import { Routes } from "@/constants";
import { Page } from "@/layouts";
import { Typography } from "@/library";
import styles from "@/styles/pages/Auth.module.scss";
import { IUser, ServerSideResult } from "@/types";
import { StringUtils, stylesConfig } from "@/utils";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const classes = stylesConfig(styles, "login");

type LoginPageProps = { user: IUser | null };

const LoginPage: React.FC<LoginPageProps> = () => {
	const router = useRouter();

	return (
		<Page className={classes("")}>
			<div className={classes("-layout")}>
				<section className={classes("-left")} />
				<section className={classes("-right")}>
					<div className={classes("-right-inner")}>
						<div className={classes("-brand")}>
							<Image
								src="/logo-full.png"
								alt="logo"
								width={220}
								height={70}
								priority
							/>
						</div>
						<Typography
							as="h1"
							size="xxl"
							weight="medium"
							family="montserrat"
						>
							Sign in
						</Typography>
						<Typography
							as="p"
							size="sm"
							className={classes("-subtitle")}
						>
							Use Google to continue to your vault.
						</Typography>
						<div className={classes("-card")}>
							<div className={classes("-card-body")}>
								<Components.Button
									onClick={() => {
										router.push("/__/oauth/google");
									}}
								/>
								<Typography
									size="xs"
									className={classes("-foot")}
								>
									By continuing, you agree to the{" "}
									<Link href={Routes.TERMS_AND_CONDITIONS}>
										Terms & Conditions
									</Link>{" "}
									and{" "}
									<Link href={Routes.PRIVACY_POLICY}>
										Privacy Policy
									</Link>
								</Typography>
							</div>
						</div>
						<div className={classes("-tiles")}>
							<div className={classes("-tile")}>
								<Typography size="sm" weight="medium">
									Organize by service
								</Typography>
								<Typography
									size="xs"
									className={classes("-muted")}
								>
									LinkedIn, Google, Hotstar — grouped the way
									you think.
								</Typography>
							</div>
							<div className={classes("-tile")}>
								<Typography size="sm" weight="medium">
									Reveal on demand
								</Typography>
								<Typography
									size="xs"
									className={classes("-muted")}
								>
									Hidden by default. Copy in one click.
								</Typography>
							</div>
							<div className={classes("-tile")}>
								<Typography size="sm" weight="medium">
									Fast search
								</Typography>
								<Typography
									size="xs"
									className={classes("-muted")}
								>
									Find anything instantly as your vault grows.
								</Typography>
							</div>
						</div>
					</div>
				</section>
			</div>
		</Page>
	);
};

export default LoginPage;

export const getServerSideProps = (
	context: GetServerSidePropsContext
): Promise<ServerSideResult<LoginPageProps>> => {
	return authRouterInterceptor(context, {
		onLoggedInAndOnboarded() {
			const { redirect } = context.query;
			const redirectPath = StringUtils.getNonEmptyStringOrElse(
				redirect,
				Routes.HOME
			);
			return {
				redirect: {
					destination: redirectPath,
					permanent: false,
				},
			};
		},
		onLoggedInAndNotOnboarded() {
			return {
				redirect: {
					destination: Routes.ONBOARDING,
					permanent: false,
				},
			};
		},
		onLoggedOut() {
			return {
				props: { user: null },
			};
		},
	});
};
