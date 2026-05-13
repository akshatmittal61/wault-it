import { Seo } from "@/components";
import { AppSeo, Routes } from "@/constants";
import { usePageProps } from "@/contexts/PagePropsContext";
import { useAuthStore } from "@/store";
import { BooleanUtils } from "@/utils";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { PageProps } from "./types";

export const Page = <T extends PageProps = PageProps>({
	children,
	...props
}: T) => {
	const router = useRouter();
	const pageProps = usePageProps<T>();
	const user = pageProps.user;

	const {
		sync: syncAuth,
		setUser,
		getIsLoggedIn,
	} = useAuthStore({ syncOnMount: false });

	useEffect(() => {
		// if server side props have sent user -> update auth store
		// else if user visits a protected route, but store is in logged out state
		// try to sync, if it fails, user will be redirected to LOGIN page
		// for handling of redirecting to LOGIN page, ref: client/http.ts
		if (user) {
			setUser(user);
		}
		if (
			BooleanUtils.False.equals(getIsLoggedIn()) &&
			Routes.isProtected(router.pathname)
		) {
			void syncAuth();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, router.pathname]);

	return (
		<>
			<Seo
				title={AppSeo.title}
				description={AppSeo.description}
				image={AppSeo.image}
				canonical={AppSeo.canonical}
				themeColor={AppSeo.themeColor}
				icons={AppSeo.icons}
				twitter={AppSeo.twitter}
				og={AppSeo.og}
			/>
			<main
				{...props}
				data-app-container={Routes.supportsAppContainer(
					router.pathname
				)}
			>
				{children}
			</main>
		</>
	);
};

export * from "./types";
