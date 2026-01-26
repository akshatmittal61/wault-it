import { HiddenInput } from "@/library";
import { InputProps } from "@/library/Input/types";
import { validateKey } from "@/validations";
import React from "react";

interface IInputPrivateKeyProps extends Omit<InputProps, "onChange"> {
	value: string;
	onChange: (_: string) => void;
}

const InputPrivateKey: React.FC<IInputPrivateKeyProps> = ({
	value,
	onChange,
	...props
}) => {
	const validate = (key: string): string | null => {
		try {
			validateKey(key);
			return null;
		} catch (err: any) {
			return err.message;
		}
	};
	return (
		<HiddenInput
			name="privateKey"
			label="Private Key"
			placeholder="Enter your private key"
			value={value}
			onChange={onChange}
			error={validate(value) === null}
			errorMessage={validate(value)?.toString()}
			{...props}
		/>
	);
};

export default InputPrivateKey;
