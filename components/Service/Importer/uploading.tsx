import { Typography } from "@/library";
import { stylesConfig } from "@/utils";
import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FaRegFileAlt } from "react-icons/fa";
import styles from "./styles.module.scss";

interface IArtifactsImportsUploadingProps {
	file: any;
	setFile: (_: any) => void;
}

const classes = stylesConfig(styles, "artifacts-importer");

const ArtifactsImportsUploading: React.FC<IArtifactsImportsUploadingProps> = ({
	file,
	setFile,
}) => {
	return (
		<>
			<FaRegFileAlt />
			<div className={classes("-header-main")}>
				<Typography size="lg" className={classes("-file-name")}>
					{file.name}
				</Typography>
				<Typography size="sm" className={classes("-file-size")}>
					{file.size > 1000000
						? `${file.size / 1000000} MB`
						: `${file.size / 1000} KB`}
				</Typography>
			</div>
			<button
				type="reset"
				className={classes("-header-reset")}
				onClick={() => setFile(null)}
			>
				<AiOutlineDelete />
			</button>
		</>
	);
};

export default ArtifactsImportsUploading;
