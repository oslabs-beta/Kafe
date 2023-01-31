import React, { useState, useEffect } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';

const EnhancedTableToolbar = ({ numSelected, selected, setSelected, removeMessageHandler }) => {
    
    return (
        <Toolbar
              sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                  bgcolor: (theme) =>
                    alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
              }}>
              {numSelected > 0 ? (
                <Typography
                  sx={{ flex: '1 1 100%' }}
                  color="inherit"
                  variant="subtitle1"
                  component="div"
                >
                  {numSelected} selected
                </Typography>
              ) : (
                <Typography
                  sx={{ flex: '1 1 100%' }}
                  variant="h6"
                  id="tableTitle"
                  component="div">
                  Dead Letter Queue Messages
                </Typography>
              )}
              {numSelected > 0 && (
                <Tooltip title="Delete">
                  <IconButton onClick = {()=> {
                    removeMessageHandler(selected);
                    setSelected(new Set());
                    }}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
        </Toolbar>
    );
};

export default EnhancedTableToolbar;