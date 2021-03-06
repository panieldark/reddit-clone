import React from "react";
import { Formik, Form } from "formik";
import { FormControl, FormLabel, Input, Button, Box } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
interface registerProps {}

export const Register: React.FC<registerProps> = ({}) => {
	return (
		<Wrapper>
			<Formik
				initialValues={{ username: "", password: "" }}
				onSubmit={(values) => {
					console.log(values);
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<InputField
							name="username"
							placeholder="Username"
							label="Username"
						/>
						<Box mt={4}>
							<InputField
								name="p assword"
								placeholder="Password"
								label="Password"
								type="password"
							/>
						</Box>
						<Button type="submit" isLoading={isSubmitting} colorScheme="teal">
							Register
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default Register;
