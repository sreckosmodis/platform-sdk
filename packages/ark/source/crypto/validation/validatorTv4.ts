import * as tv4 from "tv4";

import { ISchemaValidationResult } from "../interfaces/index.js";
import { signedSchema, strictSchema, TransactionSchema } from "../transactions/types/schemas.js";
import { schemas } from "../validation/schemas.js";

export class ValidatorTv4 {
	private tv4: tv4.TV4;
	private readonly transactionSchemas: Map<string, TransactionSchema> = new Map<string, TransactionSchema>();

	private constructor(options: Record<string, any>) {
		this.tv4 = tv4.freshApi();
	}

	public static make(options: Record<string, any> = {}): ValidatorTv4 {
		return new ValidatorTv4(options);
	}

	public getInstance(): tv4.TV4 {
		return this.tv4;
	}

	public validate<T = any>(schemaKeyReference: string | tv4.JsonSchema, data: T): ISchemaValidationResult<T> {
		return this.validateSchema(this.tv4, schemaKeyReference, data);
	}

	public validateException<T = any>(schemaKeyReference: tv4.JsonSchema, data: T): ISchemaValidationResult<T> {
		const ajv = this.instantiateTv4({ allErrors: true, verbose: true });

		for (const schema of this.transactionSchemas.values()) {
			this.extendTransactionSchema(ajv, schema);
		}

		return this.validateSchema(ajv, schemaKeyReference, data);
	}

	public addFormat(name: string, format: tv4.FormatValidationFunction): void {
		this.tv4.addFormat(name, format);
	}

	public addKeyword(keyword: string, definition: tv4.KeywordValidationFunction): void {
		this.tv4.defineKeyword(keyword, definition);
	}

	public addSchema(schema: tv4.JsonSchema): void {
		this.tv4.addSchema(schema);
	}

	public removeKeyword(keyword: string): void {
		throw new Error("Method not supported in tv4.");
	}

	public removeSchema(schemaKeyReference: string | boolean | object | RegExp): void {
		throw new Error("Method not supported in tv4.");
	}

	public extendTransaction(schema: TransactionSchema, remove?: boolean) {
		this.extendTransactionSchema(this.tv4, schema, remove);
	}

	private validateSchema<T = any>(
		tv4: tv4.TV4,
		schemaKeyReference: string | tv4.JsonSchema,
		data: T,
	): ISchemaValidationResult<T> {
		try {
			if (typeof schemaKeyReference === "string") {
				schemaKeyReference = tv4.getSchema(schemaKeyReference);
			}
			const result = tv4.validate(data, schemaKeyReference);
			return { error: !result, errors: undefined, value: data };
		} catch (error) {
			return { error: error.stack, errors: [], value: undefined };
		}
	}

	private instantiateTv4(options: Record<string, any>) {
		const tv4Instance = tv4.freshApi();

		tv4Instance.addSchema(schemas);

		return tv4Instance;
	}

	private extendTransactionSchema(tv4: tv4.TV4, schema: TransactionSchema, remove?: boolean) {
		if (tv4.getSchema(schema.$id)) {
			remove = true;
		}

		if (remove) {
			// not supported
		}

		this.transactionSchemas.set(schema.$id, schema);

		tv4.addSchema(schema);
		tv4.addSchema(signedSchema(schema));
		tv4.addSchema(strictSchema(schema));

		this.updateTransactionArray(tv4);
	}

	private updateTransactionArray(tv4: tv4.TV4) {
		// not supported
		//tv4.removeSchema("transactions");
		tv4.addSchema({
			$id: "transactions",
			additionalItems: false,
			items: { anyOf: [...this.transactionSchemas.keys()].map((schema) => ({ $ref: `${schema}Signed` })) },
			type: "array",
		});
	}
}
