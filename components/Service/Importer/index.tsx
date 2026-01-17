import { ArtifactsApi } from "@/api";
import { Popup, Typography } from "@/library";
import { Logger } from "@/log";
import { Notify, readFile } from "@/utils";
import { stylesConfig } from "@/utils/functions";
import React, { useState } from "react";
import Form from "./form";
import styles from "./styles.module.scss";
import Submit from "./submit";
import Uploading from "./uploading";
import { useHttpClient } from "@/hooks";

interface IArtifactsImporterProps {
	onClose: () => void;
	onImport: (_: Array<string>) => void;
}

const classes = stylesConfig(styles, "artifacts-importer");

const ArtifactsImporter: React.FC<IArtifactsImporterProps> = ({
	onClose,
	onImport,
}) => {
	const [file, setFile] = useState<any>(null);
	const [privateKey, setPrivateKey] = useState("");
	const { loading: isUpdating } = useHttpClient();

	const handleImport = async (file: File) => {
		try {
			if (!file) throw new Error("No file found");
			if (file.size > 40000000) {
				throw new Error("File size should not exceed 40MB");
			}
			const resumeFileDataUrl = await readFile(file);
			Logger.debug("resumeFileDataUrl", resumeFileDataUrl);
			const updatedServices = await ArtifactsApi.importArtifactsFromCsv(
				resumeFileDataUrl,
				privateKey
			);
			Notify.success("Resume uploaded successfully");
			onImport(updatedServices.data);
		} catch (error: any) {
			Notify.error(error, "Failed to upload resume");
		}
	};

	const handleDrop = (event: any) => {
		event.preventDefault();
		const { files } = event.dataTransfer;
		if (files.length === 0) {
			Notify.error("No files found");
		} else if (files.length > 1) {
			Notify.error("Please upload one file at a time");
		} else {
			setFile(files[0]);
		}
	};

	const handleDragOver = (event: any) => {
		event.preventDefault();
	};

	const handleDragStart = (event: any) => {
		event.dataTransfer.setData("text/plain", event.target.id);
	};
	return (
		<Popup
			title="Import from Google Chrome passwords"
			onClose={onClose}
			className={classes("")}
		>
			<div className={classes("")}>
				<div
					className={classes("-header", {
						"-header--uploading": file,
						"-header--uploaded":
							"https://akshatmittal61.vercel.app".length > 0 &&
							!file,
						"-header--empty":
							!file &&
							!("https://akshatmittal61.vercel.app".length > 0),
					})}
				>
					{file ? (
						<Uploading
							file={file}
							setFile={(file: any) => setFile(file)}
						/>
					) : (
						<Typography as="h3" size="lg">
							Upload the CSV exported from Google Chrome Passwords
						</Typography>
					)}
				</div>
				{file ? (
					<Submit
						privateKey={privateKey}
						setPrivateKey={(value: string) => setPrivateKey(value)}
						loading={isUpdating}
						upload={() => handleImport(file)}
					/>
				) : (
					<Form
						file={file}
						setFile={(f: any) => setFile(f)}
						handleUploadResume={handleImport}
						handleDragOver={handleDragOver}
						handleDrop={handleDrop}
						handleDragStart={handleDragStart}
					/>
				)}
			</div>
		</Popup>
	);
};

export default ArtifactsImporter;
