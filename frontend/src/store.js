import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { cartReducer } from './reducers/cartReducers';
import {
	clienteDeleteReducer,
	clienteDetailsReducer,
	clienteListReducer,
	clienteRegisterReducer,
	clienteUpdateProfileReducer,
} from './reducers/clienteReducers';
import {
	orderCreateReducer,
	orderDeleteReducer,
	orderDeliverReducer,
	orderDetailsReducer,
	orderListReducer,
	orderMineListReducer,
	orderPayconfirmReducer,
	orderPayReducer,
	orderSummaryReducer,
} from './reducers/orderReducers';
import {
	productCategoryListReducer,
	productCreateReducer,
	productDeleteReducer,
	productDetailsReducer,
	productListReducer,
	productReviewCreateReducer,
	productUpdateReducer,
	productUpdateExistenciaReducer,
	getProductbyCodeReducer,
} from './reducers/productReducers';
import {
	userAddressMapReducer,
	userDeleteReducer,
	userDetailsReducer,
	userListReducer,
	userRegisterReducer,
	userSigninReducer,
	userTopSellerListReducer,
	userUpdateProfileReducer,
	userUpdateReducer,
} from './reducers/userReducers';

const initialState = {
	userSignin: {
		userInfo: localStorage.getItem('userInfo')
			? JSON.parse(localStorage.getItem('userInfo'))
			: null,
	},
	cart: {
		cartItems: localStorage.getItem('cartItems')
			? JSON.parse(localStorage.getItem('cartItems'))
			: [],
		shippingAddress: localStorage.getItem('shippingAddress')
			? JSON.parse(localStorage.getItem('shippingAddress'))
			: {},
		paymentMethod: 'PayPal',
	},
};

const reducer = combineReducers({
	productList: productListReducer,
	productDetails: productDetailsReducer,
	cart: cartReducer,
	userSignin: userSigninReducer,
	userRegister: userRegisterReducer,
	clienteRegister: clienteRegisterReducer,
	orderCreate: orderCreateReducer,
	orderDetails: orderDetailsReducer,
	orderPay: orderPayReducer,
	orderPayconfirm: orderPayconfirmReducer,
	orderMineList: orderMineListReducer,
	userDetails: userDetailsReducer,
	clienteDetails: clienteDetailsReducer,
	userUpdateProfile: userUpdateProfileReducer,
	clienteUpdateProfile: clienteUpdateProfileReducer,
	userUpdate: userUpdateReducer,
	productCreate: productCreateReducer,
	productUpdate: productUpdateReducer,
	productUpdateExistencia: productUpdateExistenciaReducer,
	productDelete: productDeleteReducer,
	productbyCode: getProductbyCodeReducer,
	orderList: orderListReducer,
	orderDelete: orderDeleteReducer,
	orderDeliver: orderDeliverReducer,
	userList: userListReducer,
	clienteList: clienteListReducer,
	userDelete: userDeleteReducer,
	clienteDelete: clienteDeleteReducer,
	userTopSellersList: userTopSellerListReducer,
	productCategoryList: productCategoryListReducer,
	productReviewCreate: productReviewCreateReducer,
	userAddressMap: userAddressMapReducer,
	orderSummary: orderSummaryReducer,
});
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
	reducer,
	initialState,
	composeEnhancer(applyMiddleware(thunk))
);

export default store;
