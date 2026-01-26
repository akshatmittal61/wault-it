import { routes } from "@/constants";
import { Typography } from "@/library";
import styles from "@/styles/pages/Auth.module.scss";
import { IUser, ServerSideResult } from "@/types";
import { stylesConfig } from "@/utils";
import React, { useEffect } from "react";
import { useAuthStore } from "@/store";
import { authRouterInterceptor } from "@/client";

const classes = stylesConfig(styles, "oauth");

type LogoutPageProps = { user: IUser };

const LogoutPage: React.FC<LogoutPageProps> = () => {
	const { logout } = useAuthStore();
	useEffect(() => {
		void logout();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className={classes("")}>
			<Typography
				as="h1"
				family="montserrat"
				size="xxl"
				weight="medium"
				className={classes("-title")}
			>
				Logout
			</Typography>
		</div>
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
					destination: routes.LOGIN,
					permanent: false,
				},
			};
		},
	});
};
