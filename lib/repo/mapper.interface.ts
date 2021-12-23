import { Result } from "../core/result";
import { ChangesObserver } from '../core/changes-observer';

/**
 * `TargetPersistence` as Entity to persist on database and
 * `DomainAggregate` as Aggregate entity from domain
 * @method toPersistence receives a `DomainAggregate` target and transform it on `TargetPersistence`
 * @method toDomain receives a `TargetPersistence` target and transform it on `DomainAggregate`
 *
 */
export default interface IMapper<DomainAggregate, Entity> {
	toDomain: (target: Entity) => DomainAggregate;
	toPersistence: (target: DomainAggregate) => Entity;
}


/**
 * @description a simple interface that determines conversion method from dto to domain
 * @method toDomain
 */
export interface TMapper<TARGET, RESULT, ERROR = string> {
	/**
	 * @param model must be a persistence model or dto
	 */
	map: (model: TARGET) => Result<RESULT, ERROR>;
 }

/**
 * @description abstract class Mapper with some default methods.
 * @param Props: refer to Aggregate Props, to define key name
 * @param Error: refer to type error to return on Result instance
 *
 * @method addState: add props to state
 * @method getState: get state as array of result
 * @method getStateByKey: get a prop by a key
 * @method resetState: clear all state
 * @method checkState: check all props in state
 */
export abstract class Mapper<PROPS, ERROR = string> {
	private readonly state: Map<keyof PROPS, Result<unknown, ERROR>>;

	constructor() {
		this.state = new Map();
	}

	/**
	 * @description state is located on array. the size is array length.
	 * @returns state size as number: array length
	 */
	protected getSize (): number {
		return this.state.size;
	}

	/**
	 *
	 * @param label a key of PROPS defined as GENERIC
	 * @param value a result of instance defined on generic type
	 */
	protected addState<VO>(label: keyof PROPS, value: Result<VO, ERROR>): void {
		this.state.delete(label);
		this.state.set(label, value);
	}

	/**
	 *
	 * @returns array of results
	 */
	protected getState(): Array<Result<unknown, ERROR>> {
		return [...this.state.values()];
	}

	/**
	 *
	 * @param label a key of props defined on PROPS generic type
	 * @returns a Result of instance defined as generic type by VO
	 */
	protected getStateByKey<VO>(label: keyof PROPS): Result<VO, ERROR> | undefined {
		return this.state.get(label) as Result<VO, ERROR>;
	}

	/**
	 * @description reset all state and clear all props
	 */
	protected resetState(): void {
		this.state.clear();
	}

	/**
	 * @description reset start a new state
	 */
		protected startState(): void {
			this.state.clear();
	}

	/**
	 *
	 * @returns a result on check all props on state.
	 */
	protected checkState(): Result<unknown, ERROR> {
		return ChangesObserver.init(this.getState()).getResult();
	}
}
export abstract class FactoryMethod<TARGET, RESULT, ERROR = string> {
	/**
	 * Method to be implemented
	 */
	protected abstract create(): TMapper<TARGET, RESULT, ERROR>;

	/**
	 *
	 * @param domain as aggregate or entity
	 * @returns a result of model
	 */
	public map (domain: TARGET): Result<RESULT, ERROR> {
		const mapper = this.create();
		return mapper.map(domain);
	};
}

export { IMapper };
