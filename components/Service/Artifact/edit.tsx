import { InputPrivateKey } from "@/components";
import { Responsive } from "@/layouts";
import { Button, Input, Pane } from "@/library";
import { HiddenInput } from "@/library/";
import { useArtifactsStore } from "@/store";
import { IArtifact, IUpdateArtifact } from "@/types";
import { CollectionUtils, Notify, stylesConfig } from "@/utils";
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
		try {
			let payload: IUpdateArtifact = {};
			if (artifactDetails.service !== artifact.service) {
				payload.service = artifactDetails.service;
			}
			if (artifactDetails.comment !== artifact.comment) {
				payload.comment = artifactDetails.comment;
			}
			if (artifactDetails.identifier !== artifact.identifier) {
				payload.identifier = artifactDetails.identifier;
			}
			if (artifactDetails.password && artifactDetails.privateKey) {
				payload = {
					...payload,
					password: artifactDetails.password,
					privateKey: artifactDetails.privateKey,
				};
			}
			if (CollectionUtils.isEmpty(Object.keys(payload))) {
				return Notify.error("Nothing to update");
			}
			const updated = await updateArtifact(id, payload);
			onUpdate(updated);
		} catch (error) {
			Notify.error(error);
		}
	};
	return (
		<Pane title="Update Artifact" onClose={onClose}>
			<form className={classes("")} onSubmit={handleSubmit}>
				<Responsive.Row>
					<Responsive.Col xlg={50} lg={50} md={50} sm={100} xsm={100}>
						<Input
							className={classes("-input")}
							type="text"
							name="service"
							label="Service"
							placeholder="Enter service name"
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
							label="Comment"
							placeholder="Enter comment"
							value={artifactDetails.comment}
							onChange={handleChange}
						/>
					</Responsive.Col>
					<Responsive.Col xlg={50} lg={50} md={50} sm={100} xsm={100}>
						<Input
							className={classes("-input")}
							type="text"
							name="identifier"
							label="Identifier"
							placeholder="myemail@example.com or label(My iPhone)"
							value={artifactDetails.identifier}
							onChange={handleChange}
						/>
					</Responsive.Col>
					<Responsive.Col xlg={50} lg={50} md={50} sm={100} xsm={100}>
						<HiddenInput
							className={classes("-input")}
							name="password"
							label="Password"
							placeholder="Enter your password"
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
							value={artifactDetails.privateKey || ""}
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
