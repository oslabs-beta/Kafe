import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import EnhancedTableHeader from './EnhancedTableHeader';
import EnhancedTableRow from './EnhancedTableRow';
import EnhancedTableToolbar from './EnhancedTableToolbar';

const EnhancedTable = ({ data, headers, removeMessageHandler, reverseOrderHandler }) => {
    const [rows, setRows] = useState([]);
    const [selected, setSelected] = useState(new Set());
    const [clientFilter, setClientFilter] = useState('');
    const [topicFilter, setTopicFilter] = useState('');
    const [ordering, setOrdering] = useState('Descending');

    useEffect(() => {
        const newRows = data.map(datum => {
            return {
                time: datum.timestamp,
                originalMessage: datum.value.originalMessage,
                originalTopic: datum.value.originalTopic,
                clientType: datum.value.clientType,
                error: datum.value.err,
            };
        });

        // console.log('Row info: ', newRows);
        setRows(newRows);
    }, [data]);

    console.log(selected);
    return(
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '99%', mb: 2 }}>
                <EnhancedTableToolbar 
                    numSelected={selected.size}
                    selected={Array.from(selected)}
                    removeMessageHandler={removeMessageHandler}/>
                <TableContainer >
                    <Table sx={{ minWidth: 650 }} aria-label="DLQ table">
                        <EnhancedTableHeader 
                            headers={headers}
                            setSelected={setSelected}
                            numRows={rows.length}/>
                        <TableBody>
                            {rows.length > 0 && rows.map((row, i) => (
                                <EnhancedTableRow
                                    key={`${row.originalMessage}${i}`}
                                    row={row}
                                    index={i}
                                    checked={selected.has(i)}
                                    setSelected={setSelected}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
        
    );
};

export default EnhancedTable;