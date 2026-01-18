import { Button, Typography } from "@/library";
import { stylesConfig } from "@/utils";
import Image from "next/image";
import React from "react";
import styles from "./styles.module.scss";

interface IPlaceholderProps {
	graphic?: React.ReactNode;
	title?: string;
	subtitle?: string;
	cta?: {
		label: string;
		size?: "small" | "medium" | "large";
		action: () => void;
	};
}

const classes = stylesConfig(styles, "placeholder");

const Placeholder: React.FC<IPlaceholderProps> = ({
	graphic,
	title,
	subtitle,
	cta,
}) => {
	return (
		<div className={classes("")}>
			{graphic ? (
				graphic
			) : (
				<Image
					src="/vectors/empty-records.svg"
					alt="empty-records"
					width={1920}
					height={1080}
				/>
			)}
			{title ? <Typography size="lg">{title}</Typography> : null}
			{subtitle ? <Typography size="s">{subtitle}</Typography> : null}
			{cta ? (
				<Button size={cta.size || "medium"} onClick={cta.action}>
					{cta.label}
				</Button>
			) : null}
		</div>
	);
};

export default Placeholder;
