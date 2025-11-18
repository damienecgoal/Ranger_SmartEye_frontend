// material-ui
import Stack from '@mui/material/Stack';

// project-imports
import { GRID_COMMON_SPACING } from 'config';

import ColumnDragDrop from 'sections/tables/react-table/ColumnDragDrop';
import RowDragDrop from 'sections/tables/react-table/RowDragDrop';

// ==============================|| REACT TABLE - DRAG & DROP ||============================== //

export default function DragDrop() {
  return (
    <Stack sx={{ gap: GRID_COMMON_SPACING }}>
      <RowDragDrop />
      <ColumnDragDrop />
    </Stack>
  );
}
