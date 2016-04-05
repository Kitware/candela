# [candela](../..#readme).[components](..#readme).Bullet

A bullet chart based on the [description by Perceptual Edge](http://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf).
The visualization takes a numeric **value** and plots it on a one-dimensional
plot against comparison **markers** and background color **ranges**.

**extends** [VisComponent](../../VisComponent#readme)

### new Bullet(el, options)

* **el** is the DOM element that will contain the visualization.

* **options** is an object with the following fields:

| Option    | Type   | Description  |
| :-------- | :----- | :----------- |
| width     | Number | Width of the chart in pixels. See [Sizing](../../#sizing). |
| height    | Number | Height of the chart in pixels. See [Sizing](../../#sizing). |
| renderer  | String | Whether to render in "svg" or "canvas" mode (default "canvas"). |
| value     | Number | The value to plot in the bullet chart. |
| title     | String | The title to show to the left of the chart. |
| subtitle  | String | An optional subtitle to display below the title. |
| markers   | Array of Number | Comparative markers to display as vertical lines. |
| ranges    | Array of [Range](#range-options) | Background ranges to display under the chart. |

### Range Options

A range represents a visual range of an axis with background and foreground colors.
It consists of an object with the following fields:

| Option    | Type   | Description  |
| :-------- | :----- | :----------- |
| min       | Number | The minimum value of the range. |
| max       | Number | The maximum value of the range. |
| background | String | The background color of the range. |
| foreground | String | The color of values and markers that fall in this range (default: `'black'`). |
