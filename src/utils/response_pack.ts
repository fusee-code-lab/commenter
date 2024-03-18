export function ResponsePack<T>(props: { statusCode?: number; data: T; message?: string }) {
  return {
    statusCode: props.statusCode ?? 200,
    data: props.data,
    message: props.message,
  };
}
