/**
 * Custom errors.
 *
 * @private
 */
declare class ValidationError extends Error {
    private defineProp;
    constructor(message: string | undefined, path: unknown);
}
type key = PropertyKey;
type numish = number | string | undefined;
type magnitudeOptions = number | {
    min: numish;
    max: numish;
};
declare const empty: {};
type empty = typeof empty;
type rec = Record<string, unknown>;
type obj = Record<key, unknown>;
type arr = unknown[];
type rule = obj | arr | string | Schema | Property;
interface reportedTypes {
    date: string;
    regexp: string;
    arguments: string;
    array: string;
    error: string;
    null: string;
    undefined: string;
    nan: string;
    element: string;
    buffer: string;
}
type typeOf_Key = keyof reportedTypes;
type unknownFunction = (val: unknown) => unknown;
type typecasters = {
    string(val: unknown): string;
    number(val: unknown): number;
    date(val: unknown): Date;
    array(val: unknown): Array<unknown>;
    boolean(val: unknown): boolean;
    object(val: unknown): NonNullable<Record<string, unknown>> | typeof empty;
    [index: string]: unknownFunction;
};
type hookFunction = (path: string, prop: Property) => void;
interface ValidationFunction {
    (value: unknown, ctx: obj, ...args: unknown[]): boolean;
}
type messageOpts = boolean | number | string | {
    args: messageOpts;
    fn: CallableFunction[];
} | CallableFunction;
type messageFunction = (prop: string, ctx: obj, ...options: messageOpts[]) => string;
type argsTypes = CallableFunction | boolean | string | number | rec | arr | RegExp;
declare const Messages: {
    type(prop: string, ctx: rec | empty, type: string | unknown): string;
    required(prop: string): string;
    match(prop: string, ctx: rec | empty, regexp: string | RegExp): string;
    length(prop: string, ctx: rec | empty, len: number | {
        min?: number;
        max?: number;
    }): string;
    size(prop: string, ctx: rec | empty, size: number | {
        min?: number;
        max?: number;
    }): string;
    enum(prop: string, ctx: rec | empty, enums: PropertyKey[]): string;
    illegal(prop: string): string;
    default(prop: string): string;
};
// eslint-disable-next-line @typescript-eslint/ban-types
type TypeFunction = Function;
/**
 * Default validators.
 *
 * @private
 */
declare const Validators: {
    required(value: unknown, ctx: rec | empty, required: boolean): value is true;
    type(value: unknown, ctx: rec | empty, name: typeOf_Key | TypeFunction): boolean;
    length(value: string | unknown[] | null | undefined, ctx: rec | empty, len: magnitudeOptions): boolean;
    size(value: number | null | undefined, ctx: rec | empty, size: magnitudeOptions): boolean;
    enum(value: unknown, ctx: rec | empty, enums: unknown[]): boolean;
    match(value: string | null | undefined, ctx: rec | empty, regexp: RegExp): boolean;
};
type ValidatorProps = typeof Validators & Record<string, ValidationFunction>;
/**
 * A property instance gets returned whenever you call `schema.path()`.
 * Properties are also created internally when an object is passed to the Schema constructor.
 *
 * @param {String} name - the name of the property
 * @param {Schema} schema - parent schema
 */
