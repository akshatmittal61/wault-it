import { withAuthPage } from "@/client";
import { Profile } from "@/components";
import { Page } from "@/layouts";
import styles from "@/styles/pages/Home.module.scss";
import { IUser } from "@/types";
import { stylesConfig } from "@/utils";
import React, { useState } from "react";

const classes = stylesConfig(styles, "profile");

type ProfilePageProps = { user: IUser };

const ProfilePage: React.FC<ProfilePageProps> = () => {
	const [mode, setMode] = useState<"view" | "edit">("view");

	return (
		<Page id="profile" className={classes("")}>
			{mode === "view" ? (
				<Profile.View onEdit={() => setMode("edit")} />
			) : (
				<Profile.Edit onEdit={() => setMode("view")} />
			)}
		</Page>
	);
};

export default ProfilePage;

export const getServerSideProps = withAuthPage<ProfilePageProps>((user) => ({
	props: { user },
}));
