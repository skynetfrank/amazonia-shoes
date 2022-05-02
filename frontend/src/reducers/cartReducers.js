import {
  CART_ADD_ITEM,
  CART_ADD_ITEM_FAIL,
  CART_EMPTY,
  CART_REMOVE_ITEM,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
} from '../constants/cartConstants';

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    
    case CART_ADD_ITEM:
     
      const item = action.payload;
    
      const existItem = state.cartItems.find((x) => (x.product === item.product && x.talla=== item.talla && x.color===item.color));
      if (existItem) {
        return {
          ...state,
          error: '',
          cartItems: state.cartItems.map((x) =>
           ( x.product === existItem.product && x.talla === existItem.talla && x.color===existItem.color ) ? item : x
          ),
        };
      } else {
        return { ...state, error: '', cartItems: [...state.cartItems, item] };
      }
    case CART_REMOVE_ITEM:
      console.log("REDUCER REMOVE action.payload",action.payload);
       console.log("REDUCER REMOVE state.cartItems",state.cartItems);
      return {
        ...state,
        error: '',
        //cartItems: state.cartItems.filter((x) => x.product !== action.payload),
        cartItems: state.cartItems.filter((x) => (x.product + x.talla + x.color ) !== (action.payload.productId + action.payload.talla + action.payload.color)),
      };
    case CART_SAVE_SHIPPING_ADDRESS:
      return { ...state, shippingAddress: action.payload };
    case CART_SAVE_PAYMENT_METHOD:
      return { ...state, paymentMethod: action.payload };
    case CART_ADD_ITEM_FAIL:
      return { ...state, error: action.payload };
    case CART_EMPTY:
      return { ...state, error: '', cartItems: [] };
    default:
      return state;
  }
};
