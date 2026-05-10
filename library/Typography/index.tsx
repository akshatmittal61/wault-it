import { stylesConfig } from "@/utils";
import React from "react";
import styles from "./styles.module.scss";
import { TypographyProps } from "./types";

const classes = stylesConfig(styles, "typography");

const Typography: React.ForwardRefRenderFunction<
	HTMLElement,
	TypographyProps
> = (
	{
		children,
		family = "poppins",
		size = "md",
		weight = "regular",
		format = "regular",
		as = "span",
		className = "",
		...rest
	},
	ref
) => {
	const Component = as || "span";

	return (
		<Component
			ref={ref}
			{...rest}
			className={
				classes("", `--${family}-${size}-${weight}-${format}`) +
				` ${className}`
			}
		>
			{children}
		</Component>
	);
};

export default React.forwardRef<HTMLElement, TypographyProps>(Typography);
