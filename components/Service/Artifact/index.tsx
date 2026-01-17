import { useConfirmationModal } from "@/hooks";
import { Button, MaterialIcon } from "@/library";
import { IArtifact } from "@/types";
import { Notify } from "@/utils";
import { stylesConfig } from "@/utils/functions";
import React, { useState } from "react";
import Block from "./block";
import Updater from "./edit";
import Revealer from "./revealer";
import styles from "./styles.module.scss";
import { useArtifactsStore } from "@/store";

interface IServiceArtifactProps {
	artifact: IArtifact;
	onUpdate: () => void;
	onDelete: () => void;
}

const classes = stylesConfig(styles, "service-artifact");

const ServiceArtifact: React.FC<IServiceArtifactProps> = ({
	artifact,
	onUpdate,
	onDelete,
}) => {
	const [showRevealer, setShowRevealer] = useState(false);
	const [showUpdater, setShowUpdater] = useState(false);
	const { deleteArtifact, isDeletingArtifact } = useArtifactsStore();
	const deleteArtifactHelper = async () => {
		try {
			await deleteArtifact(artifact.id);
			onDelete();
		} catch (error) {
			Notify.error(error);
		}
	};
	const deleteArtifactConfirmation = useConfirmationModal(
		`Delete ${artifact.identifier}`,
		<>
			Are you sure you want to delete this password?
			<br />
			This action cannot be undone
		</>,
		async () => {
			await deleteArtifactHelper();
		},
		() => {
			deleteArtifactConfirmation.closePopup();
		},
		isDeletingArtifact
	);
	return (
		<>
			<div className={classes("")}>
				<div className={classes("-container")}>
					<Block
						label="Identifier"
						value={artifact.identifier}
						showCopy
					/>
					{artifact.comment ? (
						<Block label="Comment" value={artifact.comment} />
					) : null}
				</div>
				<span className={classes("-divider")} />
				<div className={classes("-actions")}>
					<Button
						size="small"
						variant="outlined"
						icon={<MaterialIcon icon="visibility" />}
						onClick={() => setShowRevealer(true)}
					>
						Reveal
					</Button>
					<Button
						size="small"
						variant="outlined"
						icon={<MaterialIcon icon="edit" />}
						onClick={() => setShowUpdater(true)}
					>
						Edit
					</Button>
					<Button
						size="small"
						variant="outlined"
						icon={<MaterialIcon icon="delete" />}
						onClick={deleteArtifactConfirmation.openPopup}
					>
						Delete
					</Button>
				</div>
			</div>
			{showRevealer ? (
				<Revealer
					id={artifact.id}
					identifier={artifact.identifier}
					onClose={() => setShowRevealer(false)}
				/>
			) : null}
			{showUpdater ? (
				<Updater
					id={artifact.id}
					artifact={artifact}
					onClose={() => setShowUpdater(false)}
					onUpdate={onUpdate}
				/>
			) : null}
			{deleteArtifactConfirmation.showPopup
				? deleteArtifactConfirmation.Modal
				: null}
		</>
	);
};

export default ServiceArtifact;
