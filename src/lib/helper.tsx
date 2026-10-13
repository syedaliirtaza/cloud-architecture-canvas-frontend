export function toElementPayload(el) {
  return {
    id: el.id,
    type: el.type,
    data: Object.fromEntries(
      Object.entries(el).filter(([k]) => !["id", "type"].includes(k))
    ),
  };
}
