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
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [clientFilter, setClientFilter] = useState('');
    const [topicFilter, setTopicFilter] = useState('');
    const [order, setOrder] = useState('desc');

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

    const pageChangeHandler = (event: unknown, page: number) => {
        if (page < 0) return;
        setPage(page);
    };

    const rowsPerPageChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const result = parseInt(event.target.value, 10);
        if (!result) return;

        setRowsPerPage(result);
        setPage(0);
    };

    // console.log('Enhanced table rows: ', rows);
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
                            numRows={rows.length}
                            order={order}
                            setOrder={setOrder}
                            reverseOrder={reverseOrderHandler}/>
                        <TableBody>
                            {rows.length > 0 && rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
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
                <TablePagination
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={rows.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={pageChangeHandler}
                    onRowsPerPageChange={rowsPerPageChangeHandler}
                />
            </Paper>
        </Box>
        
    );
};

export default EnhancedTable;