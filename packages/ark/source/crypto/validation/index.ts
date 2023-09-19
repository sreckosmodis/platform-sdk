import { Validator } from "./validator";
import { ValidatorTv4 } from "./validatorTv4";

export class ValidationManager {
	private validator: Validator | ValidatorTv4;

	public constructor(options: Record<string, any> = {}) {
		this.validator = options.useTv4 ? ValidatorTv4.make() : Validator.make();
	}

	public static make(options: Record<string, any> = {}): ValidationManager {
		if (
			window.location.href.startsWith("moz-extension://") ||
			window.location.href.startsWith("chrome-extension://")
		) {
			options.useTv4 = true;
		}
		return new ValidationManager(options);
	}

	public getValidator(): Validator | ValidatorTv4 {
		return this.validator;
	}
}

export const validator = ValidationManager.make().getValidator();
