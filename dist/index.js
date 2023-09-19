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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// const IMAGE = new Image();
// const CANVAS: HTMLCanvasElement;
// const CONTEXT = CANVAS.getContext("2d");
var IMAGE, CANVAS, CONTEXT;
// just a dummy src for now
var SRC = "https://dev-blog-resources.s3.amazonaws.com/canvas_1691764016404.png";
var initialize = function () { return __awaiter(void 0, void 0, void 0, function () {
    var data, cd;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                IMAGE = new Image();
                CANVAS = document.createElement("canvas");
                CONTEXT = CANVAS.getContext("2d");
                IMAGE.crossOrigin = "anonymous";
                IMAGE.src = SRC;
                // load image
                return [4 /*yield*/, IMAGE.decode()];
            case 1:
                // load image
                _a.sent();
                setCanvasHeightAndWidth();
                console.log("IMAGE: ", IMAGE);
                CONTEXT === null || CONTEXT === void 0 ? void 0 : CONTEXT.drawImage(IMAGE, 0, 0, CANVAS.width, CANVAS.height);
                data = CONTEXT === null || CONTEXT === void 0 ? void 0 : CONTEXT.getImageData(0, 0, CANVAS.width, CANVAS.height).data;
                if (data) {
                    cd = medianColorBlend(data);
                    console.log("rgba(".concat(cd.r, ", ").concat(cd.g, ", ").concat(cd.b, ", ").concat(cd.a, ")"));
                }
                return [2 /*return*/];
        }
    });
}); };
var setCanvasHeightAndWidth = function () {
    CANVAS.width = IMAGE.width;
    CANVAS.height = IMAGE.height;
};
var medianColorBlend = function (d) {
    var r = 0;
    var g = 0;
    var b = 0;
    var a = 255;
    for (var i = 0; i < d.length; i += 4) {
        r += d[i];
        g += d[i + 1];
        b += d[i + 2];
    }
    console.log(r, g, b);
    r = Math.floor(r / d.length);
    g = Math.floor(g / d.length);
    b = Math.floor(b / d.length);
    return {
        r: r,
        g: g,
        b: b,
        a: a,
    };
};
initialize();
