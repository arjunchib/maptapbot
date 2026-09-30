function ensure(name: string) {
  const value = Bun.env[name];
  if (value == null) throw new Error(`Missing ${name} variable`);
  return value;
}

export const environment = {
  channel_id: ensure("CHANNEL_ID"),
  send_channel_id: ensure("SEND_CHANNEL_ID"),
};
