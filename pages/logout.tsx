import { authRouterInterceptor } from "@/client";
import { Routes } from "@/constants";
import { Page } from "@/layouts";
import { Typography } from "@/library";
import { useAuthStore } from "@/store";
import styles from "@/styles/pages/Auth.module.scss";
import { IUser, ServerSideResult } from "@/types";
import { stylesConfig } from "@/utils";
import React, { useEffect } from "react";

const classes = stylesConfig(styles, "oauth");

type LogoutPageProps = { user: IUser };

const LogoutPage: React.FC<LogoutPageProps> = () => {
	const { logout } = useAuthStore();
	useEffect(() => {
		void logout();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<Page className={classes("")}>
			<Typography
				as="h1"
				family="montserrat"
				size="xxl"
				weight="medium"
				className={classes("-title")}
			>
				Logout
			</Typography>
		</Page>
	);
};

export default LogoutPage;

export const getServerSideProps = async (
	context: any
): Promise<ServerSideResult<LogoutPageProps>> => {
	return await authRouterInterceptor(context, {
		onLoggedInAndOnboarded(user) {
			return { props: { user } };
		},
		onLoggedInAndNotOnboarded(user) {
			return { props: { user } };
		},
		onLoggedOut() {
			return {
				redirect: {
					destination: Routes.LOGIN,
					permanent: false,
				},
			};
		},
	});
};
