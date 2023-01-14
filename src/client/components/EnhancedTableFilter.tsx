import React, { useState, useEffect, useRef } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';


const EnhancedTableFilter = ({ title, filters, setFilterHandler }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const openMenu = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
    <>
        <Tooltip 
            title={`${title} filter`}>
            <IconButton
                aria-controls={open ? `${title}-menu` : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={openMenu}
                sx={{ mr: 2, marginLeft: "15px"}}>
              <FilterListIcon />
            </IconButton>
        </Tooltip>
        <Menu
            anchorEl={anchorEl}
            open={open}
            id={`${title}-menu`}
            onClose={closeMenu}
            onClick={closeMenu}
            PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                {filters.length > 0 && filters.map((filter) => (
                    <MenuItem 
                        key={filter}
                        onClick={() => setFilterHandler(filter)}>
                        {filter}
                    </MenuItem>
                ))}
                <MenuItem
                    onClick={() => setFilterHandler('')}>
                    All
                </MenuItem>
        </Menu>
    </>
    );
};

export default EnhancedTableFilter;