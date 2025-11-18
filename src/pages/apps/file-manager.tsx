// material-ui
import Stack from '@mui/material/Stack';

// project-imports
import { GRID_COMMON_SPACING } from 'config';
import { Files, SummaryAccordion } from 'sections/apps/file-manager';

// ==============================|| APPLICATION - FILE MANAGER ||============================== //

export default function FileManagerPage() {
  return (
    <Stack gap={GRID_COMMON_SPACING}>
      <SummaryAccordion />
      <Files />
    </Stack>
  );
}
