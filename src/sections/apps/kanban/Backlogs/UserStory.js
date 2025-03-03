import PropTypes from 'prop-types';

import React, { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Collapse,
  Link,
  Menu,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';

// third-party
import { format } from 'date-fns';
import { Droppable, Draggable } from '@hello-pangea/dnd';

// project imports
import AddItem from './AddItem';
import EditStory from './EditStory';
import AlertStoryDelete from './AlertStoryDelete';
import Items from './Items';
import IconButton from '../../../../components/@extended/IconButton';
import { ThemeMode } from '../../../../config';
import { deleteStory, useGetBacklogs } from '../../../../api/kanban';
import { openSnackbar } from '../../../../api/snackbar';

// assets
import { DownOutlined, MoreOutlined, RightOutlined, PlusSquareTwoTone, ClusterOutlined } from '@ant-design/icons';

// drag wrapper
const getDragWrapper = (isDragging, theme, open) => {
  let bgcolor = 'transparent';
  if (open) {
    bgcolor = theme.palette.mode === ThemeMode.DARK ? theme.palette.background.default : theme.palette.secondary.lighter;
  }

  if (isDragging) {
    bgcolor = theme.palette.mode === ThemeMode.DARK ? theme.palette.background.default : theme.palette.primary.lighter;
  }

  return {
    backgroundColor: bgcolor,
    userSelect: 'none'
  };
};

// drop wrapper
const getDropWrapper = () => {
  return {
    background: 'transparent'
  };
};

// ==============================|| KANBAN BACKLOGS - USER STORY ||============================== //

const UserStory = ({ story, index }) => {
  const theme = useTheme();
  const { backlogs } = useGetBacklogs();

  const [open, setOpen] = React.useState(index === 0);

  const storyColumn = backlogs?.columns.filter((column) => column.id === story.columnId)[0];
  const storyProfile = backlogs?.profiles.filter((profile) => profile.id === story.assign)[0];

  // drawer
  const [openDrawer, setOpenDrawer] = useState(false);
  const handleDrawerOpen = () => {
    setOpenDrawer((prevState) => !prevState);
  };

  const addItem = () => {
    setOpenDrawer((prevState) => !prevState);
  };

  const [openStoryDrawer, setOpenStoryDrawer] = useState(false);
  const handleStoryDrawerOpen = () => {
    setOpenStoryDrawer((prevState) => !prevState);
  };

  const editStory = () => {
    setOpenStoryDrawer((prevState) => !prevState);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openModal, setOpenModal] = useState(false);

  const handleModalClose = (status) => {
    setOpenModal(false);
    if (status) {
      deleteStory(story.id);
      openSnackbar({
        open: true,
        message: 'Task Deleted successfully',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',
        alert: {
          color: 'success'
        }
      });
    }
  };

  return (
    <>
      <Draggable draggableId={story.id} index={index}>
        {(provided, snapshot) => (
          <>
            <TableRow
              hover
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              sx={{
                ...getDragWrapper(snapshot.isDragging, theme, open),
                ...(!open && {
                  '& .MuiTableCell-root': {
                    border: 'none'
                  }
                })
              }}
            >
              <TableCell sx={{ pl: 3, minWidth: 120, width: 120, height: 46 }}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                 
                  <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)} color="secondary">
                    {open ? <DownOutlined /> : <RightOutlined />}
                  </IconButton>
                </Stack>
              </TableCell>
              <TableCell sx={{ width: 110, minWidth: 110 }}>
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <ClusterOutlined style={{ color: theme.palette.primary.main, marginTop: -2 }} />
                  <Typography variant="subtitle2">{story.id}</Typography>
                </Stack>
              </TableCell>
              <TableCell sx={{ maxWidth: 'calc(100vw - 850px)', minWidth: 140 }} component="th" scope="row">
                <Link
                  underline="hover"
                  color="default"
                  onClick={editStory}
                  sx={{
                    overflow: 'hidden',
                    display: 'block',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    ':hover': { color: 'primary.main' },
                    cursor: 'pointer'
                  }}
                >
                  {story.title}
                </Link>
              </TableCell>
              <TableCell sx={{ width: 60, minWidth: 60 }}>
                <IconButton size="small" aria-controls="menu-comment" onClick={handleClick} aria-haspopup="true" color="secondary">
                  <MoreOutlined style={{ color: theme.palette.text.primary }} />
                </IconButton>
                <Menu
                  id="menu-comment"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  variant="selectedMenu"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      editStory();
                    }}
                  >
                    Editare
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      setOpenModal(true);
                    }}
                  >
                    Ștergere
                  </MenuItem>
                </Menu>
                <AlertStoryDelete title={story.title} open={openModal} handleClose={handleModalClose} />
              </TableCell>
              <TableCell sx={{ width: 90, minWidth: 90 }}>{storyColumn ? storyColumn.title : ''}</TableCell>
              <TableCell sx={{ width: 140, minWidth: 140 }}>{storyProfile ? storyProfile.name : ''}</TableCell>
              <TableCell sx={{ width: 85, minWidth: 85, textTransform: 'capitalize' }}>{story.priority}</TableCell>
              <TableCell sx={{ width: 120, minWidth: 120 }}>{story.dueDate ? format(new Date(story.dueDate), 'd MMM yyyy') : ''}</TableCell>
            </TableRow>

            <Droppable droppableId={story.id} type="item">
              {(providedDrop, snapshotDrop) => (
                <TableRow
                  ref={providedDrop.innerRef}
                  {...providedDrop.droppableProps}
                  sx={getDropWrapper(snapshotDrop.isDraggingOver, theme)}
                >
                  <TableCell style={{ padding: 0 }} colSpan={8}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                      {open && (
                        <Box sx={{ margin: 0 }}>
                          <TableContainer>
                            <Table size="small" aria-label="purchases">
                              <TableBody>
                                {story.itemIds?.map((itemId, i) => (
                                  <Items key={itemId} itemId={itemId} index={i} />
                                ))}
                                {providedDrop.placeholder}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      )}
                    </Collapse>
                  </TableCell>
                </TableRow>
              )}
            </Droppable>
          </>
        )}
      </Draggable>
      <EditStory story={story} open={openStoryDrawer} handleDrawerOpen={handleStoryDrawerOpen} />
      <AddItem open={openDrawer} handleDrawerOpen={handleDrawerOpen} storyId={story.id} />
    </>
  );
};

UserStory.propTypes = {
  story: PropTypes.object,
  index: PropTypes.number
};

export default UserStory;
