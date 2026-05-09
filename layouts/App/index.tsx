import { Footer, Header, SideBar } from "@/components";
import { Routes } from "@/constants";
import { useDevice } from "@/hooks";
import { Loader } from "@/library";
import { useAppStore } from "@/store";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

interface AppModuleProps {
	children: React.ReactNode;
}

export const AppModule: React.FC<AppModuleProps> = ({ children }) => {
	const router = useRouter();
	const [showLoader, setShowLoader] = useState(false);
	const { closeSidebar, openSidebar, syncNetworkStatus } = useAppStore({
		syncOnMount: true,
	});
	const { device } = useDevice();

	// only show top bar loader when route is changing
	useEffect(() => {
		router.events.on("routeChangeStart", () => {
			setShowLoader(true);
		});
		router.events.on("routeChangeComplete", () => {
			setShowLoader(false);
		});
		router.events.on("routeChangeError", () => {
			setShowLoader(false);
		});
	}, [router.events]);

	useEffect(() => {
		// when a dev intentionally switches to mobile device, close sidebar
		if (device === "mobile") {
			closeSidebar();
		} else {
			openSidebar();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [device]);

	useEffect(() => {
		// check for network state every 10 seconds
		const interval = setInterval(() => {
			syncNetworkStatus();
		}, 10 * 1000);
		return () => clearInterval(interval);
	}, [syncNetworkStatus]);

	useEffect(() => {
		// in mobiles, whenever user switches to different page, close sidebar
		if (device === "mobile") {
			closeSidebar();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.pathname]);

	return (
		<>
			{Routes.supportsAppContainer(router.pathname) ? (
				<>
					<Header />
					<SideBar />
				</>
			) : null}
			{showLoader ? <Loader.Bar /> : null}
			{children}
			{Routes.supportsFooter(router.pathname) ? <Footer /> : null}
			<Toaster position="bottom-left" />
		</>
	);
};
