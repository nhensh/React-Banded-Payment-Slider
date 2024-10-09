# React-Banded-Payment-Slider
A React component for banded payment slider

## Installation

```bash
npm install banded-payment-slider
```

## Usage

```JSX
import React from 'react';
import BandedPaymentSlider from 'banded-payment-slider';

const App = () => {
  const initialBands = [
    { from: 0, to: 50, percentage: 50 },
    { from: 50, to: 100, percentage: 100 },
  ];

  const handleBandsChange = (newBands) => {
    console.log('Bands updated:', newBands);
  };

  return (
    <BandedPaymentSlider
      bands={initialBands}
      onBandsChange={handleBandsChange}
      labels={{ percentage_paid: "Percentage Paid", delete_band: "Delete Band"}}
    />
  );
};

export default App;
```

| Prop | Type | Description |
|------|------|-------------|
| `bands` | `Array<{ from: number, to: number, percentage: number }>` | An array of band objects, each representing a range and percentage. |
| `onBandsChange` | `(bands: Array<{ from: number, to: number, percentage: number }>) => void` | A callback function that receives the updated bands array when changes occur. |
| `labels` | `{ percentage_paid: string, delete_band: string }` | An object containing custom labels for the component. Use this to override default text or provide translations. |

## Build This Package

Run the build script:

```bash
npm run build
```

License
MIT © [Your Name]

