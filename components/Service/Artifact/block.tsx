import { Typography } from "@/library";
import { copyToClipboard, Notify, stylesConfig } from "@/utils";
import React, { useState } from "react";
import { FiCheck, FiCopy, FiEye, FiEyeOff } from "react-icons/fi";
import styles from "./styles.module.scss";

interface IServiceArtifactBlockProps {
	label: string;
	value: string;
	showRevealer?: boolean;
	showCopy?: boolean;
	style?: React.CSSProperties;
}

const classes = stylesConfig(styles, "service-artifact-block");

const ServiceArtifactBlock: React.FC<IServiceArtifactBlockProps> = ({
	label,
	value,
	style,
	showRevealer = false,
	showCopy = false,
}) => {
	const [copyIcon, setCopyIcon] = useState(<FiCopy />);
	const [reveal, setReveal] = useState(false);

	return (
		<div className={classes("")} style={style}>
			<Typography size="sm" className={classes("-label")}>
				{label}
			</Typography>
			<div className={classes("-container")}>
				<Typography size="s" className={classes("-value")}>
					{showRevealer
						? reveal
							? value
							: "*".repeat(value.length)
						: value}
				</Typography>
				<div className={classes("-actions")}>
					{showRevealer ? (
						<button
							className={classes("-icon")}
							onClick={() => {
								setReveal((p) => !p);
							}}
						>
							{reveal ? <FiEyeOff /> : <FiEye />}
						</button>
					) : null}
					{showCopy ? (
						<button
							className={classes("-icon")}
							onClick={() => {
								copyToClipboard(value);
								Notify.success("Copied to clipboard");
								setCopyIcon(<FiCheck />);
								setTimeout(() => {
									setCopyIcon(<FiCopy />);
								}, 1000);
							}}
						>
							{copyIcon}
						</button>
					) : null}
				</div>
			</div>
		</div>
	);
};

export default ServiceArtifactBlock;
