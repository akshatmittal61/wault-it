import { authRouterInterceptor } from "@/client";
import { Profile } from "@/components";
import { Routes } from "@/constants";
import { Page } from "@/layouts";
import { Button } from "@/library";
import styles from "@/styles/pages/Home.module.scss";
import { IUser, ServerSideResult } from "@/types";
import { stylesConfig } from "@/utils";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FiEdit2, FiEye, FiHome } from "react-icons/fi";

const classes = stylesConfig(styles, "profile");

type ProfilePageProps = { user: IUser };

const ProfilePage: React.FC<ProfilePageProps> = () => {
	const router = useRouter();
	const [mode, setMode] = useState<"view" | "edit">("view");

	return (
		<Page id="profile" className={classes("")}>
			<div className={classes("-actions")}>
				<button
					className={classes("-home")}
					onClick={() => router.push(Routes.HOME)}
				>
					<FiHome />
				</button>
				<Button
					className={classes("-button")}
					variant="outlined"
					icon={mode === "view" ? <FiEdit2 /> : <FiEye />}
					onClick={() =>
						setMode((p) => (p === "view" ? "edit" : "view"))
					}
				>
					{mode === "view" ? "Edit Profile" : "View Profile"}
				</Button>
			</div>
			{mode === "view" ? (
				<Profile.View />
			) : (
				<Profile.Edit onEdit={() => setMode("view")} />
			)}
		</Page>
	);
};

export default ProfilePage;

export const getServerSideProps = async (
	context: any
): Promise<ServerSideResult<ProfilePageProps>> => {
	return await authRouterInterceptor(context, {
		onLoggedInAndOnboarded(user) {
			return {
				props: { user },
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
				redirect: {
					destination: Routes.LOGIN,
					permanent: false,
				},
			};
		},
	});
};
