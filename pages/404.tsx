import { Error } from "@/components";
import { frontendBaseUrl } from "@/constants";
import { Page } from "@/layouts";
import { useRouter } from "next/router";
import React from "react";

const PageNotFound: React.FC = () => {
	const router = useRouter();
	return (
		<Page>
			<Error
				title="Oops! You seem to be lost"
				description="The page you are looking for does not exist."
				image={`${frontendBaseUrl}/vectors/not-found.svg`}
				button={{
					label: "Let's get you home",
					action: () => router.push("/"),
				}}
			/>
		</Page>
	);
};

export default PageNotFound;
