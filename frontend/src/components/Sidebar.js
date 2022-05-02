/* eslint-disable no-unused-vars */
import React from 'react';

import { Link } from 'react-router-dom';

function Sidebar() {
	return (
		<div className='sidebar'>
			<div className='sidebar__header'>
				<i className='fas fa-user-shield' id='admin-icon'></i>
				<p id='admin-title'>Administrador</p>
				<hr />
			</div>
			<div className='sidebar__menu'>
				<Link to='/'>
					<i className='fas fa-home'></i>
					<span className='sidebar__menu_texto'>Inicio</span>
				</Link>
				<Link to='/productlist'>
					{' '}
					<i className='fas fa-boxes'></i>
					<span className='sidebar__menu_texto'>Productos</span>
				</Link>
				<Link to='/orderlist'>
					{' '}
					<i className='fas fa-file-invoice-dollar'></i>
					<span className='sidebar__menu_texto'>Pedidos</span>
				</Link>
				<Link to='/userlist'>
					{' '}
					<i className='fas fa-users'></i>
					<span className='sidebar__menu_texto'>Usuarios</span>
				</Link>
				<Link to='/userlist'>
					{' '}
					<i className='fas fa-address-card'></i>
					<span className='sidebar__menu_texto'>Venedores</span>
				</Link>
				<Link to='/clientelist'>
					{' '}
					<i className='fas fa-building'></i>
					<span className='sidebar__menu_texto'>Empresas</span>
				</Link>
				<Link to='statitics'>
					{' '}
					<i className='fas fa-chart-pie'></i>
					<span className='sidebar__menu_texto'>Estadisticas</span>
				</Link>

				<Link to='/barcodescan'>
					<i className='fas fa-search'></i>
					<span className='sidebar__menu_texto'>Scanear</span>
				</Link>
			</div>
		</div>
	);
}

export default Sidebar;