declare class Property {
    name: string;
    registry: Record<string, {
        args: argsTypes[];
        fn: ValidationFunction | undefined;
    }>;
    _schema: Schema;
    _type: string | number | null | CallableFunction;
    messages: Record<string, string | messageFunction>;
    constructor(name: string, schema: Schema);
    /**
     * Registers messages.
     *
     * @example
     * prop.message('something is wrong')
     * prop.message({ required: 'thing is required.' })
     *
     * @param {Object|String} messages
     * @return {Property}
     */
    message(messages: Record<string, string | messageFunction> | string): this;
    /**
     * Mount given `schema` on current path.
     *
     * @example
     * const user = new Schema({ email: String })
     * prop.schema(user)
     *
     * @param {Schema} schema - the schema to mount
     * @return {Property}
     */
    schema(schema: Schema): this;
    /**
     * Validate using named functions from the given object.
     * Error messages can be defined by providing an object with
     * named error messages/generators to `schema.message()`
     *
     * The message generator receives the value being validated,
     * the object it belongs to and any additional arguments.
     *
     * @example
     * const schema = new Schema()
     * const prop = schema.path('some.path')
     *
     * schema.message({
     *   binary: (path, ctx) => `${path} must be binary.`,
     *   bits: (path, ctx, bits) => `${path} must be ${bits}-bit`
     * })
     *
     * prop.use({
     *   binary: (val, ctx) => /^[01]+$/i.test(val),
     *   bits: [(val, ctx, bits) => val.length == bits, 32]
     * })
     *
     * @param {Object} fns - object with named validation functions to call
     * @return {Property}
     */
    use(fns: Record<key, ValidationFunction | ValidationFunction[]>): this;
    /**
     * Registers a validator that checks for presence.
     *
     * @example
     * prop.required()
     *
     * @param {Boolean} [bool] - `true` if required, `false` otherwise
     * @return {Property}
     */
    required(bool?: boolean): this;
    /**
     * Registers a validator that checks if a value is of a given `type`
     *
     * @example
     * prop.type(String)
     *
     * @example
     * prop.type('string')
     *
     * @param {String|Function} type - type to check for
     * @return {Property}
     */
    type(type: string | CallableFunction): this;
    /**
     * Convenience method for setting type to `String`
     *
     * @example
     * prop.string()
     *
     * @return {Property}
     */
    string(): this;
    /**
     * Convenience method for setting type to `Number`
     *
     * @example
     * prop.number()
     *
     * @return {Property}
     */
    number(): this;
    /**
     * Convenience method for setting type to `Array`
     *
     * @example
     * prop.array()
     *
     * @return {Property}
     */
    array(): this;
    /**
     * Convenience method for setting type to `Object`
     *
     * @example
     * prop.object()
     *
     * @return {Property}
     */
    object(): this;
    /**
     * Convenience method for setting type to `Date`
     *
     * @example
     * prop.date()
     *
     * @return {Property}
     */
    date(): this;
    /**
     * Registers a validator that checks length.
     *
     * @example
     * prop.length({ min: 8, max: 255 })
     * prop.length(10)
     *
     * @param {Object|Number} rules - object with `.min` and `.max` properties or a number
     * @param {Number} rules.min - minimum length
     * @param {Number} rules.max - maximum length
     * @return {Property}
     */
    length(rules: magnitudeOptions): this;
    /**
     * Registers a validator that checks size.
     *
     * @example
     * prop.size({ min: 8, max: 255 })
     * prop.size(10)
     *
     * @param {Object|Number} rules - object with `.min` and `.max` properties or a number
     * @param {Number} rules.min - minimum size
     * @param {Number} rules.max - maximum size
     * @return {Property}
     */
    size(rules: magnitudeOptions): this;
    /**
     * Registers a validator for enums.
     *
     * @example
     * prop.enum(['cat', 'dog'])
     *
     * @param {Array} rules - allowed values
     * @return {Property}
     */
    enum(enums: unknown[]): this;
    /**
     * Registers a validator that checks if a value matches given `regexp`.
     *
     * @example
     * prop.match(/some\sregular\sexpression/)
     *
     * @param {RegExp} regexp - regular expression to match
     * @return {Property}
     */
    match(regexp: RegExp): this;
    /**
     * Registers a validator that checks each value in an array against given `rules`.
     *
     * @example
     * prop.each({ type: String })
     * prop.each([{ type: Number }])
     * prop.each({ things: [{ type: String }]})
     * prop.each(schema)
     *
     * @param {Array|Object|Schema|Property} rules - rules to use
     * @return {Property}
     */
    each(rules: rule | undefined): this;
    /**
     * Registers paths for array elements on the parent schema, with given array of rules.
     *
     * @example
     * prop.elements([{ type: String }, { type: Number }])
     *
     * @param {Array} arr - array of rules to use
     * @return {Property}
     */
    elements(arr: rule[]): this;
    /**
     * Registers all properties from the given object as nested properties
     *
     * @example
     * prop.properties({
     *   name: String,
     *   email: String
     * })
     *
     * @param {Object} props - properties with rules
     * @return {Property}
     */
    properties(props: Record<string, rule>): this;
    /**
     * Proxy method for schema path. Makes chaining properties together easier.
     *
     * @example
     * schema
     *   .path('name').type(String).required()
     *   .path('email').type(String).required()
     *
     */
    path(path: string, rules?: rule): Property;
    /**
     * Typecast given `value`
     *
     * @example
     * prop.type(String)
     * prop.typecast(123) // => '123'
     *
     * @param {Mixed} value - value to typecast
     * @return {Mixed}
     */
    typecast(value: unknown): unknown;
    /**
     * Validate given `value`
     *
     * @example
     * prop.type(Number)
     * assert(prop.validate(2) == null)
     * assert(prop.validate('hello world') instanceof Error)
     *
     * @param {Mixed} value - value to validate
     * @param {Object} ctx - the object containing the value
     * @param {String} [path] - path of the value being validated
     * @return {ValidationError}
     */
    validate(value: unknown, ctx: obj, path?: string): ValidationError | null;
    /**
     * Run validator of given `type`
     *
     * @param {String} type - type of validator
     * @param {Mixed} value - value to validate
     * @param {Object} ctx - the object containing the value
     * @param {String} path - path of the value being validated
     * @return {ValidationError}
     * @private
     */
    _run(type: string, value: unknown, ctx: obj, path: string): ValidationError | void;
    /**
     * Register validator
     *
     * @param {String} type - type of validator
     * @param {Array} args - argument to pass to validator
     * @param {Function} [fn] - custom validation function to call
     * @return {Property}
     * @private
     */
    _register(type: string, args: argsTypes[], fn?: ValidationFunction): this;
    /**
     * Create an error
     *
     * @param {String} type - type of validator
     * @param {Object} ctx - the object containing the value
     * @param {Array} args - arguments to pass
     * @param {String} path - path of the value being validated
     * @return {ValidationError}
     * @private
     */
    _error(type: string, ctx: obj, args: messageOpts[], path: string): ValidationError;
    _isValidator(fnName: string): fnName is keyof ValidatorProps;
    _isMessage(fnName: string): fnName is keyof typeof Messages;
}
type validationOptions = {
    typecast?: boolean;
    strip?: boolean;
    strict?: boolean;
};
/**
 * @module Schema
 */
