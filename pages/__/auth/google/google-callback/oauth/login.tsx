import { AuthApi } from "@/api";
import { AppSeo, Routes } from "@/constants";
import { Page } from "@/layouts";
import { Loader, Typography } from "@/library";
import { Logger } from "@/log";
import { useAuthStore } from "@/store";
import styles from "@/styles/pages/Auth.module.scss";
import { Notify, StringUtils, stylesConfig } from "@/utils";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const classes = stylesConfig(styles, "oauth");

type GoogleOAuthRedirectedPageProps = React.FC<{ token: string }>;

const GoogleOAuthRedirectedPage: GoogleOAuthRedirectedPageProps = (props) => {
	const router = useRouter();
	const { continueOAuthWithGoogle, getIsOnboarded } = useAuthStore();
	const continueWithGoogle = async () => {
		try {
			await continueOAuthWithGoogle(props.token);
			if (getIsOnboarded()) {
				void router.push(Routes.HOME);
			} else {
				void router.push(Routes.ONBOARDING);
			}
		} catch {
			Notify.error("Something went wrong, please try again");
			void router.push(Routes.HOME);
		}
	};
	useEffect(() => {
		void continueWithGoogle();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Page className={classes("")}>
			<div className={classes("-card")}>
				<div className={classes("-brand")}>
					<Image
						src={AppSeo.favicon || "/favicon.png"}
						alt={AppSeo.title || "Wault It"}
						width={72}
						height={72}
					/>
				</div>
				<Typography
					as="h1"
					family="montserrat"
					size="xxl"
					weight="medium"
					className={classes("-title")}
				>
					Signing you in
				</Typography>
				<Typography
					as="p"
					family="montserrat"
					size="lg"
					weight="light"
					className={classes("-subtitle")}
				>
					We&apos;re verifying your Google account and preparing your
					vault.
				</Typography>
				<div className={classes("-loader")}>
					<Loader.Spinner />
				</div>
			</div>
		</Page>
	);
};

export default GoogleOAuthRedirectedPage;

export const getServerSideProps = async (context: any) => {
	const { query } = context;
	try {
		const code = StringUtils.getNonEmptyString(query.code);
		const verificationRes = await AuthApi.verifyOAuthSignIn(code);
		return { props: { token: verificationRes.data } };
	} catch (error) {
		Logger.error(error);
		return {
			redirect: {
				destination: Routes.HOME,
				permanent: false,
			},
		};
	}
};
