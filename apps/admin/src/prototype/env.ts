// 仅在 `vite --mode prototype` 下为 true，development 及其他环境保持原有接口行为。
export const isPrototype = import.meta.env.VITE_PROTOTYPE === 'true'
