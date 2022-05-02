import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

export default function ShippingAddressScreen(props) {
  const userSignin = useSelector(state => state.userSignin);

  const { userInfo } = userSignin;
  const cart = useSelector(state => state.cart);
  const { shippingAddress } = cart;
  if (!userInfo) {
    props.history.push('/signin');
  }
  const [fullName, setFullName] = useState(shippingAddress.fullName);
  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState('Venezuela');
  const dispatch = useDispatch();
  const submitHandler = e => {
    e.preventDefault();
    dispatch(
      saveShippingAddress({ fullName, address, city, postalCode, country })
    );
    props.history.push('/payment');
  };
  return (
    <div>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <form className="form shipping" onSubmit={submitHandler}>
        <div>
          <h1>Direccion de Envio</h1>
        </div>
        <div>
          <label htmlFor="fullName">Nombre y Apellido</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="address">Direccion</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="city">Ciudad</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={e => setCity(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="postalCode">Codigo Postal</label>
          <input
            type="text"
            id="postalCode"
            value={postalCode}
            onChange={e => setPostalCode(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="country">Pais</label>
          <input
            type="text"
            id="country"
            value={country}
            onChange={e => setCountry(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label />
          <button className="primary" type="submit">
            Continuar...
          </button>
        </div>
      </form>
    </div>
  );
}
