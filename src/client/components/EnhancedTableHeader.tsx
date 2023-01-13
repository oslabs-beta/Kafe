import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';


const EnhancedTableHeader = ({ headers }) => {
    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      inputProps={{
                        'aria-label': 'select all messages',
                      }}
                    />
                </TableCell>
                {headers?.map((header, i) => (
                    <TableCell key={`header${i}`} align={i > 0 ? "center" : "left"}>{header}</TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

export default EnhancedTableHeader;