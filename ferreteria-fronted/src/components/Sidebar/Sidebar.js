import React from 'react';
import './Sidebar.css';

const Sidebar =({setContent})=>{
    const menuItems=[
        {name: 'INICIO'},
        {name: 'INVENTARIO'},
        {name: 'DISTRIBUIDORES'},
        {name: 'MARCAS'},
        {name: 'VENTA'},
        {name: 'INFORME'}

    ];
    return(
        <div className='sidebar'>
            {menuItems.map((item,index)=>(
                <div
                key={index}
                className="sidebar-item"
                onClick={()=> setContent(item.name)}
                >
                    {item.name}
                </div>   
            ))}
        </div>
    );
};
export default Sidebar;