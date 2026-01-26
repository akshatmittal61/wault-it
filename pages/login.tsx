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
				<Link href={Routes.TERMS_AND_CONDITIONS}>
					Terms & Conditions
				</Link>{" "}
				and <Link href={Routes.PRIVACY_POLICY}>Privacy Policy</Link>
			</Typography>
			<Image
				src="/favicon.svg"
				alt="logo"
				width={1920}
				height={1080}
				className={classes("-background")}
			/>
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
