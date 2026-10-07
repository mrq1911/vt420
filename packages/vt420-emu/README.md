# @mrq/vt420-emu

A DEC VT420 in memory: page memory, the status line, and every control function of the programmer reference that
concerns one session, answered as the terminal answers (`vt420.js`); its serial line with the terminal's timing and
flow control (`line.js`); its keyboard (`keyboard.js`); its own font, read from its firmware (`font.js`); and the
probe's cases (`probe-cases.js`). Calibrated against a real VT420 and its firmware.

```ts
import { Vt420 } from "@mrq/vt420-emu/vt420.js";
import { Vt420Emulator } from "@mrq/vt420-emu/emulator.js"; // its screen as @mrq/vt420's cells, for tests
```

See [github.com/mrq1911/vt420](https://github.com/mrq1911/vt420). MIT licensed.
