import ValueObject from '../core/value-object';
import pinGenerator, { PinProps } from './pin-generator.util';
import { Result } from '../core/result';

interface Prop {
	value: string;
}

/**
 * Pin to use as email confirmation or sms
 * @example ABC-1234
 * @example 123
 * @example ABCDEF-123456
 */
export class PinValueObject extends ValueObject<Prop> {
	private constructor(prop: Prop) {
		super(prop);
	}

	/**
	 * @returns pin as string
	 * @example CTF-8723
	 * @example 52155
	 */
	get value(): string {
		return this.props.value;
	}

	/**
	 *
	 * @param props as object with params
	 * @param numbersLength: 3 | 4 | 5 | 6 | 7
	 * @param lettersLength: 0 | 3 | 4 | 5 | 6 | 7
	 * @default numbersLength 5
	 * @default lettersLength 0
	 * @returns Result PinValueObject as instance
	 */
	public static generatePin(props?: PinProps): Result<PinValueObject> {
		const pin = pinGenerator(props);
		return PinValueObject.create(pin);
	}

	/**
	 *
	 * @param value pin as string
	 * @returns true if pin has a valid pattern and false if not
	 */
	public static isValidValue(value: string): boolean {
		return value.length >= 3 && value.length <= 15;
	}

	/**
	 *
	 * @param pin as string
	 * @returns true if provided pin match with instance value and return false if not
	 */
	compare(pin: string): boolean {
		return pin === this.props.value;
	}

	/**
	 *
	 * @description if not provide a value automatically generate a pin with 5 digits
	 * @param pin as optional string @max 15 digits @min 3 digits
	 * @returns Result PinValueObject as instance
	 * @default 5 digits
	 * @example 98537
	 */
	public static create(pin?: string): Result<PinValueObject> {
		let value: string = pin ?? pinGenerator();

		const isValidValue = PinValueObject.isValidValue(value);
		if (!isValidValue) {
			return Result.fail('Invalid value for a pin');
		}

		return Result.ok(new PinValueObject({ value }));
	}
}
