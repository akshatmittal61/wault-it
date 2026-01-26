import { authRouterInterceptor } from "@/client";
import { Routes } from "@/constants";
import { Page } from "@/layouts";
import { Avatar, Button, Input } from "@/library";
import { useAuthStore } from "@/store";
import styles from "@/styles/pages/Auth.module.scss";
import { IUpdateUser, IUser, ServerSideResult } from "@/types";
import {
	Notify,
	SafetyUtils,
	StringUtils,
	stylesConfig,
	UserUtils,
} from "@/utils";
import { useRouter } from "next/router";
import React, { useState } from "react";

const classes = stylesConfig(styles, "onboarding");

type OnboardingPageProps = {
	user: IUser;
};

const OnboardingPage: React.FC<OnboardingPageProps> = (props) => {
	const { user, updateProfile, isUpdatingProfile } = useAuthStore();
	const router = useRouter();
	const [userDetails, setUserDetails] = useState<IUpdateUser>({
		name: props.user.name,
		avatar: props.user.avatar,
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setUserDetails((prev) => ({ ...prev, [name]: value }));
	};
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (StringUtils.isEmpty(userDetails.name))
			return Notify.error("Name is required");
		await updateProfile(userDetails);
		void router.push(Routes.HOME);
	};

	return (
		<Page id="onboarding" className={classes("")}>
			<form onSubmit={handleSubmit}>
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
		</Page>
	);
};

export default OnboardingPage;

export const getServerSideProps = async (
	context: any
): Promise<ServerSideResult<OnboardingPageProps>> => {
	return await authRouterInterceptor(context, {
		onLoggedInAndOnboarded() {
			return {
				redirect: {
					destination: Routes.HOME,
					permanent: false,
				},
			};
		},
		onLoggedInAndNotOnboarded(user) {
			return {
				props: { user },
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
