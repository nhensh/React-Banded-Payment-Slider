var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { t } from "i18next";
import React, { useEffect, useRef, useState } from "react";
import BinIcon from "./icons/BinIcon";
var defaultBands = [
    { from: 0, to: 50, percentage: 50 },
    { from: 50, to: 100, percentage: 100 },
];
var BandedPaymentSlider = function (_a) {
    var initialBands = _a.bands, onBandsChange = _a.onBandsChange;
    var _b = useState(function () {
        return initialBands && initialBands.length > 0
            ? initialBands
            : defaultBands;
    }), bands = _b[0], setBands = _b[1];
    useEffect(function () {
        if (initialBands && initialBands.length > 0) {
            setBands(initialBands);
        }
        else if (!initialBands || initialBands.length === 0) {
            setBands(defaultBands);
        }
    }, [initialBands]);
    var sliderRef = useRef(null);
    var updateBands = function (newBands) {
        setBands(newBands);
        onBandsChange(newBands);
    };
    var handleMarkerDrag = function (index, newPosition) {
        if (index === 0 || index === bands.length)
            return;
        var newBands = bands.map(function (band, i) {
            if (i === index - 1) {
                return __assign(__assign({}, band), { to: newPosition });
            }
            if (i === index) {
                return __assign(__assign({}, band), { from: newPosition });
            }
            return band;
        });
        updateBands(newBands);
    };
    var handlePercentageChange = function (index, newPercentage) {
        var newBands = bands.map(function (band, i) {
            if (i === index) {
                return __assign(__assign({}, band), { percentage: Math.max(0, Math.min(100, newPercentage)) });
            }
            return band;
        });
        updateBands(newBands);
    };
    var handleDeleteBand = function (index) {
        if (bands.length <= 2)
            return;
        var newBands = bands.filter(function (_, i) { return i !== index; });
        if (index > 0 && index < newBands.length) {
            newBands[index - 1] = __assign(__assign({}, newBands[index - 1]), { to: newBands[index].from });
        }
        updateBands(newBands);
    };
    var addNewBand = function (e) {
        var _a;
        if (bands.length === 5)
            return;
        var sliderRect = (_a = sliderRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        if (!sliderRect)
            return;
        var newPosition = Math.round(((e.clientX - sliderRect.left) / sliderRect.width) * 100);
        // Find the index where the new band should be inserted
        var newBandIndex = bands.findIndex(function (band) { return newPosition < band.to; });
        var newBands;
        if (newBandIndex === -1) {
            // Click is after the last band
            newBands = __spreadArray(__spreadArray([], bands, true), [
                {
                    from: bands[bands.length - 1].to,
                    to: 100,
                    percentage: Math.round((bands[bands.length - 1].percentage + 100) / 2),
                },
            ], false);
        }
        else {
            // Split the existing band
            var splitBand = bands[newBandIndex];
            newBands = __spreadArray(__spreadArray(__spreadArray([], bands.slice(0, newBandIndex), true), [
                {
                    from: splitBand.from,
                    to: newPosition,
                    percentage: splitBand.percentage,
                },
                {
                    from: newPosition,
                    to: splitBand.to,
                    percentage: Math.round((splitBand.percentage +
                        (newBandIndex < bands.length - 1
                            ? bands[newBandIndex + 1].percentage
                            : 100)) /
                        2),
                }
            ], false), bands.slice(newBandIndex + 1), true);
        }
        // Ensure 'to' values are correct
        var updatedBands = newBands.map(function (band, index, array) { return (__assign(__assign({}, band), { to: index < array.length - 1 ? array[index + 1].from : 100 })); });
        updateBands(updatedBands);
    };
    var handleMarkerMouseDown = function (e, band, index) {
        var startX = e.clientX;
        var startLeft = band.to;
        var handleMouseMove = function (e) {
            var _a;
            var sliderRect = (_a = sliderRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
            if (!sliderRect)
                return;
            var newPosition = Math.max(0, Math.min(100, Math.round(startLeft + ((e.clientX - startX) / sliderRect.width) * 100)));
            handleMarkerDrag(index + 1, newPosition);
        };
        var handleMouseUp = function () {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };
    return (React.createElement("div", { className: "max-w-3xl mx-auto w-full bg-grey p-4 pt-20" },
        React.createElement("div", { ref: sliderRef, className: "relative h-4", style: {
                background: "linear-gradient(to right, #80cbb4, #009768)",
            } },
            bands.map(function (band, index) { return (React.createElement(React.Fragment, { key: index },
                React.createElement("div", { className: "absolute h-full", style: {
                        left: "".concat(band.from, "%"),
                        width: "".concat(band.to - band.from, "%"),
                    } }),
                index < bands.length - 1 && (React.createElement("div", { className: "absolute flex h-12 w-4 cursor-move items-center justify-center rounded border border-2 border-grey-darker bg-grey-dark", style: {
                        left: "calc(".concat(band.to, "% - 8px)"),
                        top: "calc(50% - 24px)",
                    }, onMouseDown: function (e) { return handleMarkerMouseDown(e, band, index); } },
                    React.createElement("div", { className: "absolute -top-12 left-1/2 -translate-x-1/2 transform" },
                        React.createElement("div", { className: "relative rounded-md border border-black bg-white px-2 py-1 shadow-md" },
                            React.createElement("div", { className: "text-xs font-bold text-black" },
                                band.to,
                                "%"),
                            React.createElement("div", { className: "absolute left-1/2 -bottom-1.5 h-3 w-3 -translate-x-1/2 rotate-45 transform border-r border-b border-black bg-white" }))))))); }),
            __spreadArray([], Array(11), true).map(function (_, i) { return (React.createElement("div", { key: i, className: "absolute h-6 w-[2px] bg-grey-darker", style: { left: "".concat(i * 10, "%"), bottom: -4 } },
                i === 0 && (React.createElement("div", { className: "absolute -bottom-4 text-xs font-bold text-black" }, "0%")),
                i === 10 && (React.createElement("div", { className: "absolute -bottom-4 -left-8 text-xs font-bold text-black" }, "100%")))); }),
            React.createElement("div", { className: "absolute h-4 w-full cursor-pointer", onClick: addNewBand })),
        React.createElement("div", { className: "mt-4 flex justify-around" }, bands.map(function (band, index) { return (React.createElement("div", { key: index, className: "flex flex-col items-center" },
            React.createElement("label", { className: "mr-2 font-bold" }, t("percentage_paid")),
            React.createElement("div", { className: "flex items-center gap-2" },
                React.createElement("input", { "data-testid": "band-start-input-".concat(index), type: "number", value: band.percentage, onChange: function (e) {
                        return handlePercentageChange(index, parseInt(e.target.value));
                    }, className: "w-36 text-right" }),
                React.createElement("button", { "data-testid": "delete-band-button-".concat(index), onClick: function () { return handleDeleteBand(index); }, disabled: bands.length <= 2, className: "text-red-500 ".concat(bands.length <= 2 ? "cursor-not-allowed opacity-50" : "") },
                    React.createElement(BinIcon, null))))); }))));
};
export default BandedPaymentSlider;
