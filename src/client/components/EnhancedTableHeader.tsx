import React, { useState } from 'react';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';


const EnhancedTableHeader = ({ headers, setSelected, numRows }) => {
    const [checked, setChecked] = useState(false);

    const handleCheck = () => {
        if (checked) {
            setSelected(selected => {
                const set = new Set();
                return set;
            });
        } else {
            setSelected(selected => {
                const set = new Set();
                for (let i = 0; i < numRows; i++) {
                    set.add(i);
                };
                return set;
            });
        };

        setChecked(!checked);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      inputProps={{
                        'aria-label': 'select all messages',
                      }}
                      checked={checked}
                      onChange={handleCheck}
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