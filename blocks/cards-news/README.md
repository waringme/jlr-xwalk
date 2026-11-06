# cards-news

Custom **cards** block. 

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row, one cell of content.

## Supported variations

| Variation | Option class |
| --- | --- |
| Alt | `alt` |
| Video | `video` |
| Video 2 | `video-2` |
| Image Left | `image-left` |
| Image Left Alt | `image-left-alt` |
| Boxed | `boxed` |
| Boxed Alt | `boxed-alt` |
| Image Left 2 | `image-left-2` |

## Universal Editor fields

- Content fields derived from the block's decorate contract.
- `classes` select for options: Alt, Video, Video 2, Image Left, Image Left Alt, Boxed, Boxed Alt, Image Left 2.

## Content contract

One row per news card. Cells, in order:

1. Image (picture) — the article thumbnail
2. Optional count badge text, e.g. "8 Images" (shown over the image; used by the video / video-2 options)
3. Text: date paragraph, heading (title, optionally linked to the article), teaser paragraph, optional "Download" link (press-kit zip) and optional "Read more" link

The card URL is taken from the Read more link, else the title link. Download / favourite / share actions are rendered from the Download link and card URL.
