import React, { useState } from 'react';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableSortLabel from '@mui/material/TableSortLabel';
import EnhancedTableFilter from './EnhancedTableFilter';

const EnhancedTableHeader = ({ headers, setSelected, numRows, order, setOrder, reverseOrder, topics, setTopic, setClient }) => {
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

    // console.log('Table Header component: ', order);
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
                    (header === 'Client Type' || header === 'Original Topic') ?
                        <TableCell
                            key={`header${i}`}
                            align="center"
                            sx={{pl: 5}}
                            >
                                {header}
                            <EnhancedTableFilter
                                title={header}
                                filters={header === 'Original Topic' ? topics : ['Consumer', 'Producer']}
                                setFilterHandler={header === 'Original Topic' ? setTopic : setClient}
                                />
                        </TableCell> :
                    <TableCell key={`header${i}`} align={"center"}>{header}</TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

export default EnhancedTableHeader;