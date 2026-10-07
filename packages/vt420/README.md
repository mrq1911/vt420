# @mrq/vt420

Drive a DEC VT420 from a program: what the terminal on the other end is and can do, found by asking it
(`terminal.js`); frames drawn in the fewest bytes a serial line has to carry, with hardware scrolling inside margins,
smooth scroll, rectangles, double-size lines and the status line (`renderer.js`); its keyboard decoded
(`input.js`); its character sets (`charset.js`, `cells.js`).

```ts
import { rendererFor } from "@mrq/vt420/renderer.js";
import { Vt420Terminal } from "@mrq/vt420/terminal.js";
```

pi-vt420 and zellij-vt420 are made with it; `@mrq/vt420-emu` is the VT420 to test such programs on. See
[github.com/mrq1911/vt420](https://github.com/mrq1911/vt420). MIT licensed.
