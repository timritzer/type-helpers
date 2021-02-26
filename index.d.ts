//Utility types

//Any Facade's. These likely need to die, but until then don't export unless absolutely needed.
export type AnyParameter = any; //eslint-disable-line @typescript-eslint/no-explicit-any
export type AnyReturn = any; //eslint-disable-line @typescript-eslint/no-explicit-any
export type AnyArray = any[]; //eslint-disable-line @typescript-eslint/no-explicit-any
export type AnyStringRecord = Record<string, any>; //eslint-disable-line @typescript-eslint/no-explicit-any

export type AnyFunction = (...args: any) => any; //eslint-disable-line @typescript-eslint/no-explicit-any
export type AnyFunctionOrNever<T> = T extends AnyFunction ? T : never;

//Unwrap any string-ish types for use in generics, to force strict typing (don't widen to string)
export type UnderlyingString<T extends string> = `${T}`;

//Path Utilities

// Get the valid keys and subkeys of an type
// ex: const object = { a: 1, b: { c: true } };
// Path<typeof object, "." > = "a" | "b" | "b.c"
// Change the seperator to use slash notation, or any other path notation(b/c or b|c whatever is needed)
export type Path<T, Seperator extends string = "."> =
	| keyof T
	| RecursivePath<T, keyof T, Seperator>; //Keys of the current oject, and keys of any sub objects

//  Get the type of the given key path within a parent type
// ex: const object = { a: 1, b: { c: true } };
// PathValue<typeof object, "b.c", "." > = boolean
export type PathValue<
	T,
	P extends Path<T, Seperator> & string,
	Seperator extends string = "."
> = UnderlyingString<P> extends `${infer Key}${Seperator}${infer Rest}`
	? Key extends keyof T
		? Rest extends Path<T[Key], Seperator>
			? PathValue<T[Key], Rest, Seperator>
			: never
		: never
	: UnderlyingString<P> extends keyof T
	? T[UnderlyingString<P>]
	: never;

//Internal recursive helper type. Don't use directly. Use Path and PathValue
type RecursivePath<
	T,
	Key extends keyof T,
	Seperator extends string = "/"
> = Key extends string
	? T[Key] extends AnyStringRecord //Parent Type Gets all of the parent object keys, so get this is only recursive keys
		?
				| `${Key}${Seperator}${RecursivePath<
						T[Key],
						NonArrayKeys<T[Key]>,
						Seperator
				  > &
						string}` //Recurse for any nested paths
				| `${Key}${Seperator}${NonArrayKeys<T[Key]> & string}` //Base case, all the keys of the current sub object (T[Key])
		: never
	: never;

export type Replace<
	TString,
	TCharacter extends string,
	TReplacement extends string
> = TString extends `${infer TStart}${TCharacter}${infer TEnd}`
	? Replace<`${TStart}${TReplacement}${TEnd}`, TCharacter, TReplacement>
	: TString;

export type NonArrayKeys<T> = Exclude<keyof T, keyof AnyArray>;

export type ParametersSkipOne<
	T extends (firstArg: AnyParameter, ...args: AnyArray) => AnyReturn
> = T extends (firstArg: AnyParameter, ...args: infer P) => AnyReturn
	? P
	: never;

export type IsNeverType<T> = [T] extends [never] ? true : never;

// Remove types from T that are assignable to U
export type Diff<T, U> = T extends U ? never : T;
// Remove types from T that are not assignable to U
export type Filter<T, U> = T extends U ? T : never;

export type ElementIfArray<TMaybeArray> = TMaybeArray extends Array<infer TElem>
	? TElem
	: TMaybeArray;

export type IfDefined<TObj> = Exclude<TObj, undefined>;

export type IsPlainObject<TObject> = IfDefined<TObject> extends AnyStringRecord
	? IfDefined<TObject> extends IsArray<TObject>
		? never
		: TObject
	: never;

export type IsArray<TObj> = IfDefined<TObj> extends AnyArray ? TObj : never;

export type IsObjectArray<TArray> = IfDefined<TArray> extends Array<infer TItem>
	? IfDefined<TItem> extends IsPlainObject<TItem>
		? TArray
		: never
	: never;

export type ToUnion<Object extends Record<any, any>> = Object extends Record<any, infer TValue> ? TValue : never;
export type ToIntersection<Object extends Record<any, any>> = UnionToIntersection<ToUnion<Object>>;

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;
