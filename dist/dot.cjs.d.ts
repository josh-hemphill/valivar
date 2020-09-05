declare const _default: {
    name: string;
    /**
     * Set given `path`
     *
     * @param {Object} obj
     * @param {String} path
     * @param {Mixed} val
     * @return {Object}
     * @api public
     */
    set(obj: Record<string | number | symbol, unknown>, path: string, val: unknown): Record<string | number | symbol, unknown>;
    /**
     * Get given `path`
     *
     * @param {Object} obj
     * @param {String} path
     * @return {Mixed}
     * @api public
     */
    get(obj: Record<string | number | symbol, unknown>, path: string): unknown;
    /**
     * Delete given `path`
     *
     * @param {Object} obj
     * @param {String} path
     * @return {Mixed}
     * @api public
     */
    delete(obj: Record<string | number | symbol, unknown>, path: string): void;
};
export { _default as default };
//# sourceMappingURL=dot.cjs.d.ts.map