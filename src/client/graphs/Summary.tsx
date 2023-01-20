import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



export default function Summary(pieChartData) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Topic Name </TableCell>
            <TableCell align="right"> Client Type </TableCell>
            <TableCell align="right"># of DLQ</TableCell>
            <TableCell align="right">Percent to Total%</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(pieChartData).map((row) => (
            <TableRow
              key={row}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row}
              </TableCell>
              <TableCell align="right">Client Type PlaceHolder</TableCell>
              <TableCell align="right"># of Topics PlaceHolder</TableCell>
              <TableCell align="right">Percent</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}