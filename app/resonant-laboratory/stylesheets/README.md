Resonant Laboratory Colors and their meanings
=============================================

We currently make use of three ColorBrewer schemes: [dark](http://colorbrewer2.org/?type=qualitative&scheme=Set1&n=9), [light](http://colorbrewer2.org/?type=qualitative&scheme=Pastel1&n=9), and
[sequential](http://colorbrewer2.org/?type=sequential&scheme=YlGnBu&n=6)

This table outlines how each color is used. To preview the colors on GitHub, paste this code in the browser's console:

```
Array.from(document.getElementsByTagName('td')).filter(function (d) { return d.textContent.startsWith('#'); }).forEach(function (d) { d.setAttribute('style','background-color:' + d.textContent); });
```

| Color           | Hex    | Use(s)                                  |                                         |                                         |   |
|-----------------|--------|-----------------------------------------|-----------------------------------------|-----------------------------------------|---|
| Black           | 000000 | Text (light background)                 |                                         |                                         |   |
| White           | FFFFFF | Panel Background                        | Text (dark background)                  |                                         |   |
| Lightest Green  | A2E4A2 | Dataset view: Overview                  | Matching view: Create a link background |                                         |   |
| Light Green     | 4AC44A |                                         |                                         |                                         |   |
| Green           | 12AF12 | Dataset view: Filtered set              |                                         |                                         |   |
| Dark Green      | 008000 | Success icon                            | Matching view: Create a link            |                                         |   |
| Darkest Green   | 004700 | Dataset view: Current page              |                                         |                                         |   |
| Lightest Blue   | 9AB2D1 | Page Background                         | Alternating table row background        | Matching view: Existing link background |   |
| Light Blue      | 456DA0 | Default color for all icons             |                                         |                                         |   |
| Blue            | 194D8F |                                         |                                         |                                         |   |
| Dark Blue       | 083269 | Matching view: Existing Link            |                                         |                                         |   |
| Darkest Blue    | 021B3A | Header (page, panels, and table)        |                                         |                                         |   |
| Lightest Orange | FFE3B5 | Regular notification background         |                                         |                                         |   |
| Light Orange    | F4BA5C | Rollover                                |                                         |                                         |   |
| Orange          | DA8F16 |                                         |                                         |                                         |   |
| Dark Orange     | 9F6300 | Warning icon                            | Regular notification                    |                                         |   |
| Darkest Orange  | 593700 |                                         |                                         |                                         |   |
| Lightest Red    | FFB5B5 | Matching view: Delete a link background | Error notification background           |                                         |   |
| Light Red       | F45C5C |                                         |                                         |                                         |   |
| Red             | DA1616 |                                         |                                         |                                         |   |
| Dark Red        | 9F0000 | Matching view: Delete a link            | Error notification                      |                                         |   |
| Darkest Red     | 590000 |                                         |                                         |                                         |   |
|                 |        |                                         |                                         |                                         |   |
|                 |        |                                         |                                         |                                         |   |
|                 |        |                                         |                                         |                                         |   |
