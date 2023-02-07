import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import EnhancedTableHeader from './EnhancedTableHeader';
import EnhancedTableRow from './EnhancedTableRow';
import EnhancedTableToolbar from './EnhancedTableToolbar';

const deepClone = (row) => {
    if (typeof(row) !== 'object') return row;

    const res = {};
    for (const key in row) {
        res[key] = deepClone(row[key]);
    };

    return res;
};

const EnhancedTable = ({ data, headers, removeMessageHandler, reverseOrderHandler, order, setOrder }) => {
    const [rows, setRows] = useState([]);
    const [selected, setSelected] = useState(new Set());
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [topics, setTopics] = useState(new Set());
    const [filteredRows, setFilteredRows] = useState([]);
    const [clientFilter, setClientFilter] = useState('');
    const [topicFilter, setTopicFilter] = useState('');

    useEffect(() => {
        const dlqTopics = new Set();

        const newRows = data.map(datum => {
            dlqTopics.add(datum.value.originalTopic);
            return {
                time: datum.timestamp,
                originalMessage: datum.value.originalMessage,
                originalTopic: datum.value.originalTopic,
                clientType: datum.value.clientType,
                error: datum.value.err,
            };
        });

        setRows(newRows);
        setTopics(dlqTopics);
    }, [data]);

    useEffect(() => {
        //Filtered row data
        let filtered = [];
        if (topicFilter && clientFilter) {
            rows.forEach(row => {
                if (row.originalTopic === topicFilter && row.clientType === clientFilter) {
                    filtered.push(deepClone(row));
                };
            });
        } else if (topicFilter) {
            rows.forEach(row => {
                if (row.originalTopic === topicFilter) {
                    filtered.push(deepClone(row));
                };
            });
        } else if (clientFilter) {
            rows.forEach(row => {
                if (row.clientType === clientFilter) {
                    filtered.push(deepClone(row));
                };
            });
        } else {
            rows.forEach(row => filtered.push(deepClone(row)));
        };

        setFilteredRows((filteredRows) => {
            return filtered;
        });

    }, [rows, topicFilter, clientFilter]);

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

    return(
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '99%', mb: 2 }}>
                <EnhancedTableToolbar
                    numSelected={selected.size}
                    selected={Array.from(selected)}
                    setSelected={setSelected}
                    removeMessageHandler={removeMessageHandler}/>
                <TableContainer >
                    <Table sx={{ minWidth: 650 }} aria-label="DLQ table">
                        <EnhancedTableHeader
                            headers={headers}
                            setSelected={setSelected}
                            numRows={filteredRows.length}
                            order={order}
                            setOrder={setOrder}
                            reverseOrder={reverseOrderHandler}
                            topics={Array.from(topics)}
                            setTopic={setTopicFilter}
                            setClient={setClientFilter}/>
                        <TableBody>
                            {filteredRows.length > 0 && filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
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
                    count={filteredRows?.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={pageChangeHandler}
                    onRowsPerPageChange={rowsPerPageChangeHandler}
                    sx={{mr: 13}}
                />
            </Paper>
        </Box>
    );
};

export default EnhancedTable;