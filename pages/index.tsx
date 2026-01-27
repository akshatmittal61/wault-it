import { authRouterInterceptor } from "@/client";
import { Landing } from "@/components";
import { Routes } from "@/constants";
import { Page } from "@/layouts";
import styles from "@/styles/pages/Home.module.scss";
import { stylesConfig } from "@/utils";
import { GetServerSidePropsContext } from "next";
import React from "react";

const classes = stylesConfig(styles, "landing");

const HomePage: React.FC = () => {
	return (
		<Page id="landing" className={classes("")}>
			<Landing.Hero />
		</Page>
	);
};

export default HomePage;

export const getServerSideProps = (context: GetServerSidePropsContext) => {
	return authRouterInterceptor(context, {
		onLoggedIn() {
			return {
				redirect: {
					destination: Routes.HOME,
					permanent: false,
				},
			};
		},
		onLoggedOut() {
			return {
				props: {},
			};
		},
	});
};
