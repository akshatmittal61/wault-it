import { Typography } from "@/library";
import { stylesConfig } from "@/utils";
import React from "react";
import { LuFileSymlink } from "react-icons/lu";
import styles from "./styles.module.scss";

interface IArtifactsImporterCurrentProps {}

const classes = stylesConfig(styles, "artifacts-importer");

const ArtifactsImporterCurrent: React.FC<
	IArtifactsImporterCurrentProps
> = () => {
	return (
		<>
			<Typography as="h3" size="lg">
				View Current File
			</Typography>
			<a
				href="https://akshatmittal61.vercel.app"
				target="_blank"
				rel="noreferrer"
				className={classes("-header-link")}
			>
				<LuFileSymlink />
			</a>
		</>
	);
};

export default ArtifactsImporterCurrent;
