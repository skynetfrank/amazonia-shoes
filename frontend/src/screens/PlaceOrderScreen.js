import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createOrder } from '../actions/orderActions';
import CheckoutSteps from '../components/CheckoutSteps';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { updateExistencia } from '../actions/productActions';

export default function PlaceOrderScreen(props) {
	const cart = useSelector((state) => state.cart);
	if (!cart.paymentMethod) {
		props.history.push('/payment');
	}

	const userSignin = useSelector((state) => state.userSignin);
	const { userInfo } = userSignin;

	const orderCreate = useSelector((state) => state.orderCreate);
	const { loading, success, error, order } = orderCreate;
	const toPrice = (num) => Number(num.toFixed(2)); // 5.123 => "5.12" => 5.12
	cart.itemsPrice = toPrice(
		cart.cartItems.reduce((a, c) => a + c.qty * c.price, 0)
	);
	cart.shippingPrice = cart.itemsPrice > 100 ? toPrice(0) : toPrice(10);
	cart.taxPrice = toPrice(0.15 * cart.itemsPrice);
	cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;
	const dispatch = useDispatch();
	const placeOrderHandler = () => {
		dispatch(createOrder({ ...cart, orderItems: cart.cartItems }));
	};
	useEffect(() => {
		if (success) {
			props.history.push(`/order/${order._id}`);
			dispatch({ type: ORDER_CREATE_RESET });

			cart.cartItems.forEach((item) => {
				console.log('item a procesar=>tallas', item.sizesInStock);

				for (let index1 = 0; index1 < item.sizesInStock.length; index1++) {
					let copiaStock = item.sizesInStock;
					const arrayColores = item.sizesInStock[index1];
					const found = arrayColores.find((z) => z === 'En-Imagen');
					if (found) {
						for (let index2 = 0; index2 < arrayColores.length; index2++) {
							if (arrayColores[index2] === item.talla) {
								const idProducto = item.product;
								const resta = item.sizesInStock[index1][index2 + 1] - item.qty;
								copiaStock[index1][index2 + 1] = resta;
								console.log('copiaStock actualizado', copiaStock);
								dispatch(updateExistencia({ idProducto, copiaStock }));
							}
						}
					}
				}
			});
		}
	}, [cart.cartItems, dispatch, order, props.history, success]);
	return (
		<div>
			<CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
			<div className='row top'>
				<div className='col2-place-order'>
					<div className='div-info-user'>
						<p>
							<strong>Nombre:</strong> {cart.shippingAddress.fullName}.
							{userInfo.telefono} <br />
							<strong>Direccion: </strong> {cart.shippingAddress.address},
							{cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
							{cart.shippingAddress.country}
						</p>
						<p>
							<strong>Method:</strong> {cart.paymentMethod}
						</p>
					</div>
					<ul>
						<li>
							<h2>Articulos a Comprar</h2>
							<div className='card card-body'>
								<ul>
									{cart.cartItems.map((item) => (
										<li key={item.product}>
											<div className='row'>
												<div>
													<img
														src={item.image}
														alt={item.name}
														className='small'
													></img>
												</div>
												<div className='min-30'>
													<Link to={`/product/${item.product}`}>
														{item.name}
													</Link>
													<p>Color: {item.color}</p>
													<p>Talla: {item.talla}</p>
												</div>

												<div className='qty-price'>
													<p>
														{' '}
														{item.qty} x ${item.price} = $
														{item.qty * item.price}
													</p>
												</div>
											</div>
										</li>
									))}
								</ul>
							</div>
						</li>
					</ul>
				</div>
				<div className='col1-place-order'>
					<div className='card card-body'>
						<ul>
							<li>
								<div className='row center'>
									<h1>Resumen</h1>
								</div>
							</li>
							<li>
								<div className='row'>
									<div>Productos</div>
									<div>${cart.itemsPrice.toFixed(2)}</div>
								</div>
							</li>
							<li>
								<div className='row'>
									<div>envio</div>
									<div>${cart.shippingPrice.toFixed(2)}</div>
								</div>
							</li>
							<li>
								<div className='row'>
									<div>Impuestos</div>
									<div>${cart.taxPrice.toFixed(2)}</div>
								</div>
							</li>
							<li>
								<div className='row'>
									<div>
										<strong> Total Pedido</strong>
									</div>
									<div>
										<strong>${cart.totalPrice.toFixed(2)}</strong>
									</div>
								</div>
							</li>
							<li>
								<button
									type='button'
									onClick={placeOrderHandler}
									className='primary block'
									disabled={cart.cartItems.length === 0}
								>
									Confirmar Pedido
								</button>
							</li>
							{loading && <LoadingBox></LoadingBox>}
							{error && <MessageBox variant='danger'>{error}</MessageBox>}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
