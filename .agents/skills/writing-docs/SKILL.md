---
name: writing-docs
description: Use when writing or editing documentation in packages/docs. Covers Gitbook markdown syntax, special blocks, page structure, and the SUMMARY.md table of contents. Trigger phrases include "write docs", "add documentation", "docs page", "gitbook", "user manual".
---

# Writing Documentation

Docs live in `packages/docs/`. Hosted on Gitbook, synced from the repo via `.gitbook.yaml`.

## Page structure

Every page starts with YAML frontmatter and a top-level heading:

```markdown
---
description: Short description shown in search and link previews
---

# Page title
```

## Table of contents

`packages/docs/SUMMARY.md` defines the sidebar navigation. Group pages under `##` headings:

```markdown
# Table of contents

* [Nuclear Documentation](README.md)

## User Manual

* [Getting started](user-manual/getting-started.md)
* [Installation](user-manual/installation.md)

## Plugins

* [Getting started](plugins/getting-started.md)
```

When adding a new page, always add it to SUMMARY.md or it won't appear in the sidebar.

## Gitbook special blocks

### Tabs

Use for platform-specific instructions or language variants:

```markdown
{% tabs %}

{% tab title="Windows" %}
Content for Windows.
{% endtab %}

{% tab title="macOS" %}
Content for macOS.
{% endtab %}

{% tab title="Linux" %}
Content for Linux.
{% endtab %}

{% endtabs %}
```

Tabs can contain any block type (code, tables, lists, images) but cannot nest other tabs or expandables.

### Hints (callouts)

Four styles: `info`, `success`, `warning`, `danger`.

```markdown
{% hint style="info" %}
General information or tips.
{% endhint %}

{% hint style="warning" %}
Non-critical warnings or gotchas.
{% endhint %}

{% hint style="danger" %}
Destructive actions or critical information.
{% endhint %}

{% hint style="success" %}
Positive actions or confirmations.
{% endhint %}
```

### Code blocks with options

Wrap in `{% code %}` for title, line numbers, or wrapping:

````markdown
{% code title="config.json" overflow="wrap" lineNumbers="true" %}

```json
{
  "key": "value"
}
```

{% endcode %}
````

Without the wrapper, standard fenced code blocks work fine.

### Expandable (collapsible sections)

Uses standard HTML `<details>` / `<summary>`:

```markdown
<details>

<summary>Click to expand</summary>

Hidden content goes here. Supports lists and code blocks.

</details>
```

Add `open` attribute to expand by default: `<details open>`.

### Page links

Prominent block-level links to other pages:

```markdown
{% content-ref url="getting-started.md" %}
[Getting started](getting-started.md)
{% endcontent-ref %}
```

### Cards

Grid layout for landing pages. Uses a table with `data-view="cards"`:

```markdown
<table data-view="cards">
  <thead>
    <tr>
      <th></th>
      <th></th>
      <th data-hidden data-card-target data-type="content-ref"></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Card title</strong></td>
      <td>Card description.</td>
      <td><a href="page.md">page.md</a></td>
    </tr>
  </tbody>
</table>
```

### Annotations (footnotes)

```markdown
Nuclear uses plugins[^1] to provide functionality.

[^1]: Plugins are installed from the plugin store.
```

## Content guidelines

- No brand names of third-party services in docs
- All user-facing strings reference i18n keys, not hardcoded text
- Use relative links between docs pages (`../themes/themes.md`), not absolute URLs
- Keep pages focused on one topic. Link to related pages instead of duplicating content.
- Describe the UI as the user sees it: use actual button labels, menu names, and icon descriptions
