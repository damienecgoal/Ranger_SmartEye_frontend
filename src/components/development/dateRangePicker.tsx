import React, { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Calendar } from 'iconsax-reactjs';

interface DateRangePickerProps {
  onDateRangeChange: (startDate: number | null, endDate: number | null) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onDateRangeChange }) => {
  const getStartOfMonth = (): Date => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  };

  const getEndOfMonth = (): Date => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0);
  };

  const [startDate, setStartDate] = useState<Date | null>(getStartOfMonth());
  const [endDate, setEndDate] = useState<Date | null>(getEndOfMonth());

  const convertToUnix = (date: Date | null): number | null => {
    return date ? Math.floor(date.getTime() / 1000) : null;
  };

  useEffect(() => {
    const startUnix = convertToUnix(startDate);
    const endUnix = convertToUnix(endDate);
    onDateRangeChange(startUnix, endUnix);
  }, [startDate, endDate]);

  const handleStartDateChange = (newValue: Date | null) => {
    setStartDate(newValue);
  };

  const handleEndDateChange = (newValue: Date | null) => {
    setEndDate(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <DesktopDatePicker
          label="From"
          format="dd/MM/yyyy"
          value={startDate}
          onChange={handleStartDateChange}
          slots={{ openPickerIcon: Calendar }}
          slotProps={{ textField: { size: 'small' } }}
          sx={{ width: '150px' }}
        />
        
        <DesktopDatePicker
          label="To"
          format="dd/MM/yyyy"
          value={endDate}
          onChange={handleEndDateChange}
          slots={{ openPickerIcon: Calendar }}
          slotProps={{ textField: { size: 'small' } }}
          sx={{ width: '150px' }}
        />
      </div>
    </LocalizationProvider>
  );
};

export default DateRangePicker;
