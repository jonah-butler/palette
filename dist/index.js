"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
;
;
;
const palette = {
    getMedianColorBlend(d) {
        let r = 0;
        let g = 0;
        let b = 0;
        const a = 255;
        for (let i = 0; i < d.length; i += 4) {
            r += d[i];
            g += d[i + 1];
            b += d[i + 2];
        }
        console.log(r, g, b);
        r = Math.floor(r / d.length);
        g = Math.floor(g / d.length);
        b = Math.floor(b / d.length);
        return {
            r,
            g,
            b,
            a,
        };
    },
    getDominantColor(d) {
        const totals = {};
        let r = 0;
        let g = 0;
        let b = 0;
        const a = 255;
        for (let i = 0; i < d.length - 1; i += 4) {
            r += d[i];
            g += d[i + 1];
            b += d[i + 2];
            const key = `${d[i]}_${d[i + 1]}_${d[i + 2]}_${a}`;
            if (totals[key] === undefined) {
                totals[key] = 1;
            }
            else {
                totals[key] += 1;
            }
        }
        let largest = 0;
        let rgba = "";
        for (const c of Object.keys(totals)) {
            if (totals[c] > largest) {
                largest = totals[c];
                rgba = c;
            }
        }
        const split = rgba.split("_");
        r = parseInt(split[0]);
        g = parseInt(split[1]);
        b = parseInt(split[2]);
        return {
            r,
            g,
            b,
            a,
        };
    },
    getColorPalette(d, startingDepth = 0, maxDepth = 2) {
        const rgbaData = getRGBValues(d);
        return quantizeRGB(rgbaData, startingDepth, maxDepth);
    },
    extractImageDataFromSrc(src, sizeDividend = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const IMAGE = new Image();
            const CANVAS = document.createElement("canvas");
            const CONTEXT = CANVAS.getContext("2d");
            IMAGE.crossOrigin = "anonymous";
            IMAGE.src = src;
            try {
                yield IMAGE.decode();
                CANVAS.width = IMAGE.width / sizeDividend;
                CANVAS.height = IMAGE.height / sizeDividend;
                CONTEXT === null || CONTEXT === void 0 ? void 0 : CONTEXT.drawImage(IMAGE, 0, 0, CANVAS.width, CANVAS.height);
                return CONTEXT === null || CONTEXT === void 0 ? void 0 : CONTEXT.getImageData(0, 0, CANVAS.width, CANVAS.height).data;
            }
            catch (_a) {
                throw new Error(`Failed to decode the provided image src: ${src}`);
            }
        });
    },
    generateMonoChromatic(percent, colors = 4, rgb) {
        const hsl = RGBToHSL(rgb.r, rgb.g, rgb.b);
        let darkL = hsl[2];
        let lightL = hsl[2];
        const darkVals = [];
        const lightVals = [];
        let i = 0;
        while (i < colors) {
            const offset = Math.round(darkL * (percent / 100));
            darkL = darkL - offset;
            lightL = lightL + offset;
            darkVals.push(darkL);
            lightVals.push(lightL);
            i++;
        }
        const monoChromaticPalette = { light: [], dark: [], original: { r: rgb.r, g: rgb.g, b: rgb.b, a: 255 } };
        darkVals.forEach((n) => {
            const rgb = HSLToRGB(hsl[0], hsl[1], n);
            monoChromaticPalette.dark.push({
                r: rgb[0],
                g: rgb[1],
                b: rgb[2],
                a: 255,
            });
        });
        lightVals.forEach((n) => {
            const rgb = HSLToRGB(hsl[0], hsl[1], n);
            monoChromaticPalette.light.push({
                r: rgb[0],
                g: rgb[1],
                b: rgb[2],
                a: 255,
            });
        });
        return monoChromaticPalette;
    }
};
const RGBToHSL = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
        ? l === r
            ? (g - b) / s
            : l === g
                ? 2 + (b - r) / s
                : 4 + (r - g) / s
        : 0;
    return [
        60 * h < 0 ? 60 * h + 360 : 60 * h,
        100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
        (100 * (2 * l - s)) / 2,
    ];
};
const HSLToRGB = (h, s, l) => {
    s /= 100;
    l /= 100;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))];
};
const sortByDominantColor = (d, key) => {
    d.sort((p1, p2) => {
        return p1[key] - p2[key];
    });
};
const getRGBValues = (d) => {
    const rgbaVals = [];
    for (let i = 0; i < d.length; i += 4) {
        rgbaVals.push({
            r: d[i],
            g: d[i + 1],
            b: d[i + 2],
            a: 255,
        });
    }
    return rgbaVals;
};
const quantizeRGB = (d, startingDepth = 0, maxDepth = 2) => {
    if (startingDepth === maxDepth) {
        const color = d.reduce((p, c) => {
            p.r += c.r;
            p.g += c.g;
            p.b += c.b;
            return p;
        }, { r: 0, g: 0, b: 0, a: 255 });
        return [
            {
                r: Math.round(color.r / d.length),
                g: Math.round(color.g / d.length),
                b: Math.round(color.b / d.length),
                a: 255,
            }
        ];
    }
    const dominantColor = findDominantColorRange(d);
    sortByDominantColor(d, dominantColor);
    const middle = d.length / 2;
    return [
        ...quantizeRGB(d.slice(0, middle), startingDepth + 1, maxDepth),
        ...quantizeRGB(d.slice(middle), startingDepth + 1, maxDepth)
    ];
};
const findDominantColorRange = (rgbaRecords) => {
    const d = rgbaRecords[0];
    let rMin = d.r, rMax = d.r;
    let gMin = d.g, gMax = d.g;
    let bMin = d.b, bMax = d.b;
    rgbaRecords.forEach((pixel) => {
        rMin = Math.min(rMin, pixel.r);
        gMin = Math.min(gMin, pixel.g);
        bMin = Math.min(bMin, pixel.b);
        rMax = Math.max(rMax, pixel.r);
        gMax = Math.max(gMax, pixel.g);
        bMax = Math.max(bMax, pixel.b);
    });
    const rRange = rMax - rMin;
    const gRange = gMax - gMin;
    const bRange = bMax - bMin;
    const maxRange = Math.max(rRange, gRange, bRange);
    if (maxRange === rRange) {
        return "r";
    }
    else if (maxRange === gRange) {
        return "g";
    }
    return "b";
};
exports.default = palette;
