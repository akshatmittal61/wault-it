import { fallbackAssets, routes } from "@/constants";
import { Avatar, Button, IconButton, MaterialIcon } from "@/library";
import { SafetyUtils, stylesConfig } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { FiLogIn } from "react-icons/fi";
import Search from "./search";
import styles from "./styles.module.scss";
import { useAuthStore, useUiStore } from "@/store";

interface IHeaderProps {}

const classes = stylesConfig(styles, "header");

const Header: React.FC<IHeaderProps> = () => {
	const router = useRouter();
	const { toggleSidebar, theme, toggleTheme, sync: syncUi } = useUiStore();
	const { isLoggedIn, user, isSyncing, sync: syncAuthStore } = useAuthStore();
	const lastScrollTop = useRef<any>(0);
	const [isNavbarVisible, setIsNavbarVisible] = useState(true);

	const syncEverything = () => {
		syncUi();
		void syncAuthStore();
	};

	const handleScroll = () => {
		const { pageYOffset } = window;
		if (pageYOffset > lastScrollTop.current) setIsNavbarVisible(false);
		else if (pageYOffset < lastScrollTop.current) setIsNavbarVisible(true);
		lastScrollTop.current = pageYOffset;
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll, {
			passive: true,
		});
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	return (
		<header
			className={classes("", {
				"--visible": isNavbarVisible,
			})}
			style={{
				translate: isNavbarVisible
					? "0"
					: "0 calc(-1 * var(--head-height))",
			}}
		>
			<div className={classes("-left")}>
				{isLoggedIn ? (
					<div className={classes("-left-burger")}>
						<IconButton
							className={classes("-left-burger__button")}
							onClick={toggleSidebar}
							icon={<MaterialIcon icon="menu" />}
							size="large"
						/>
					</div>
				) : null}
				<Link
					className={classes("-left-logo")}
					href={isLoggedIn ? routes.HOME : routes.ROOT}
				>
					<Image
						className={classes("-left-logo__image")}
						src="/favicon.png"
						alt="logo"
						width={512}
						height={512}
					/>
				</Link>
			</div>
			<div className={classes("-right")}>
				{router.pathname === routes.HOME && isLoggedIn ? (
					<Search />
				) : null}
				<IconButton
					onClick={toggleTheme}
					icon={
						<MaterialIcon
							icon={
								theme === "light" ? "dark_mode" : "light_mode"
							}
						/>
					}
				/>
				{isLoggedIn ? (
					<IconButton
						onClick={syncEverything}
						className={classes("-sync", {
							"-sync--loading": isSyncing,
						})}
						icon={<MaterialIcon icon="sync" />}
					/>
				) : null}
				{isLoggedIn && SafetyUtils.isNonNull(user) ? (
					<Avatar
						src={user.avatar || fallbackAssets.avatar}
						alt={user.name}
						size={48}
						onClick={() => router.push(routes.PROFILE)}
						className={classes("-avatar")}
					/>
				) : (
					<Button
						onClick={() => {
							void router.push(routes.LOGIN);
						}}
						icon={<FiLogIn />}
					>
						Login
					</Button>
				)}
			</div>
		</header>
	);
};

export default Header;
