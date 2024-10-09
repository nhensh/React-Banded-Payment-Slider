import { t } from "i18next";
import React, { useEffect, useRef, useState } from "react";

import BinIcon from "./icons/BinIcon";

interface Band {
  from: number;
  to: number;
  percentage: number;
}

interface Props {
  bands: Band[];
  onBandsChange: (bands: Band[]) => void;
}

const defaultBands: Band[] = [
  { from: 0, to: 50, percentage: 50 },
  { from: 50, to: 100, percentage: 100 },
];

const BandedPaymentSlider: React.FC<Props> = ({
  bands: initialBands,
  onBandsChange,
}) => {
  const [bands, setBands] = useState<Band[]>(() => {
    return initialBands && initialBands.length > 0
      ? initialBands
      : defaultBands;
  });

  useEffect(() => {
    if (initialBands && initialBands.length > 0) {
      setBands(initialBands);
    } else if (!initialBands || initialBands.length === 0) {
      setBands(defaultBands);
    }
  }, [initialBands]);

  const sliderRef = useRef<HTMLDivElement>(null);

  const updateBands = (newBands: Band[]) => {
    setBands(newBands);
    onBandsChange(newBands);
  };

  const handleMarkerDrag = (index: number, newPosition: number) => {
    if (index === 0 || index === bands.length) return;

    const newBands = bands.map((band, i) => {
      if (i === index - 1) {
        return { ...band, to: newPosition };
      }
      if (i === index) {
        return { ...band, from: newPosition };
      }
      return band;
    });

    updateBands(newBands);
  };

  const handlePercentageChange = (index: number, newPercentage: number) => {
    const newBands = bands.map((band, i) => {
      if (i === index) {
        return {
          ...band,
          percentage: Math.max(0, Math.min(100, newPercentage)),
        };
      }
      return band;
    });

    updateBands(newBands);
  };

  const handleDeleteBand = (index: number) => {
    if (bands.length <= 2) return;

    const newBands = bands.filter((_, i) => i !== index);
    if (index > 0 && index < newBands.length) {
      newBands[index - 1] = {
        ...newBands[index - 1],
        to: newBands[index].from,
      };
    }

    updateBands(newBands);
  };

  const addNewBand = (e: React.MouseEvent<HTMLDivElement>) => {
    if (bands.length === 5) return;
    const sliderRect = sliderRef.current?.getBoundingClientRect();
    if (!sliderRect) return;

    const newPosition = Math.round(
      ((e.clientX - sliderRect.left) / sliderRect.width) * 100
    );

    // Find the index where the new band should be inserted
    const newBandIndex = bands.findIndex((band) => newPosition < band.to);

    let newBands: Band[];

    if (newBandIndex === -1) {
      // Click is after the last band
      newBands = [
        ...bands,
        {
          from: bands[bands.length - 1].to,
          to: 100,
          percentage: Math.round(
            (bands[bands.length - 1].percentage + 100) / 2
          ),
        },
      ];
    } else {
      // Split the existing band
      const splitBand = bands[newBandIndex];
      newBands = [
        ...bands.slice(0, newBandIndex),
        {
          from: splitBand.from,
          to: newPosition,
          percentage: splitBand.percentage,
        },
        {
          from: newPosition,
          to: splitBand.to,
          percentage: Math.round(
            (splitBand.percentage +
              (newBandIndex < bands.length - 1
                ? bands[newBandIndex + 1].percentage
                : 100)) /
              2
          ),
        },
        ...bands.slice(newBandIndex + 1),
      ];
    }

    // Ensure 'to' values are correct
    const updatedBands = newBands.map((band, index, array) => ({
      ...band,
      to: index < array.length - 1 ? array[index + 1].from : 100,
    }));

    updateBands(updatedBands);
  };

  const handleMarkerMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    band: Band,
    index: number
  ) => {
    const startX = e.clientX;
    const startLeft = band.to;

    const handleMouseMove = (e: MouseEvent) => {
      const sliderRect = sliderRef.current?.getBoundingClientRect();
      if (!sliderRect) return;

      const newPosition = Math.max(
        0,
        Math.min(
          100,
          Math.round(
            startLeft + ((e.clientX - startX) / sliderRect.width) * 100
          )
        )
      );
      handleMarkerDrag(index + 1, newPosition);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="max-w-3xl mx-auto w-full bg-grey p-4 pt-20">
      <div
        ref={sliderRef}
        className="relative h-4"
        style={{
          background: "linear-gradient(to right, #80cbb4, #009768)",
        }}
      >
        {bands.map((band, index) => (
          <React.Fragment key={index}>
            <div
              className="absolute h-full"
              style={{
                left: `${band.from}%`,
                width: `${band.to - band.from}%`,
              }}
            />
            {index < bands.length - 1 && (
              <div
                className="absolute flex h-12 w-4 cursor-move items-center justify-center rounded border border-2 border-grey-darker bg-grey-dark"
                style={{
                  left: `calc(${band.to}% - 8px)`,
                  top: "calc(50% - 24px)",
                }}
                onMouseDown={(e) => handleMarkerMouseDown(e, band, index)}
              >
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 transform">
                  <div className="relative rounded-md border border-black bg-white px-2 py-1 shadow-md">
                    <div className="text-xs font-bold text-black">
                      {band.to}%
                    </div>
                    <div className="absolute left-1/2 -bottom-1.5 h-3 w-3 -translate-x-1/2 rotate-45 transform border-r border-b border-black bg-white"></div>
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
        {[...Array(11)].map((_, i) => (
          <div
            key={i}
            className="absolute h-6 w-[2px] bg-grey-darker"
            style={{ left: `${i * 10}%`, bottom: -4 }}
          >
            {i === 0 && (
              <div className="absolute -bottom-4 text-xs font-bold text-black">
                0%
              </div>
            )}
            {i === 10 && (
              <div className="absolute -bottom-4 -left-8 text-xs font-bold text-black">
                100%
              </div>
            )}
          </div>
        ))}
        <div
          className="absolute h-4 w-full cursor-pointer"
          onClick={addNewBand}
        />
      </div>
      <div className="mt-4 flex justify-around">
        {bands.map((band, index) => (
          <div key={index} className="flex flex-col items-center">
            <label className="mr-2 font-bold">{t("percentage_paid")}</label>
            <div className="flex items-center gap-2">
              <input
                data-testid={`band-start-input-${index}`}
                type="number"
                value={band.percentage}
                onChange={(e) =>
                  handlePercentageChange(index, parseInt(e.target.value))
                }
                className="w-36 text-right"
              />
              <button
                data-testid={`delete-band-button-${index}`}
                onClick={() => handleDeleteBand(index)}
                disabled={bands.length <= 2}
                className={`text-red-500 ${
                  bands.length <= 2 ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                <BinIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BandedPaymentSlider;
