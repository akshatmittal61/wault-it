import { useConfirmationModal } from "@/hooks";
import { IconButton, Typography } from "@/library";
import { useArtifactsStore } from "@/store";
import { IArtifact } from "@/types";
import { copyToClipboard, Notify, stylesConfig } from "@/utils";
import dayjs from "dayjs";
import React, { useState } from "react";
import { FiCopy, FiEdit2, FiEye, FiTrash } from "react-icons/fi";
import Updater from "./edit";
import Revealer from "./revealer";
import styles from "./styles.module.scss";

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
					<Typography size="md">{artifact.identifier}</Typography>
					{artifact.comment ? (
						<Typography size="sm">{artifact.comment}</Typography>
					) : null}
				</div>
				<div className={classes("-toolbar")}>
					<div className={classes("-actions")}>
						<IconButton
							title="Reveal"
							icon={<FiEye />}
							onClick={() => setShowRevealer(true)}
						/>
						<IconButton
							title="Copy ID"
							icon={<FiCopy />}
							onClick={() => {
								copyToClipboard(artifact.identifier);
								Notify.info("Copied to clipboard");
							}}
						/>
						<IconButton
							title="Edit"
							icon={<FiEdit2 />}
							onClick={() => setShowUpdater(true)}
						/>
						<IconButton
							title="Delete"
							icon={<FiTrash />}
							onClick={deleteArtifactConfirmation.openPopup}
						/>
					</div>
					<Typography
						size="sm"
						format="italics"
						className={classes("-meta")}
					>
						Edited at {dayjs(artifact.updatedAt).format("DD MMM")}
					</Typography>
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
