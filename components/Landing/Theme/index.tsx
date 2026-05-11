import { useAppStore } from "@/store";
import { stylesConfig } from "@/utils";
import React from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import styles from "./styles.module.scss";

const classes = stylesConfig(styles, "landing-theme");

export const Theme: React.FC = () => {
	const { toggleTheme } = useAppStore();

	return (
		<div className={classes("")}>
			<button onClick={toggleTheme}>
				<FiMoon />
				<FiSun />
			</button>
		</div>
	);
};
