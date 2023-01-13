import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const EnhancedTable = ({ data, headers }) => {
    const [rows, setRows] = useState([]);

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

        console.log('Row data: ', data, data.length);
        console.log('Row info: ', newRows, newRows.length);
        setRows(newRows);
    }, [data]);

    return(
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {headers?.map((header, i) => (
                            <TableCell key={`header${i}`} align={i > 0 ? "center" : "left"}>{header}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.length > 0 && rows.map((row, i) => (
                        <TableRow
                            key={`${row.originalMessage}${i}`}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
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
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default EnhancedTable;