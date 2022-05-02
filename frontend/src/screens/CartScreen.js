import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { addToCart, removeFromCart } from '../actions/cartActions';
import MessageBox from '../components/MessageBox';

export default function CartScreen(props) {
	const myurl = queryString.parse(props.location.search);
	const productId = props.match.params.id;
	const qty = Number(myurl.qty);
	const talla = myurl.talla;
	const color = myurl.color;
	const disponible = Number(myurl.disponible);

	const cart = useSelector((state) => state.cart);
	const { cartItems, error } = cart;
	const dispatch = useDispatch();
	console.log('CartScreen cartItems:', cartItems);

	useEffect(() => {
		console.log('CARTSCREEN: useEffect triggered');
		if (productId) {
			dispatch(addToCart(productId, qty, talla, color, disponible));
		}
		props.history.push('/cart');
	}, [color, dispatch, disponible, productId, props.history, qty, talla]);

	const removeFromCartHandler = (id, talla, color) => {
		dispatch(removeFromCart(id, talla, color));
	};

	const checkoutHandler = () => {
		props.history.push('/signin?redirect=shipping');
	};
	return (
		<div className='row top'>
			<div className='col-2 cart'>
				<h1>Tu Carrito</h1>
				{error && <MessageBox variant='danger'>{error}</MessageBox>}
				{cartItems.length === 0 ? (
					<MessageBox>
						Tu Carrito esta vacio. <Link to='/'>ir a Productos</Link>
					</MessageBox>
				) : (
					<ul className='carrito-ul'>
						{cartItems.map((item, index) => (
							<li key={item.product + index}>
								<div className='row shadow'>
									<div>
										<img
											src={item.image}
											alt={item.name}
											className='small'
										></img>
									</div>

									<div className='min-30'>
										<Link to={`/product/${item.product}`}>{item.name}</Link>
										<p>Color: {item.color}</p>
										<p>Talla: {item.talla}</p>
									</div>

									<div>
										<select
											value={item.qty}
											onChange={(e) =>
												dispatch(
													addToCart(
														item.product,
														Number(e.target.value),
														item.talla,
														item.color,
														item.disponible
													)
												)
											}
										>
											{[...Array(item.disponible).keys()].map((x) => (
												<option key={x + 1} value={x + 1}>
													{x + 1}
												</option>
											))}
										</select>
									</div>
									<div>${item.price}</div>
									<div>
										<button
											className='delete'
											type='button'
											onClick={() =>
												removeFromCartHandler(
													item.product,
													item.talla,
													item.color
												)
											}
										>
											<i className='fas fa-trash-alt'></i>
										</button>
									</div>
								</div>
							</li>
						))}
					</ul>
				)}
			</div>
			<div className='col-1'>
				<div className='card card-body'>
					<div className='row center'>
						<h1>Resumen</h1>
					</div>
					<ul>
						<li className='row'>
							<h2 className='cart-subtotal'>
								Subtotal ({cartItems.reduce((a, c) => a + c.qty, 0)} articulos):
							</h2>
							<h2>
								${cartItems.reduce((a, c) => a + c.price * c.qty, 0).toFixed(2)}
							</h2>
						</li>
						<li>
							<button
								type='button'
								onClick={checkoutHandler}
								className='primary block'
								disabled={cartItems.length === 0}
							>
								Comprar
							</button>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
