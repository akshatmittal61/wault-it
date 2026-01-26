import { authRouterInterceptor } from "@/client";
import { Landing } from "@/components";
import { routes } from "@/constants";
import styles from "@/styles/pages/Home.module.scss";
import { stylesConfig } from "@/utils";
import { GetServerSidePropsContext } from "next";
import React from "react";

const classes = stylesConfig(styles, "groups");

const HomePage: React.FC = () => {
	return (
		<main id="landing" className={classes("")}>
			<Landing.Hero />
		</main>
	);
};

export default HomePage;

export const getServerSideProps = (context: GetServerSidePropsContext) => {
	return authRouterInterceptor(context, {
		onLoggedIn() {
			return {
				redirect: {
					destination: routes.HOME,
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
