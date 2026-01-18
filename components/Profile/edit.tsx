import { Avatar, Button, Input } from "@/library";
import { useAuthStore } from "@/store";
import { IUpdateUser } from "@/types";
import {
	Notify,
	SafetyUtils,
	StringUtils,
	stylesConfig,
	UserUtils,
} from "@/utils";
import React, { useState } from "react";
import styles from "./styles.module.scss";

interface IEditProfileProps {
	onEdit: () => void;
}

const classes = stylesConfig(styles, "edit-profile");

const EditProfile: React.FC<IEditProfileProps> = ({ onEdit }) => {
	const { user, updateProfile, isUpdatingProfile } = useAuthStore();

	const [userDetails, setUserDetails] = useState<IUpdateUser>(() => {
		if (SafetyUtils.isNonNull(user)) {
			return {
				name: user.name,
				avatar: user.avatar,
			};
		} else {
			return {
				name: StringUtils.EMPTY,
				avatar: StringUtils.EMPTY,
			};
		}
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setUserDetails((prev) => ({ ...prev, [name]: value }));
	};
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!userDetails.name) return Notify.error("Name is required");
		await updateProfile(userDetails);
		onEdit();
	};
	return (
		<section id="profile" className={classes("")}>
			<form onSubmit={handleSubmit} className={classes("-form")}>
				{SafetyUtils.isNonNull(user) ? (
					<Avatar
						src={UserUtils.getUserAvatar(user)}
						alt={UserUtils.getNameOfUser(user)}
					/>
				) : null}
				<Input
					name="name"
					value={userDetails.name}
					onChange={handleChange}
					label="Name"
					placeholder="Enter your name"
					type="text"
				/>
				<Input
					name="avatar"
					value={userDetails.avatar}
					onChange={handleChange}
					label="Avatar"
					placeholder="Enter your avatar URL"
					type="url"
				/>
				<Button loading={isUpdatingProfile} type="submit">
					Save
				</Button>
			</form>
		</section>
	);
};

export default EditProfile;
