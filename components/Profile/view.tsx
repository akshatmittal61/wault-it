import { routes } from "@/constants";
import { Avatar, Button, MaterialIcon, Typography } from "@/library";
import { Notify, SafetyUtils, UserUtils } from "@/utils";
import { copyToClipboard, stylesConfig } from "@/utils/functions";
import { useRouter } from "next/router";
import React from "react";
import styles from "./styles.module.scss";
import { useAuthStore } from "@/store";

interface IViewProfileProps {}

const classes = stylesConfig(styles, "view-profile");

const ViewProfile: React.FC<IViewProfileProps> = () => {
	const router = useRouter();
	const { user, logout } = useAuthStore();

	const logoutUser = async () => {
		await logout();
		void router.push(routes.LOGIN);
	};

	if (!SafetyUtils.isNonNull(user)) return null;
	return (
		<section id="profile" className={classes("")}>
			<Avatar
				src={UserUtils.getUserAvatar(user)}
				alt={UserUtils.getNameOfUser(user)}
				size="large"
			/>
			<Typography as="h1" size="xxxl" className={classes("-name")}>
				Hi, {UserUtils.getNameOfUser(user)}
			</Typography>
			<Typography size="lg" className={classes("-email")}>
				{user.email}{" "}
				<button
					className={classes("-copy")}
					onClick={() => {
						copyToClipboard(user.email);
						Notify.success("Email copied to clipboard");
					}}
				>
					<MaterialIcon icon="content_copy" />
				</button>
			</Typography>
			<Button
				onClick={logoutUser}
				size="large"
				icon={<MaterialIcon icon="logout" />}
			>
				Logout
			</Button>
		</section>
	);
};

export default ViewProfile;
