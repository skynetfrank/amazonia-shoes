import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listOrderMine } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function OrderHistoryScreen(props) {
  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;
  const orderMineList = useSelector(state => state.orderMineList);
  const { loading, error, orders } = orderMineList;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listOrderMine());
  }, [dispatch]);
  return (
    <div className="div-tabla-history">
      <div className="row center">
        <h1 className="clean">Mis Pedidos</h1>
      </div>
      <h2 className="clean">
        {userInfo.name} {''}
        {userInfo.apellido}
      </h2>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table
          className="table table-container__table table-container__table--break-sm"
          id="tabla-mispedidos"
        >
          <thead>
            <tr>
              <th>Pedido Numero</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Pagado?</th>
              <th>Entregado?</th>
              <th>Fecha Pago</th>
              <th>Banco</th>
              <th>Referencia</th>
              <th>Efectivo</th>
              <th>Status del Pago</th>
              <th>Ver Detalle</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td data-heading="Pedido Numero">
                  {order._id.substring(10, 24)}
                </td>
                <td data-heading="Fecha">{order.createdAt.substring(0, 10)}</td>
                <td data-heading="Total">{order.totalPrice.toFixed(2)}</td>
                <td data-heading="Pagado?">
                  {order.isPaid ? order.paidAt.substring(0, 10) : 'No'}
                </td>
                <td data-heading="Entregado">
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : 'No'}
                </td>
                <td data-heading="Fecha Pago">
                  {order.paymentResult?.fechaTransferencia?.substring(0, 10)}
                </td>
                <td data-heading="Banco">{order.paymentResult?.banco}</td>
                <td data-heading="Referencia">
                  {order.paymentResult?.referencia}
                </td>
                <td data-heading="Cash $">{order.paymentResult?.montoCash}</td>
                <td data-heading="Status del Pago">
                  {order.paymentResult?.status}
                </td>
                <td data-heading="Ver Detalle">
                  <button
                    type="button"
                    className="small btn-circle"
                    onClick={() => {
                      props.history.push(`/order/${order._id}`);
                    }}
                  >
                    <i className="fas fa-search"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
