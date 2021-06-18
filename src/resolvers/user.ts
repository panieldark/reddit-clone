import {
	Resolver,
	Mutation,
	Field,
	Arg,
	Ctx,
	InputType,
	ObjectType,
	Query,
} from "type-graphql";
import { MyContext } from "src/types";
import { User } from "../entities/User";
import argon2 from "argon2";
@InputType()
class UsernamePasswordInput {
	@Field()
	username: string;

	@Field()
	password: string;
}

@ObjectType()
class FieldError {
	@Field()
	field: string;
	@Field()
	message: string;
}
@ObjectType()
class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => User, { nullable: true })
	user?: User;
}
@Resolver()
export class UserResolver {
	@Query(() => User, { nullable: true })
	async me(@Ctx() { req, em }: MyContext) {
		if (!req.session.userId) {
			return null;
		}

		const user = await em.findOne(User, { id: req.session.userId });
		return user;
	}

	@Mutation(() => UserResponse)
	async register(
		@Arg("options") options: UsernamePasswordInput,
		@Ctx() { em, req }: MyContext
	): Promise<UserResponse | undefined> {
		if (options.username.length < 3) {
			return {
				errors: [
					{
						field: "username",
						message: "Username length must be 3 or greater",
					},
				],
			};
		}

		if (options.password.length < 3) {
			return {
				errors: [
					{
						field: "password",
						message: "Password length must be 3 or greater",
					},
				],
			};
		}

		const hashedPW = await argon2.hash(options.password);
		const user = em.create(User, {
			username: options.username,
			password: hashedPW,
		});
		try {
			await em.persistAndFlush(user);
		} catch (err) {
			if (err.code === "23505") {
				// Dupe username
				return {
					errors: [
						{
							field: "username",
							message: "Username already taken",
						},
					],
				};
			}
			console.log("error message", err.message);
		}

		// Auto login user after registration
		req.session.userId = user.id;

		return { user };
	}

	@Mutation(() => UserResponse)
	async login(
		@Arg("options") options: UsernamePasswordInput,
		@Ctx() { em, req }: MyContext
	): Promise<UserResponse> {
		const user = await em.findOne(User, { username: options.username });
		if (!user) {
			return {
				errors: [
					{
						field: "username",
						message: "Username does not exist",
					},
				],
			};
		}
		const valid = await argon2.verify(user.password, options.password);
		if (!valid) {
			return {
				errors: [
					{
						field: "password",
						message: "Incorrect password",
					},
				],
			};
		}

		req.session.userId = user.id;

		return {
			user,
		};
	}
}
