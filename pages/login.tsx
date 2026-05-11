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
			<div className={classes("-container")}>
				<div className={classes("-card")}>
					<Image
						src="/favicon.png"
						alt="logo"
						width={64}
						height={64}
						className={classes("-logo")}
					/>
					<Typography
						as="h1"
						family="montserrat"
						size="xxl"
						weight="semi-bold"
						className={classes("-title")}
					>
						Welcome Back
					</Typography>
					<Typography
						as="p"
						family="montserrat"
						size="lg"
						weight="light"
						className={classes("-subtitle")}
					>
						Sign in to access your secure vault.
					</Typography>
					<div className={classes("-action")}>
						<Components.Button
							onClick={() => {
								router.push("/__/oauth/google");
							}}
						/>
					</div>
					<Typography size="xs" className={classes("-foot")}>
						By continuing, you agree to our{" "}
						<Link href={Routes.TERMS_AND_CONDITIONS}>Terms</Link>{" "}
						and{" "}
						<Link href={Routes.PRIVACY_POLICY}>Privacy Policy</Link>
						.
					</Typography>
				</div>
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
