// material-ui
import { Calendar } from 'iconsax-reactjs';

// ==============================|| OVERRIDES - DATE PICKER ||============================== //

export default function DatePicker() {
  return {
    MuiDatePicker: {
      defaultProps: {
        slots: { openPickerIcon: () => <Calendar /> }
      }
    }
  };
}
