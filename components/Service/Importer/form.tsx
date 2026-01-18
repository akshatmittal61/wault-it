import { Typography } from "@/library";
import { stylesConfig } from "@/utils";
import React from "react";
import { FiUpload } from "react-icons/fi";
import styles from "./styles.module.scss";

interface IArtifactsImporterFormProps {
	file: any;
	setFile: (_: any) => void;
	handleUpload: (_: any) => void;
	handleDragOver: (_: any) => void;
	handleDrop: (_: any) => void;
	handleDragStart: (_: any) => void;
}

const classes = stylesConfig(styles, "artifacts-importer");

const ArtifactsImporterForm: React.FC<IArtifactsImporterFormProps> = ({
	file,
	setFile,
	handleUpload,
	handleDragOver,
	handleDrop,
	handleDragStart,
}) => {
	return (
		<form
			className={classes("-form")}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
			id="upload-file"
			onSubmit={(e) => {
				e.preventDefault();
				handleUpload(file);
			}}
		>
			<div
				className={classes("-form__content")}
				draggable="true"
				onDragStart={handleDragStart}
			>
				<FiUpload />
				<Typography size="lg">
					Upload files (*.csv Format Only)
				</Typography>
				<Typography size="md">Max Size 10MB</Typography>
			</div>
			<input
				type="file"
				name="file"
				id="file"
				onChange={(e) => {
					setFile(e.target.files?.[0]);
				}}
				accept=".csv"
			/>
			<label
				className={classes("-form__label")}
				htmlFor="file"
				title={"Upload File"}
			>
				Browse Files
			</label>
		</form>
	);
};

export default ArtifactsImporterForm;
