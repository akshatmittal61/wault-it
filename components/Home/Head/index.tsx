import { IconButton } from "@/library";
import { stylesConfig } from "@/utils";
import React from "react";
import { FiDownload, FiPlus } from "react-icons/fi";
import styles from "./styles.module.scss";

interface IHomeHeadProps {
	onAdd: () => void;
	onImport: () => void;
}

const classes = stylesConfig(styles, "home-head");

const HomeHead: React.FC<IHomeHeadProps> = ({ onAdd, onImport }) => {
	return (
		<section id="home-head" className={classes("")}>
			<div className={classes("-actions")}>
				<IconButton icon={<FiDownload />} onClick={onImport} />
				<IconButton icon={<FiPlus />} onClick={onAdd} />
			</div>
		</section>
	);
};

export default HomeHead;
