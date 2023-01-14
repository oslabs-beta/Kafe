import React, { useState } from 'react';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableSortLabel from '@mui/material/TableSortLabel';

const EnhancedTableHeader = ({ headers, setSelected, numRows, order, setOrder, reverseOrder }) => {
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
    console.log('Table Header component: ', order);
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
                    i === 0 ? 
                        <TableCell 
                            key={`header${i}`} 
                            align="left"
                            sortDirection={order}>
                                {header}
                            <TableSortLabel
                                active={true}
                                direction={order}
                                onClick={() => {
                                    setOrder(order === 'desc' ? 'asc' : 'desc');
                                    reverseOrder();
                                }}/>
                        </TableCell> :
                    <TableCell key={`header${i}`} align={i === headers.length - 1 ? "right" : i > 0 ? "center" :  "left"}>{header}</TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

export default EnhancedTableHeader;