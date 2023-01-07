import * as React from 'react';
import Paper from "@mui/material/Paper";

const paperStyles = (props) => {
    return ( 
        <Paper
        sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
        }}> </Paper>
     );
}
 
export default paperStyles;