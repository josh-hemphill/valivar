/**
 * Get and set points in an object by their 'dot' path
 * @category Bonus Modules
 * @exports dot
 * @public
 */
declare const dot: {
    name: string;
    /**
     * Set given `path`
     *
     * @param {Object} obj
     * @param {String} path
     * @param {Mixed} val
     * @return {Object}
     * @public
     */
    set(obj: Record<string | number | symbol, unknown>, path: string, val: unknown): Record<string | number | symbol, unknown>;
    /**
     * Get given `path`
     *
     * @param {Object} obj
     * @param {String} path
     * @return {Mixed}
     * @public
     */
    get(obj: Record<string | number | symbol, unknown>, path: string): unknown;
    /**
     * Delete given `path`
     *
     * @param {Object} obj
     * @param {String} path
     * @return {Mixed}
     * @public
     */
    delete(obj: Record<string | number | symbol, unknown>, path: string): void;
};
export { dot };
//# sourceMappingURL=dot.esm.d.ts.map