# cards-gallery

Custom **cards** block. 

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row, one cell of content.

## Supported variations

| Variation | Option class |
| --- | --- |
| Alt | `alt` |
| Alt 2 | `alt-2` |

## Universal Editor fields

- Content fields derived from the block's decorate contract.
- `classes` select for options: Alt, Alt 2.

## Content contract

One row per gallery / pack tile. Cells, in order:

1. Image (picture)
2. Count badge text, e.g. "13 Images" or "7 Videos"
3. Text: optional date paragraph, heading (title linked to the gallery), optional teaser, optional "Download" link
