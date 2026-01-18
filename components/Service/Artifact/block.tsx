import { Typography } from "@/library";
import { copyToClipboard, Notify, stylesConfig } from "@/utils";
import React, { useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";
import styles from "./styles.module.scss";

interface IServiceArtifactBlockProps {
	label: string;
	value: string;
	showCopy?: boolean;
	style?: React.CSSProperties;
}

const classes = stylesConfig(styles, "service-artifact-block");

const ServiceArtifactBlock: React.FC<IServiceArtifactBlockProps> = ({
	label,
	value,
	style,
	showCopy = false,
}) => {
	const [icon, setIcon] = useState(<FiCopy />);
	return (
		<div className={classes("")} style={style}>
			<Typography size="sm" className={classes("-label")}>
				{label}
			</Typography>
			<Typography size="s" className={classes("-value")}>
				{value}
				{showCopy ? (
					<button
						className={classes("-icon")}
						onClick={() => {
							copyToClipboard(value);
							Notify.success("Copied to clipboard");
							setIcon(<FiCheck />);
							setTimeout(() => {
								setIcon(<FiCopy />);
							}, 1000);
						}}
					>
						{icon}
					</button>
				) : null}
			</Typography>
		</div>
	);
};

export default ServiceArtifactBlock;
