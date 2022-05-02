import Axios from 'axios';
import {
	CART_ADD_ITEM,
	CART_REMOVE_ITEM,
	CART_SAVE_SHIPPING_ADDRESS,
	CART_SAVE_PAYMENT_METHOD,
	// CART_ADD_ITEM_FAIL,
} from '../constants/cartConstants';

export const addToCart =
	(productId, qty, talla, color, disponible) => async (dispatch, getState) => {
		const { data } = await Axios.get(`/api/products/${productId}`);
		console.log('CART ACTIONS disponible:', disponible);
		dispatch({
			type: CART_ADD_ITEM,
			payload: {
				name: data.name,
				image: data.image,
				price: data.price,
				countInStock: data.countInStock,
				sizesInStock: data.sizesInStock,
				product: data._id,
				seller: data.seller,
				qty,
				talla,
				color,
				disponible,
			},
		});

		localStorage.setItem(
			'cartItems',
			JSON.stringify(getState().cart.cartItems)
		);
	};

export const removeFromCart =
	(productId, talla, color) => (dispatch, getState) => {
		dispatch({ type: CART_REMOVE_ITEM, payload: { productId, talla, color } });
		localStorage.setItem(
			'cartItems',
			JSON.stringify(getState().cart.cartItems)
		);
	};

export const saveShippingAddress = (data) => (dispatch) => {
	dispatch({ type: CART_SAVE_SHIPPING_ADDRESS, payload: data });
	localStorage.setItem('shippingAddress', JSON.stringify(data));
};
export const savePaymentMethod = (data) => (dispatch) => {
	dispatch({ type: CART_SAVE_PAYMENT_METHOD, payload: data });
};
