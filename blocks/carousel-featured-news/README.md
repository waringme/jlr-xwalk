# carousel-featured-news

Custom **carousel** block. 

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row, one cell of content.

## Supported variations

No variations.

## Universal Editor fields

- Content fields derived from the block's decorate contract.

## Content contract

One row per slide. Cells, in order:

1. Image (picture) — the slide image
2. Content: heading (article title, optionally linked), optional description paragraph, date paragraph (e.g. "16 September 2026"), "Find Out More" link to the article, optional "Download" link (press-kit zip)

Slides fade every 5 s (paused on hover/focus and for reduced motion). A single row renders a static slide with no dots.
