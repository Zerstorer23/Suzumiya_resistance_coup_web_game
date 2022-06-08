export abstract class ObjectPool<K, V> {
    map;

    constructor() {
        this.map = new Map<K, V>();
    }

    get(key: K): V {
        if (!this.map.has(key)) {
            this.map.set(key, this.instantiate(key));
        }
        return this.map.get(key)!;
    }

    abstract instantiate(key: K): V;
}