import React, { useState } from "react";
import { Stack } from "@mui/system";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import { useQuery } from "@apollo/client";
import { CLUSTER_SUMMARY } from '../queries/graphQL'; 

const linkStyle = {
    display: 'flex',
    padding: "0px 0px 20px 0px",
    textDecoration: "none",
    color: '#71ABC5',
    height: '10px',
  };

const btnStyle = {minWidth: 150, 
    margin: "0px",
    textAlign:"right",
    textTransform: 'unset',
    color: 'palette.primary.dark',
    };
 
const ButtonBar = () => {

    let connectStatus = 'Loading';
    const { loading, data } = useQuery(CLUSTER_SUMMARY);
    
    if(!loading) {
        console.log('status is... ', data);
        connectStatus = 'Connected';
    };
    
    const [selected, setSelected] = useState(false);

    const menuItems = ["Home", "Cluster Summary", "Brokers", "Cluster Manager", "Dead Letter Queue" ];
    const menuRoutes = ["/overview", "/summary", "/brokers", "/clustermanager", "/dlq" ];

   const handleClick = () => {
    setSelected(true);
   };
   
    let selectedBorder = (selected)=>{
        let fill = selected
        if(fill) {
            const btnStyle = {minWidth: 150, 
                margin: "0px",
                textAlign:"right",
                textTransform: 'unset',
                color: 'palette.primary.dark',
                border: 5
                };
        };
    };

    const menuBtns = menuItems.map((ele, i)=>{
        return( 
            <Button 
                onClick={handleClick}        
                variant="outlined"
                sx={btnStyle}
                key={i}>
                    <Link 
                        to= {menuRoutes[i]} 
                        style={linkStyle}>{ele}
                    </Link>
            </Button>
        )
    })

    return (
        <Stack 
            direction="row" 
            spacing={5} 
            marginLeft='33px'>
                <Button sx={btnStyle}>Kafka Cluster is {connectStatus}</Button>
                {menuBtns}
        </Stack>
    )
}
 
export default ButtonBar;