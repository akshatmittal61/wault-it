import { Routes } from "@/constants";
import { Avatar, Button, Typography } from "@/library";
import { useAuthStore } from "@/store";
import {
	copyToClipboard,
	Notify,
	SafetyUtils,
	stylesConfig,
	UserUtils,
} from "@/utils";
import { useRouter } from "next/router";
import React from "react";
import { FiCopy, FiLogOut } from "react-icons/fi";
import styles from "./styles.module.scss";

interface IViewProfileProps {}

const classes = stylesConfig(styles, "view-profile");

const ViewProfile: React.FC<IViewProfileProps> = () => {
	const router = useRouter();
	const { user, logout } = useAuthStore();

	const logoutUser = async () => {
		await logout();
		void router.push(Routes.LOGIN);
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
					<FiCopy />
				</button>
			</Typography>
			<Button onClick={logoutUser} size="large" icon={<FiLogOut />}>
				Logout
			</Button>
		</section>
	);
};

export default ViewProfile;
