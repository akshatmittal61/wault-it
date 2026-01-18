import { InputPrivateKey } from "@/components";
import { stylesConfig } from "@/utils";
import React from "react";
import { FiUpload } from "react-icons/fi";
import styles from "./styles.module.scss";

interface IArtifactsImporterSubmitProps {
	privateKey: string;
	setPrivateKey: (_: string) => void;
	loading: boolean;
	upload: () => void;
}

const classes = stylesConfig(styles, "artifacts-importer");

const ArtifactsImporterSubmit: React.FC<IArtifactsImporterSubmitProps> = ({
	privateKey,
	setPrivateKey,
	loading,
	upload,
}) => {
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		upload();
	};
	return (
		<form onSubmit={handleSubmit} className={classes("-submit")}>
			<InputPrivateKey
				className={classes("-input", "-input--full")}
				value={privateKey}
				onChange={(value: string) => setPrivateKey(value)}
				required
			/>
			<button
				type="submit"
				className={classes("-upload-btn", {
					"-upload-btn--loading": loading,
				})}
				disabled={loading}
			>
				{loading ? (
					<span className={classes("-upload-btn--loader")} />
				) : (
					<>
						<FiUpload />
						Upload this File
					</>
				)}
			</button>
		</form>
	);
};

export default ArtifactsImporterSubmit;
