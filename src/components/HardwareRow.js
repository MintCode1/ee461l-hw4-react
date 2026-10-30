import { useState } from 'react';
import { Button, TextField } from '@mui/material';

export default function HardwareRow({ projectName, hardwareSet, checkedOut, available, joined, onHardwareChange }) {
  const [quantity, setQuantity] = useState('');
  const validQuantity = /^[1-9]\d*$/.test(quantity) && Number.isSafeInteger(Number(quantity));
  const invalid = quantity !== '' && !validQuantity;
  const rowLabel = `${projectName} ${hardwareSet.name}`;

  function handleAction(type) {
    onHardwareChange(type, quantity);
  }

  return (
    <div className="hardware-row" role="group" aria-label={rowLabel}>
      <div className="hardware-count"><span>{hardwareSet.name}</span><strong>{checkedOut}<small> / {hardwareSet.capacity}</small></strong></div>
      <TextField size="small" label="Qty" value={quantity} disabled={!joined} error={invalid} onChange={event => setQuantity(event.target.value)} inputProps={{ inputMode: 'numeric', 'aria-label': `${rowLabel} quantity`, 'aria-describedby': invalid ? `${projectName.replaceAll(' ', '-')}-${hardwareSet.id}-error` : undefined }} />
      <Button size="small" variant="outlined" disabled={!joined || !validQuantity} onClick={() => handleAction('checkIn')} aria-label={`Check in ${rowLabel}`}>Check in</Button>
      <Button size="small" variant="outlined" disabled={!joined || !validQuantity} onClick={() => handleAction('checkOut')} aria-label={`Check out ${rowLabel}`}>Check out</Button>
      <span className="availability">{available} available</span>
      {invalid && <span className="quantity-error" id={`${projectName.replaceAll(' ', '-')}-${hardwareSet.id}-error`}>Use a positive whole number.</span>}
    </div>
  );
}
