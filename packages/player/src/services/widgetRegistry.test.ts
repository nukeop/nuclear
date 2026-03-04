import type { CustomWidgetComponent } from '@nuclearplayer/plugin-sdk';

import { createWidgetRegistry } from './widgetRegistry';

const FakeWidget: CustomWidgetComponent = () => null;
const AnotherFakeWidget: CustomWidgetComponent = () => null;

describe('WidgetRegistry', () => {
  it('registers and retrieves a widget', () => {
    const registry = createWidgetRegistry();

    registry.register('lastfm', 'auth', FakeWidget);

    expect(registry.get('lastfm', 'auth')).toBe(FakeWidget);
  });

  it('returns undefined for unregistered widgets', () => {
    const registry = createWidgetRegistry();

    expect(registry.get('lastfm', 'auth')).toBeUndefined();
  });

  it('unregisters a widget', () => {
    const registry = createWidgetRegistry();

    registry.register('lastfm', 'auth', FakeWidget);
    registry.unregister('lastfm', 'auth');

    expect(registry.get('lastfm', 'auth')).toBeUndefined();
  });

  it('namespaces widgets by plugin ID', () => {
    const registry = createWidgetRegistry();

    registry.register('lastfm', 'auth', FakeWidget);
    registry.register('listenbrainz', 'auth', AnotherFakeWidget);

    expect(registry.get('lastfm', 'auth')).toBe(FakeWidget);
    expect(registry.get('listenbrainz', 'auth')).toBe(AnotherFakeWidget);
  });

  it('isolates widgets between registry instances', () => {
    const registryA = createWidgetRegistry();
    const registryB = createWidgetRegistry();

    registryA.register('lastfm', 'auth', FakeWidget);

    expect(registryB.get('lastfm', 'auth')).toBeUndefined();
  });
});
