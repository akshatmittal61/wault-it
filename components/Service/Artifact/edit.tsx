import { InputPrivateKey } from "@/components";
import { Responsive } from "@/layouts";
import { Button, Input, Pane } from "@/library";
import { HiddenInput } from "@/library/";
import { useArtifactsStore } from "@/store";
import { IArtifact, IUpdateArtifact } from "@/types";
import {
	CollectionUtils,
	Notify,
	SafetyUtils,
	StringUtils,
	stylesConfig,
} from "@/utils";
import React, { useState } from "react";
import styles from "./styles.module.scss";

interface IUpdateArtifactProps {
	id: string;
	artifact: IArtifact;
	onClose: () => void;
	onUpdate: (_: IArtifact) => void;
}

const classes = stylesConfig(styles, "artifact-add");

const UpdateArtifact: React.FC<IUpdateArtifactProps> = ({
	id,
	artifact,
	onClose,
	onUpdate,
}) => {
	const { services, updateArtifact, isUpdatingArtifact } =
		useArtifactsStore();
	const [artifactDetails, setArtifactDetails] = useState<IUpdateArtifact>({
		service: artifact.service,
		identifier: artifact.identifier,
		comment: artifact.comment,
		password: "",
		privateKey: "",
	});
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setArtifactDetails((prev) => ({ ...prev, [name]: value }));
	};
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		let payload: IUpdateArtifact = {};
		if (StringUtils.notEquals(artifactDetails.service, artifact.service)) {
			payload.service = artifactDetails.service;
		}
		if (StringUtils.notEquals(artifactDetails.comment, artifact.comment)) {
			payload.comment = artifactDetails.comment;
		}
		if (
			StringUtils.notEquals(
				artifactDetails.identifier,
				artifact.identifier
			)
		) {
			payload.identifier = artifactDetails.identifier;
		}
		if (
			StringUtils.isNotEmpty(artifactDetails.password) &&
			StringUtils.isNotEmpty(artifactDetails.privateKey)
		) {
			payload = {
				...payload,
				password: artifactDetails.password,
				privateKey: artifactDetails.privateKey,
			};
		} else if (
			StringUtils.isEmpty(artifactDetails.password) &&
			StringUtils.isNotEmpty(artifactDetails.privateKey)
		) {
			return Notify.error(
				"Password is required when private key is provided"
			);
		} else if (
			StringUtils.isNotEmpty(artifactDetails.password) &&
			StringUtils.isEmpty(artifactDetails.privateKey)
		) {
			return Notify.error(
				"Private key is required when password is provided"
			);
		}
		if (CollectionUtils.isEmpty(Object.keys(payload))) {
			return Notify.error("Nothing to update");
		}
		const updated = await updateArtifact(id, payload);
		if (SafetyUtils.isNonNull(updated)) {
			onUpdate(updated);
			onClose();
		}
	};
	return (
		<Pane title="Update Artifact" onClose={onClose}>
			<form
				autoComplete="off"
				className={classes("")}
				onSubmit={handleSubmit}
			>
				<Responsive.Row>
					<Responsive.Col xlg={50} lg={50} md={50} sm={100} xsm={100}>
						<Input
							className={classes("-input")}
							type="text"
							name="service"
							id="update-artifact-service"
							label="Service"
							placeholder="Enter service name"
							autoComplete="off"
							value={artifactDetails.service}
							onChange={handleChange}
							dropdown={{
								enabled: services.length > 0,
								options: services.map((service, index) => ({
									id: `add-new-artifact-service-${index}`,
									label: service,
									value: service,
								})),
								onSelect: (option) => {
									setArtifactDetails((prev) => ({
										...prev,
										service: option.value,
									}));
								},
							}}
						/>
					</Responsive.Col>
					<Responsive.Col xlg={50} lg={50} md={50} sm={100} xsm={100}>
						<Input
							className={classes("-input")}
							type="text"
							name="comment"
							id="update-artifact-comment"
							label="Comment"
							placeholder="Enter comment"
							autoComplete="off"
							value={artifactDetails.comment}
							onChange={handleChange}
						/>
					</Responsive.Col>
					<Responsive.Col xlg={50} lg={50} md={50} sm={100} xsm={100}>
						<Input
							className={classes("-input")}
							type="text"
							name="identifier"
							id="update-artifact-identifier"
							label="Identifier"
							placeholder="myemail@example.com or label(My iPhone)"
							autoComplete="off"
							value={artifactDetails.identifier}
							onChange={handleChange}
						/>
					</Responsive.Col>
					<Responsive.Col xlg={50} lg={50} md={50} sm={100} xsm={100}>
						<HiddenInput
							className={classes("-input")}
							name="password"
							id="update-artifact-password"
							label="Password"
							placeholder="Enter your password"
							autoComplete="new-password"
							value={artifactDetails.password || ""}
							onChange={(value) => {
								setArtifactDetails((prev) => ({
									...prev,
									password: value,
									privateKey: prev.privateKey || "",
								}));
							}}
						/>
					</Responsive.Col>
					<Responsive.Col
						xlg={100}
						lg={100}
						md={100}
						sm={100}
						xsm={100}
					>
						<InputPrivateKey
							className={classes("-input", "-input--full")}
							name="privateKey"
							id="update-artifact-private-key"
							label="Private Key"
							placeholder="Enter your private key"
							value={artifactDetails.privateKey || ""}
							autoComplete="new-password"
							onChange={(value) => {
								setArtifactDetails((prev) => ({
									...prev,
									password: prev.password || "",
									privateKey: value,
								}));
							}}
						/>
					</Responsive.Col>
					<Responsive.Col
						xlg={100}
						lg={100}
						md={100}
						sm={100}
						xsm={100}
					>
						<Button
							type="submit"
							variant="outlined"
							loading={isUpdatingArtifact}
						>
							Update
						</Button>
					</Responsive.Col>
				</Responsive.Row>
			</form>
		</Pane>
	);
};

export default UpdateArtifact;
