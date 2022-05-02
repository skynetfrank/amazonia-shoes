import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  deliverOrder,
  detailsOrder,
  payconfirmOrder,
  payOrder,
} from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {
  ORDER_DELIVER_RESET,
  ORDER_PAYCONFIRM_RESET,
  ORDER_PAY_RESET,
} from '../constants/orderConstants';

export default function OrderScreen(props) {
  const orderId = props.match.params.id;
  const orderDetails = useSelector(state => state.orderDetails);
  const { order, loading, error } = orderDetails;
  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  const orderPay = useSelector(state => state.orderPay);
  const {
   
    success: successPay,
  } = orderPay;
  const orderPayconfirm = useSelector(state => state.orderPayconfirm);
  const {
    
    success: successPayconfirm,
  } = orderPayconfirm;
  const orderDeliver = useSelector(state => state.orderDeliver);
  const {
    
    success: successDeliver,
  } = orderDeliver;
  const dispatch = useDispatch();

  const dataBancos = [
    '',
    'Banesco',
    'Venezuela',
    'Mercantil',
    'Provincial',
    'Banco del Caribe',
    'Banco BNC',
    'Banco BOD',
    'Banco del Tesoro',
    'Vzlano de Credito',
  ];

  const [referencia, setReferencia] = useState('');
  const [efectivoCash, setEfectivoCash] = useState('');
  const [banco, setBanco] = useState('');
  const [fechaTransfer, setFechaTransfer] = useState(Date());

  useEffect(() => {
    if (
      !order ||
      successPay ||
      successDeliver ||
      successPayconfirm ||
      (order && order._id !== orderId)
    ) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch({ type: ORDER_PAYCONFIRM_RESET });
      dispatch(detailsOrder(orderId));
    }
  }, [dispatch, orderId, successPay, successDeliver, order, successPayconfirm]);

  const procesarPago = () => {
    const paymentResult = {
      id: orderId,
      status: 'POR_CONFIRMAR',
      update_time: ' ',
      email_address: order.user.email,
      banco: banco,
      referencia: referencia,
      fechaTransferencia: fechaTransfer,
      montoCash: efectivoCash,
    };
    dispatch(payOrder(order, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order._id));
  };

  const payconfirmHandler = () => {
    dispatch(payconfirmOrder(order._id));
    //window.location.reload();
  };

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <div className="row top">
        <div className="col2-place-order">
          <div className="div-info-user">
            <p>
              <strong>Pedido No:</strong> {order._id} <br />
              <strong>Nombre:</strong> {order.shippingAddress.fullName}.
              Telf: {userInfo.telefono} <br />
              <strong>Direccion: </strong> {order.shippingAddress.address},
              {order.shippingAddress.city}, {order.shippingAddress.postalCode},
              {order.shippingAddress.country}
            </p>
            <p>
              <strong>Metodo de Pago:</strong> {order.paymentMethod}
            </p>
            <div className="order-status">
              <p>
                <strong>Status:</strong>
              </p>
              {order.isPaid && order.paymentResult.status === 'CONFIRMADO' ? (
                <MessageBox variant="success">
                  Pago Confirmado OK!
                </MessageBox>
              ) : order.isPaid &&
                order.paymentResult.status === 'POR_CONFIRMAR' ? (
                <MessageBox variant="success">
                  Pagado (por Confirmar)
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Pendiente de Pago</MessageBox>
              )}

              {order.isDelivered ? (
                <MessageBox variant="success">
                  Entegrado:{order.paidAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Por Entregar</MessageBox>
              )}
            </div>
          </div>
          <ul>
            <li>
              <h2>Articulos Comprados</h2>
              <div className="card card-body">
                <ul>
                  {order.orderItems.map((item, inx) => (
                    <li key={item.product + inx}>
                      <div className="row">
                        <div>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="small"
                          ></img>
                        </div>
                        <div className="min-30">
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                          <p>Color: {item.color}</p>
                          <p>Talla: {item.talla}</p>
                        </div>

                        <div className="qty-price">
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
        <div className="col1-place-order">
          <div className="card card-body order">
            <ul>
              <li>
                <div className="row center">
                  <h1>Resumen</h1>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Total Productos</div>
                  <div>${order.itemsPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Cobro por Envio</div>
                  <div>${order.shippingPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Impuestos</div>
                  <div>${order.taxPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>
                    <strong> Total a Pagar</strong>
                  </div>
                  <div>
                    <strong>${order.totalPrice.toFixed(2)}</strong>
                  </div>
                </div>
              </li>
              {!order.isPaid && (
                <li className="row center">
                  <br />
                  <div className="row center">
                    <h2>Informacion de Pago</h2>
                  </div>
                  <div>
                    <label htmlFor="fechaTransfer">Fecha </label>
                    <input
                      id="fechaTransfer"
                      type="date"
                      value={fechaTransfer}
                      onChange={e => setFechaTransfer(e.target.value)}
                    ></input>
                  </div>
                  {order.paymentMethod === 'Transferencia' && (
                    <div>
                      <label htmlFor="selectBancos">Banco </label>
                      <select
                        value={banco}
                        id="selectBancos"
                        placeholder="ingrese banco"
                        onChange={e => setBanco(e.target.value)}
                      >
                        {dataBancos.map((x, inx) => (
                          <option key={inx} value={x}>
                            {x}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label htmlFor="referencia">Refer# </label>
                    <input
                      id="referencia"
                      type="text"
                      value={referencia}
                      onChange={e => setReferencia(e.target.value)}
                    ></input>
                  </div>
                  <div>
                    <label htmlFor="efectivo-cash">Cash $ </label>
                    <input
                      id="efectivo-cash"
                      type="number"
                      value={efectivoCash}
                      onChange={e => setEfectivoCash(e.target.value)}
                    ></input>
                  </div>

                  <button
                    className="primary block"
                    id="pay-btn"
                    onClick={procesarPago}
                  >
                    Enviar informacion de Pago
                  </button>
                </li>
              )}
              {userInfo.isAdmin && (
                <li>
                  <p>Administrar Status-Pedido</p>
                  <button
                    className="admin"
                    id="pay-btn"
                    onClick={payconfirmHandler}
                  >
                    Confirmar Pago Recibido OK
                  </button>
                  <button
                    className="admin"
                    id="pay-btn"
                    onClick={deliverHandler}
                  >
                    Pedido Entregado OK
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
