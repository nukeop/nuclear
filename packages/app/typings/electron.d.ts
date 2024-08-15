import { TransformResult } from '@nuclear/core/src/plugins/transform';

declare module 'electron' {
    interface App {
        transformSource: (input: string) => Promise<TransformResult>;
    }
}
