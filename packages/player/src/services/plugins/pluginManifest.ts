import { z } from 'zod';

import type { PluginManifest } from '@nuclearplayer/plugin-sdk';

const PluginIconLinkSchema = z
  .object({ type: z.literal('link'), link: z.string().min(1) })
  .strict();

const PluginIconSchema = PluginIconLinkSchema;

const NuclearSchema = z
  .object({
    displayName: z.string().min(1).optional(),
    // TODO: Remove category after registry migration to categories
    category: z.string().min(1).optional(),
    categories: z.array(z.string().min(1)).optional(),
    providers: z.array(z.string().min(1)).optional(),
    icon: PluginIconSchema.optional(),
    permissions: z.array(z.string().min(1)).optional(),
  })
  .passthrough();

const PackageJsonSchema = z
  .object({
    name: z.string().min(1),
    version: z.string().min(1),
    description: z.string().min(1),
    author: z.string().min(1),
    main: z.string().min(1).optional(),
    nuclear: NuclearSchema.optional(),
  })
  .passthrough();

type NuclearType = NonNullable<PluginManifest['nuclear']>;

const normalizePermissions = (
  perms: unknown,
  warnings: string[],
): string[] | undefined => {
  if (!Array.isArray(perms)) {
    return undefined;
  }
  const trimmed = perms
    .map((p) => (typeof p === 'string' ? p.trim() : ''))
    .filter((p) => p.length > 0);
  const before = trimmed.length;
  const deduped = Array.from(new Set(trimmed));
  if (deduped.length < before) {
    warnings.push('Duplicate permissions removed.');
  }
  return deduped.sort((a, b) => a.localeCompare(b));
};

const collectUnknownNuclearKeys = (
  nuclear: Record<string, unknown>,
): string[] =>
  Object.keys(nuclear).filter(
    (k) =>
      ![
        'displayName',
        'category',
        'categories',
        'providers',
        'icon',
        'permissions',
      ].includes(k),
  );

const normalizeNuclear = (
  nuclear: z.infer<typeof NuclearSchema> | undefined,
  warnings: string[],
): NuclearType | undefined => {
  if (!nuclear) {
    return undefined;
  }
  const unknown = collectUnknownNuclearKeys(nuclear as Record<string, unknown>);
  if (unknown.length > 0) {
    warnings.push(`nuclear contains unknown keys: ${unknown.join(', ')}`);
  }
  const permissions = normalizePermissions(nuclear.permissions, warnings);
  const category = nuclear.category?.trim();
  const categories = nuclear.categories ?? (category ? [category] : []);
  return {
    displayName: nuclear.displayName?.trim(),
    category,
    categories,
    providers: nuclear.providers,
    icon: nuclear.icon as NuclearType['icon'],
    permissions,
  };
};

type SafeParseSuccess = {
  success: true;
  data: PluginManifest;
  warnings: string[];
};

type SafeParseFailure = {
  success: false;
  errors: string[];
  warnings: string[];
};

type SafeParseResult = SafeParseSuccess | SafeParseFailure;

export const safeParsePluginManifest = (raw: unknown): SafeParseResult => {
  const warnings: string[] = [];
  const result = PackageJsonSchema.safeParse(raw);
  if (!result.success) {
    const errors = result.error.issues.map(
      (i) => `${i.path.join('.')}: ${i.message}`,
    );
    return { success: false, errors, warnings };
  }

  const data = result.data;

  if (!data.main) {
    warnings.push(
      'package.json missing "main"; will attempt fallback resolution (index.js/ts or dist variants).',
    );
  }

  const manifest: PluginManifest = {
    name: data.name.trim(),
    version: data.version.trim(),
    description: data.description.trim(),
    author: data.author.trim(),
    main: data.main?.trim(),
    nuclear: normalizeNuclear(data.nuclear, warnings),
  };

  return { success: true, data: manifest, warnings };
};

export const parsePluginManifest = (raw: unknown): PluginManifest => {
  const res = safeParsePluginManifest(raw);
  if (res.success) {
    return res.data;
  }
  const msg = res.errors.join('; ');
  throw new Error(`Invalid package.json: ${msg}`);
};

export const isPluginManifest = (raw: unknown): raw is PluginManifest =>
  PackageJsonSchema.safeParse(raw).success;
