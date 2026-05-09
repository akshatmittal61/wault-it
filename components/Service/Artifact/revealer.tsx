import { ArtifactsApi } from "@/api";
import { InputPrivateKey } from "@/components";
import { useHttpClient } from "@/hooks";
import { Button, Popup } from "@/library";
import { Notify, stylesConfig } from "@/utils";
import React, { useState } from "react";
import { FiEye } from "react-icons/fi";
import Block from "./block";
import styles from "./styles.module.scss";

interface IArtifactRevealerProps {
	id: string;
	identifier: string;
	onClose: () => void;
}

const classes = stylesConfig(styles, "artifact-revealer");

const ArtifactRevealer: React.FC<IArtifactRevealerProps> = ({
	id,
	identifier,
	onClose,
}) => {
	const {
		trigger: revealArtifact,
		data: revealedArtifact,
		loading: revealingArtifact,
	} = useHttpClient({
		trigger: ArtifactsApi.getRevealedArtifact,
		onError: Notify.error,
	});
	const [privateKey, setPrivateKey] = useState("");
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await revealArtifact({
			artifactId: id,
			privateKey,
		});
	};
	return (
		<Popup
			width="400px"
			height="350px"
			onClose={onClose}
			title="Reveal Artifact"
		>
			<div className={classes("")}>
				<Block label="Identifier" value={identifier} showCopy />
				{revealedArtifact.password ? (
					<Block
						label="Password"
						value={revealedArtifact.password}
						showRevealer
						showCopy
					/>
				) : (
					<form className={classes("-form")} onSubmit={handleSubmit}>
						<InputPrivateKey
							className={classes("-input")}
							value={privateKey}
							onChange={(value: string) => setPrivateKey(value)}
						/>
						<Button
							type="submit"
							variant="outlined"
							loading={revealingArtifact}
							icon={<FiEye />}
						>
							Reveal
						</Button>
					</form>
				)}
			</div>
		</Popup>
	);
};

export default ArtifactRevealer;