/**
 * A Schema defines the structure that objects should be validated against.
 * @example
 * const post = new Schema({
 *   title: {
 *     type: String,
 *     required: true,
 *     length: { min: 1, max: 255 }
 *   },
 *   content: {
 *     type: String,
 *     required: true
 *   },
 *   published: {
 *     type: Date,
 *     required: true
 *   },
 *   keywords: [{ type: String }]
 * })
 *
 * @param {Object} [obj] - schema definition
 * @param {Object} [opts] - options
 * @param {Boolean} [opts.typecast=false] - typecast values before validation
 * @param {Boolean} [opts.strip=true] - strip properties not defined in the schema
 * @param {Boolean} [opts.strict=false] - validation fails when object contains properties not defined in the schema
 */
declare class Schema {
    opts: Record<key, unknown>;
    hooks: hookFunction[];
    props: Record<key, Property>;
    messages: Record<string, messageOpts>;
    validators: ValidatorProps;
    typecasters: typecasters;
    static ValidationError: typeof ValidationError;
    constructor(obj?: Record<key, rule>, opts?: Record<key, unknown>);
    /**
   * Create or update `path` with given `rules`.
   *
   * @example
   * const schema = new Schema()
   * schema.path('name.first', { type: String })
   * schema.path('name.last').type(String).required()
   *
   * @param {String} path - full path using dot-notation
   * @param {Object|Array|String|Schema|Property} [rules] - rules to apply
   * @return {Property}
   */
    /**
     * Create or update `path` with given `rules`.
     *
     * @example
     * const schema = new Schema()
     * schema.path('name.first', { type: String })
     * schema.path('name.last').type(String).required()
     *
     * @param {String} path - full path using dot-notation
     * @param {Object|Array|String|Schema|Property} [rules] - rules to apply
     * @return {Property}
     */
    path(path: string, rules?: rule | rule[]): Property;
    /**
   * Typecast given `obj`.
   *
   * @param {Object} obj - the object to typecast
   * @return {Schema}
   * @private
   */
    /**
     * Typecast given `obj`.
     *
     * @param {Object} obj - the object to typecast
     * @return {Schema}
     * @private
     */
    typecast(obj: unknown): this;
    /**
   * Strip all keys not defined in the schema
   *
   * @param {Object} obj - the object to strip
   * @param {String} [prefix]
   * @return {Schema}
   * @private
   */
    /**
     * Strip all keys not defined in the schema
     *
     * @param {Object} obj - the object to strip
     * @param {String} [prefix]
     * @return {Schema}
     * @private
     */
    strip(obj: unknown): this;
    /**
   * Create errors for all properties that are not defined in the schema
   *
   * @param {Object} obj - the object to check
   * @return {Schema}
   * @private
   */
    /**
     * Create errors for all properties that are not defined in the schema
     *
     * @param {Object} obj - the object to check
     * @return {Schema}
     * @private
     */
    enforce(obj: obj): ValidationError[] | [];
    /**
   * Validate given `obj`.
   *
   * @example
   * const schema = new Schema({ name: { required: true }})
   * const errors = schema.validate({})
   * assert(errors.length == 1)
   * assert(errors[0].message == 'name is required')
   * assert(errors[0].path == 'name')
   *
   * @param {Object} obj - the object to validate
   * @param {Object} [opts] - options, see [Schema](#schema-1)
   * @return {Array}
   */
    /**
     * Validate given `obj`.
     *
     * @example
     * const schema = new Schema({ name: { required: true }})
     * const errors = schema.validate({})
     * assert(errors.length == 1)
     * assert(errors[0].message == 'name is required')
     * assert(errors[0].path == 'name')
     *
     * @param {Object} obj - the object to validate
     * @param {Object} [opts] - options, see [Schema](#schema-1)
     * @return {Array}
     */
    validate(obj: obj, opts?: validationOptions): ValidationError[] | [];
    /**
   * Assert that given `obj` is valid.
   *
   * @example
   * const schema = new Schema({ name: String })
   * schema.assert({ name: 1 }) // Throws an error
   *
   * @param {Object} obj
   * @param {Object} [opts]
   */
    /**
     * Assert that given `obj` is valid.
     *
     * @example
     * const schema = new Schema({ name: String })
     * schema.assert({ name: 1 }) // Throws an error
     *
     * @param {Object} obj
     * @param {Object} [opts]
     */
    assert(obj: obj, opts: validationOptions): void;
    /**
   * Override default error messages.
   *
   * @example
   * const hex = (val) => /^0x[0-9a-f]+$/.test(val)
   * schema.path('some.path').use({ hex })
   * schema.message('hex', path => `${path} must be hexadecimal`)
   *
   * @example
   * schema.message({ hex: path => `${path} must be hexadecimal` })
   *
   * @param {String|Object} name - name of the validator or an object with name-message pairs
   * @param {String|Function} [message] - the message or message generator to use
   * @return {Schema}
   */
    /**
     * Override default error messages.
     *
     * @example
     * const hex = (val) => /^0x[0-9a-f]+$/.test(val)
     * schema.path('some.path').use({ hex })
     * schema.message('hex', path => `${path} must be hexadecimal`)
     *
     * @example
     * schema.message({ hex: path => `${path} must be hexadecimal` })
     *
     * @param {String|Object} name - name of the validator or an object with name-message pairs
     * @param {String|Function} [message] - the message or message generator to use
     * @return {Schema}
     */
    message(name: string | {
        [index: string]: string;
    }, message: string | CallableFunction): this;
    /**
   * Override default validators.
   *
   * @example
   * schema.validator('required', val => val != null)
   *
   * @example
   * schema.validator({ required: val => val != null })
   *
   * @param {String|Object} name - name of the validator or an object with name-function pairs
   * @param {Function} [fn] - the function to use
   * @return {Schema}
   */
    /**
     * Override default validators.
     *
     * @example
     * schema.validator('required', val => val != null)
     *
     * @example
     * schema.validator({ required: val => val != null })
     *
     * @param {String|Object} name - name of the validator or an object with name-function pairs
     * @param {Function} [fn] - the function to use
     * @return {Schema}
     */
    validator(name: string | {
        [index: string]: CallableFunction;
    }, fn: CallableFunction): this;
    /**
   * Override default typecasters.
   *
   * @example
   * schema.typecaster('SomeClass', val => new SomeClass(val))
   *
   * @example
   * schema.typecaster({ SomeClass: val => new SomeClass(val) })
   *
   * @param {String|Object} name - name of the validator or an object with name-function pairs
   * @param {Function} [fn] - the function to use
   * @return {Schema}
   */
    /**
     * Override default typecasters.
     *
     * @example
     * schema.typecaster('SomeClass', val => new SomeClass(val))
     *
     * @example
     * schema.typecaster({ SomeClass: val => new SomeClass(val) })
     *
     * @param {String|Object} name - name of the validator or an object with name-function pairs
     * @param {Function} [fn] - the function to use
     * @return {Schema}
     */
    typecaster(name: string | {
        [index: string]: CallableFunction;
    }, fn: CallableFunction): this;
    /**
   * Accepts a function that is called whenever new props are added.
   *
   * @param {Function} fn - the function to call
   * @return {Schema}
   * @private
   */
    /**
     * Accepts a function that is called whenever new props are added.
     *
     * @param {Function} fn - the function to call
     * @return {Schema}
     * @private
     */
    hook(fn: hookFunction): this;
    /**
   * Notify all subscribers that a property has been added.
   *
   * @param {String} path - the path of the property
   * @param {Property} prop - the new property
   * @return {Schema}
   * @private
   */
    /**
     * Notify all subscribers that a property has been added.
     *
     * @param {String} path - the path of the property
     * @param {Property} prop - the new property
     * @return {Schema}
     * @private
     */
    propagate(path: string, prop: Property): this;
}
export { Schema };
//# sourceMappingURL=valivar.d.ts.map