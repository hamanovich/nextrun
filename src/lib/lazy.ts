export const lazyClient = <T extends object>(factory: () => T): T => {
  let instance: T | undefined;
  const resolve = (): T => (instance ??= factory());

  return new Proxy({} as T, {
    get: (_target, prop) => {
      const client = resolve();
      const value = Reflect.get(client, prop, client);
      return typeof value === "function" ? value.bind(client) : value;
    },
    has: (_target, prop) => prop in resolve(),
  });
};
