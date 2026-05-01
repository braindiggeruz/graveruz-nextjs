#!/usr/bin/env python3
"""
Strip trailing "| Graver.uz" (and "| Graver.uz Ташкент") from frontmatter title:
in RU blog posts. Leaves ogTitle untouched (social sharing keeps brand).

Root cause: [locale]/layout.tsx sets metadata.template = '%s | Graver.uz',
and buildArticleMetadata returns title as a string (not absolute), so Next.js
appends '| Graver.uz' → duplicate brand in <title>, H1, cards, breadcrumbs.
"""
import re
import pathlib
import sys

BLOG_DIR = pathlib.Path('/app/seo_work/repo/content/blog/ru')
# Matches: " | Graver.uz", " | Graver.uz Ташкент", " — Graver.uz" variants ending the title
# Only strip from title: line, and only at end of title string.
TITLE_RE = re.compile(
    r'^(title:\s*"[^"\n]*?)(\s*(?:\||—|–)\s*Graver\.uz(?:\s+Ташкент)?)\s*"\s*$',
    re.MULTILINE,
)

changed = []
for mdx in sorted(BLOG_DIR.glob('*.mdx')):
    text = mdx.read_text(encoding='utf-8')
    new_text, n = TITLE_RE.subn(r'\1"', text)
    if n:
        mdx.write_text(new_text, encoding='utf-8')
        changed.append(mdx.name)

print(f"Stripped brand suffix from {len(changed)} files:")
for name in changed:
    print(f"  - {name}")
