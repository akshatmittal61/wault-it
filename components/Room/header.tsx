import { useOnClickOutside, useRouter } from "@/hooks";
import { Button, IconButton, Input, Typography } from "@/library";
import { IArtifact } from "@/types";
import { CollectionUtils, StringUtils, stylesConfig } from "@/utils";
import React, { useState } from "react";
import { FiEdit2, FiHexagon, FiPlus, FiSave, FiX } from "react-icons/fi";
import styles from "./styles.module.scss";
import { useArtifactsStore } from "@/store";
import { Routes } from "@/constants";

const classes = stylesConfig(styles, "room-header");

type RoomHeaderProps = {
	serviceName: string;
	artifacts: IArtifact[];
	onAdd: () => void;
};

export const Header: React.FC<RoomHeaderProps> = ({
	serviceName,
	artifacts,
	onAdd,
}) => {
	const [isRenamingRoom, setIsRenamingRoom] = useState(false);
	const [value, setValue] = useState(serviceName);
	const roomNameEditorContainerRef = React.useRef<HTMLHeadingElement>(null);
	const { renameRoom, isRenamingRoom: isUpdatingRoomName } =
		useArtifactsStore();
	const router = useRouter();

	const onSave = async () => {
		if (StringUtils.equals(value, serviceName)) {
			setIsRenamingRoom(false);
			setValue(serviceName);
			return;
		}

		await renameRoom(serviceName, value);
		router.replace(Routes.ROOM(value));
	};

	const onCancel = () => {
		setIsRenamingRoom(false);
		setValue(serviceName);
	};

	useOnClickOutside(roomNameEditorContainerRef, onSave);

	return (
		<div className={classes("")}>
			<div className={classes("-content")}>
				{isRenamingRoom ? (
					<div className={classes("-title", "-title__edit")}>
						<Typography
							as="h1"
							family="montserrat"
							size="xl"
							weight="medium"
							ref={roomNameEditorContainerRef}
						>
							<Input
								className={classes("-title__input")}
								value={value}
								onChange={(
									e: React.ChangeEvent<HTMLInputElement>
								) => setValue(e.target.value)}
								onBlur={onSave}
								onKeyDown={(
									e: React.KeyboardEvent<HTMLInputElement>
								) => {
									if (e.key === "Enter") {
										e.preventDefault();
										e.stopPropagation();
										onSave();
									}
									if (e.key === "Escape") {
										e.preventDefault();
										e.stopPropagation();
										onCancel();
									}
								}}
							/>
						</Typography>
						{isUpdatingRoomName ? (
							<IconButton
								icon={<FiHexagon />}
								className={classes("-title__spinner")}
							/>
						) : (
							<IconButton
								onClick={onSave}
								icon={<FiSave />}
								size="small"
							/>
						)}
						<IconButton
							onClick={onCancel}
							icon={<FiX />}
							size="small"
							disabled={isUpdatingRoomName}
						/>
					</div>
				) : (
					<Typography
						as="h1"
						family="montserrat"
						size="xl"
						weight="medium"
						className={classes("-title", "-title__view")}
						onClick={() => setIsRenamingRoom(true)}
					>
						{serviceName}
						<IconButton
							onClick={() => setIsRenamingRoom(true)}
							icon={<FiEdit2 />}
							size="small"
						/>
					</Typography>
				)}
				<Typography as="h3" family="montserrat">
					{`Total ${
						CollectionUtils.isEmpty(artifacts)
							? 0
							: artifacts.length
					} artifacts`}
				</Typography>
			</div>
			<div className={classes("-actions")}>
				<Button onClick={onAdd} icon={<FiPlus />} iconPosition="left">
					Create
				</Button>
			</div>
		</div>
	);
};
