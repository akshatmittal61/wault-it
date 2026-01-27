import { Auth } from "@/components";
import { oauth_google } from "@/config";
import { AppSeo } from "@/constants";
import { Page } from "@/layouts";
import { Loader, Typography } from "@/library";
import styles from "@/styles/pages/Auth.module.scss";
import { stylesConfig } from "@/utils";
import Image from "next/image";
import React from "react";

const classes = stylesConfig(styles, "oauth");

const GoogleOAuthRedirectPage: React.FC = () => {
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
					Redirecting to Google
				</Typography>
				<Typography
					as="p"
					family="montserrat"
					size="lg"
					weight="light"
					className={classes("-subtitle")}
				>
					If you are not redirected automatically, continue below.
				</Typography>
				<div className={classes("-loader")}>
					<Loader.Spinner />
				</div>
				<Auth.Button
					onClick={() => {
						const query = {
							client_id: oauth_google.client_id,
							redirect_uri: oauth_google.redirect_uri,
							response_type: "code",
							scope: oauth_google.scopes,
						};
						const url = new URL(oauth_google.endpoint);
						url.search = new URLSearchParams(query).toString();
						window.location.href = url.toString();
					}}
				/>
			</div>
		</Page>
	);
};

export default GoogleOAuthRedirectPage;

export const getServerSideProps = async () => {
	const query = {
		client_id: oauth_google.client_id,
		redirect_uri: oauth_google.redirect_uri,
		response_type: "code",
		scope: oauth_google.scopes,
	};
	const url = new URL(oauth_google.endpoint);
	url.search = new URLSearchParams(query).toString();
	const complete_url = url.toString();
	return {
		redirect: {
			destination: complete_url,
			permanent: false,
		},
	};
};
