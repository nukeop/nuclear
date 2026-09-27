# Images

## Model

Use `openai/gpt-image-2.5-sunburst`.

| Input | Values |
|---|---|
| `prompt` | Detailed instructions. |
| `quality` | `low` ($0.012) to find the style, `high` ($0.128) for the final image. |
| `aspect_ratio` | An exact size, for example `3840x2160` or `1024x1024`. |
| `input_images` | Reference images. Use `dataUri(path)` from `scripts/replicate.ts` for local files. |
| `background` | `transparent` for images on top of the video. |
| `output_format` | `png` |

The model follows long and precise instructions. It uses many reference images, keeps to hex colors, and can make exact grids. Write a detailed prompt. Give all colors as hex values.

## Procedure

1. Write the prompt.
2. Generate some variants at `low` quality. `low` shows the style and the layout. It does not show the final detail.
3. Let the user select a variant. Change the prompt and generate again until the result is correct.
4. Generate the final image at `high` quality with the same prompt.

## Background images

A background image goes behind the recording. Write these points in the prompt:

- The aspect ratio is 16:9. Use `3840x2160`.
- The app window covers the center 85% of the image. Put all details near the edges and corners, and keep the center calm.
- Use the Nuclear palette. Attach a screenshot of the app as a color reference, and give the colors as hex values.
- The image contains only shapes, patterns, or illustration. It contains no text, logos, UI, or people.

Styles that match Nuclear: neo-brutalist shapes with thick dark outlines and hard shadows, soft gradients with grain, and flat vector illustrations of music objects.

## Nuki

Nuki is the Nuclear mascot. She can react to the video. For example, she points at an element, types fast while the scenario types text, or celebrates at the end.

1. Get reference images of Nuki. Some are in `packages/website/public/images/nuki-*.png`. Ask the user for more if you need other poses.
2. Attach several references.
3. Describe the character in one paragraph: chibi proportions, bold dark outlines, flat cel shading, pastel pink bob hair, a black bow with lace, a pink blouse, a black pleated skirt, pink gloves, white socks, and black shoes. Give the colors as hex values and give the eye color.
4. Describe the pose in one or two sentences.
5. Use `background: "transparent"` and `1024x1024`.

Put the image in the video as a static image. Move it with `Enter` or with `spring` and `interpolate`.
