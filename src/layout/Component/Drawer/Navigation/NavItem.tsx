import { matchPath, useLocation, Link } from 'react-router-dom';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// project-imports
import { handlerComponentDrawer } from 'api/menu';

// third-party
import { FormattedMessage } from 'react-intl';

// types
import { LinkTarget, NavItemType } from 'types/menu';

interface Props {
  item: NavItemType;
}

// ==============================|| NAVIGATION - ITEM ||============================== //

export default function NavItem({ item }: Props) {
  const { pathname } = useLocation();
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  let itemTarget: LinkTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  const itemHandler = () => {
    downMD && handlerComponentDrawer(false);
  };

  const isSelectedItem = !!matchPath({ path: item.url!, end: false }, pathname);

  return (
    <ListItemButton
      component={Link}
      to={item.url!}
      target={itemTarget}
      disabled={item.disabled}
      onClick={() => itemHandler()}
      selected={isSelectedItem}
      sx={{ pl: 2.5, py: 1, mb: 0.5 }}
    >
      <ListItemText
        primary={
          <Typography
            variant="h6"
            sx={(theme) => ({
              fontWeight: 500,
              color: isSelectedItem ? 'primary.main' : 'secondary.main',
              ...theme.applyStyles('dark', { color: isSelectedItem ? 'text.primary' : 'secondary.400' })
            })}
          >
            <FormattedMessage id={item.title} />
          </Typography>
        }
      />
      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
}
