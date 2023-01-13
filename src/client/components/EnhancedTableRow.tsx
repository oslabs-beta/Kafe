import React, { useState, useEffect } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import { I } from 'chart.js/dist/chunks/helpers.core';


const EnhancedTableRow = ({ row, index, setSelected }) => {
    const [checked, setChecked] = useState(false);

    const handleChecked = () => {
        if (checked) setSelected(selected => {
            const set = new Set([...selected]);
            set.delete(index);
            return set;
        });
        else setSelected(selected => {
            const set = new Set([...selected]);
            set.add(index);
            return set;
        });

        setChecked(!checked);
    };

    return (
        <TableRow        
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      inputProps={{
                        'aria-label': 'select all messages',
                      }}
                      checked={checked}
                      onChange={handleChecked}
                    />
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.time}
                </TableCell>
                <TableCell align="center">
                    {row.originalMessage}
                </TableCell>
                <TableCell align="center">
                    {row.originalTopic}
                </TableCell>
                <TableCell align="center">
                    {row.clientType}
                </TableCell>
                <TableCell align="center">
                    {row.error}
                </TableCell>
        </TableRow>
    )
};

export default EnhancedTableRow;