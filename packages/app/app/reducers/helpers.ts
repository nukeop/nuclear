import produce from 'immer';

export const handleSpreadAction = <T extends {}, P = any>(state: T, { payload }: { payload: P }) => produce(state, draft => {
  for (const key of Object.keys(payload)) {
    draft[key] = payload[key];
  }
});
