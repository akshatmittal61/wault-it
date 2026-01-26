import { fallbackAssets } from "@/constants";
import {
	BooleanUtils,
	getImageUrlFromDriveLink,
	StringUtils,
	stylesConfig,
} from "@/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { IAvatarProps } from "./types";

const classes = stylesConfig(styles);

export const Avatar: React.FC<IAvatarProps> = ({
	src,
	alt,
	fallback = fallbackAssets.avatar,
	shape = "circle",
	className,
	onClick,
	size = "medium",
	...props
}) => {
	const [isImageValid, setIsImageValid] = useState(() => {
		return (
			StringUtils.isNotEmpty(src) &&
			(src.startsWith("https://") || src.startsWith("/"))
		);
	});
	const imageUrl = (() => {
		if (src && (src.startsWith("https://") || src.startsWith("/"))) {
			return getImageUrlFromDriveLink(src);
		}
		return "";
	})();

	const getAvatarSize = () => {
		switch (size) {
			case "small":
				return 100;
			case "medium":
				return 150;
			case "large":
				return 200;
			default:
				return typeof size === "number" ? size : 50;
		}
	};

	useEffect(() => {
		setIsImageValid(
			BooleanUtils.valueOf(
				src && (src.startsWith("https://") || src.startsWith("/"))
			)
		);
	}, [src, fallback]);

	return (
		<div
			className={
				classes("avatar", `avatar-shape--${shape}`) +
				` ${className ?? ""}`
			}
			onClick={onClick}
			title={alt}
			{...props}
			style={{
				width: getAvatarSize(),
				height: getAvatarSize(),
				cursor:
					onClick && typeof onClick === "function"
						? "pointer"
						: "auto",
				...props.style,
			}}
		>
			{isImageValid ? (
				<Image
					src={imageUrl}
					alt={alt + ""}
					width={getAvatarSize() * 2}
					height={getAvatarSize() * 2}
					className={classes("avatar-image")}
					onError={() => {
						setIsImageValid(false);
					}}
				/>
			) : (
				<Image
					src={fallback}
					alt={alt + ""}
					width={getAvatarSize() * 2}
					height={getAvatarSize() * 2}
					className={classes("avatar-image")}
				/>
			)}
		</div>
	);
};
