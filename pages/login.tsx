import { Auth as Components } from "@/components";
import { routes } from "@/constants";
import { Typography } from "@/library";
import styles from "@/styles/pages/Auth.module.scss";
import { IUser, ServerSideResult } from "@/types";
import { StringUtils, stylesConfig } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { authRouterInterceptor } from "@/client";
import { GetServerSidePropsContext } from "next";

const classes = stylesConfig(styles, "login");

type LoginPageProps = { user: IUser | null };

const LoginPage: React.FC<LoginPageProps> = () => {
	const router = useRouter();

	return (
		<main className={classes("")}>
			<Image
				src="/favicon.png"
				alt="logo"
				width={1920}
				height={1080}
				className={classes("-logo")}
			/>
			<Typography
				as="h1"
				family="montserrat"
				size="xxl"
				weight="medium"
				className={classes("-title")}
			>
				Welcome to Wault It
			</Typography>
			<Typography
				as="p"
				family="montserrat"
				size="lg"
				weight="light"
				className={classes("-subtitle")}
			>
				Store and secure passwords for everything, encrypted behind one
				paraphrase that only you remember.
			</Typography>
			<Components.Button
				onClick={() => {
					router.push("/__/oauth/google");
				}}
			/>
			<Typography size="sm" className={classes("-foot")}>
				By continuing, you acknowledge that you understand and agree to
				the{" "}
				<Link href={routes.TERMS_AND_CONDITIONS}>
					Terms & Conditions
				</Link>{" "}
				and <Link href={routes.PRIVACY_POLICY}>Privacy Policy</Link>
			</Typography>
			<Image
				src="/favicon.svg"
				alt="logo"
				width={1920}
				height={1080}
				className={classes("-background")}
			/>
		</main>
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
				routes.HOME
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
					destination: routes.ONBOARDING,
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
