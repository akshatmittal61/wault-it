import { PageProps } from "@/layouts";
import React, { createContext, useContext } from "react";

const PagePropsContext = createContext<PageProps>({});

export const PagePropsProvider: React.FC<{
	children: React.ReactNode;
	props: PageProps;
}> = ({ children, props }) => {
	return (
		<PagePropsContext.Provider value={props}>
			{children}
		</PagePropsContext.Provider>
	);
};

export const usePageProps = <T = PageProps,>() =>
	useContext(PagePropsContext) as T;
