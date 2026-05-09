import { IconButton } from "@/library";
import { BooleanUtils, SafetyUtils, stylesConfig } from "@/utils";
import React, { useEffect, useState } from "react";
import { FiDownload, FiPlus, FiSearch } from "react-icons/fi";
import styles from "./styles.module.scss";
import { Search } from "@/components/Header/search";
import { types } from "sass";
import Boolean = types.Boolean;

interface IHomeHeadProps {
	onAdd?: () => void;
	onImport?: () => void;
	enableSearch?: boolean;
}

const classes = stylesConfig(styles, "home-head");

const HomeHead: React.FC<IHomeHeadProps> = ({
	onAdd,
	onImport,
	enableSearch = false,
}) => {
	const [isSearching, setIsSearching] = useState(false);

	useEffect(() => {
		// if search is enabled, enable the keyboard shortcut via / key
		if (enableSearch) {
			const handleKeyDown = (event: KeyboardEvent) => {
				// don't enable keyboard shortcut when user is typing somewhere
				if (
					event.target instanceof HTMLInputElement ||
					event.target instanceof HTMLTextAreaElement ||
					event.target instanceof HTMLSelectElement
				) {
					return;
				}
				if (event.key === "/") {
					event.preventDefault();
					setIsSearching(true);
				}
			};
			document.addEventListener("keydown", handleKeyDown);
			return () => {
				document.removeEventListener("keydown", handleKeyDown);
			};
		}
	}, [enableSearch]);

	return (
		<section id="home-head" className={classes("")}>
			<div className={classes("-actions")}>
				{SafetyUtils.isNonNull(onImport) ? (
					<IconButton icon={<FiDownload />} onClick={onImport} />
				) : null}
				{BooleanUtils.True.equals(enableSearch) ? (
					isSearching ? (
						<Search onClose={() => setIsSearching(false)} />
					) : (
						<IconButton
							icon={<FiSearch />}
							onClick={() => setIsSearching(true)}
						/>
					)
				) : null}
				{SafetyUtils.isNonNull(onAdd) ? (
					<IconButton icon={<FiPlus />} onClick={onAdd} />
				) : null}
			</div>
		</section>
	);
};

export default HomeHead;
