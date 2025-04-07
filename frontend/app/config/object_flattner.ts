export default class ObjectFlattener{
    static handle(obj: any, prefix = '', result: any = {}) {
        for (const key in obj) {
            const value = obj[key];
            const prefixedKey = prefix ? `${prefix}${key}` : key;

            if (typeof value === 'object' && value !== null && !(value instanceof File)) {
                ObjectFlattener.handle(value, `${prefixedKey}.`, result);
            } else {
                result[prefixedKey] = value;
            }
        }

        return result;
    }

}