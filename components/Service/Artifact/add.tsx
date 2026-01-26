import { InputPrivateKey } from "@/components";
import { Responsive } from "@/layouts";
import { Button, HiddenInput, Input, Pane } from "@/library";
import { useArtifactsStore } from "@/store";
import { ICreateArtifact } from "@/types";
import { Notify, stylesConfig } from "@/utils";
import React, { useState } from "react";
import styles from "./styles.module.scss";

interface IAddNewArtifactProps {
	onClose: () => void;
}

const classes = stylesConfig(styles, "artifact-add");

const AddNewArtifact: React.FC<IAddNewArtifactProps> = ({ onClose }) => {
	const { services, createArtifact, isCreatingArtifact } =
		useArtifactsStore();
	const [artifactDetails, setArtifactDetails] = useState<ICreateArtifact>({
		service: "",
		identifier: "",
		comment: "",
		password: "",
		privateKey: "",
	});
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setArtifactDetails((prev) => ({ ...prev, [name]: value }));
	};
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await createArtifact(artifactDetails);
		onClose();
	};
	return (
		<Pane title="Add New Artifact" onClose={onClose}>
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
							label="Service"
							placeholder="Enter service name"
							autoComplete="off"
							id="add-new-artifact-service"
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
							id="add-new-artifact-comment"
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
							autoComplete="off"
							id="add-new-artifact-identifier"
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
							autoComplete="new-password"
							id="add-new-artifact-password"
							value={artifactDetails.password}
							onChange={(value) => {
								setArtifactDetails((prev) => ({
									...prev,
									password: value,
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
							autoComplete="new-password"
							id="add-new-artifact-private-key"
							value={artifactDetails.privateKey}
							onChange={(value) => {
								setArtifactDetails((prev) => ({
									...prev,
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
							loading={isCreatingArtifact}
						>
							Add
						</Button>
					</Responsive.Col>
				</Responsive.Row>
			</form>
		</Pane>
	);
};

export default AddNewArtifact;
