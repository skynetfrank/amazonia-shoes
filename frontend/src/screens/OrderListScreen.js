import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tooltip from '../components/Tooltip';
import { deleteOrder, listOrders } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_DELETE_RESET } from '../constants/orderConstants';

export default function OrderListScreen(props) {
  const sellerMode = props.match.path.indexOf('/seller') >= 0;
  const orderList = useSelector(state => state.orderList);
  const { loading, error, orders } = orderList;
  const orderDelete = useSelector(state => state.orderDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = orderDelete;

  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: ORDER_DELETE_RESET });
    dispatch(listOrders({ seller: sellerMode ? userInfo._id : '' }));
  }, [dispatch, sellerMode, successDelete, userInfo._id]);
  const deleteHandler = order => {
    if (window.confirm('Esta Seguro que Quiere Eliminar este PEdido?')) {
      dispatch(deleteOrder(order._id));
    }
  };
  console.log('Orders:', orders);

  const facturar = () => {};
  return (
    <div>
      <div className="row center">
        <h1>Listado de Pedidos</h1>
      </div>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table table-container__table table-container__table--break-sm">
          <thead>
            <tr>
              <th>ID-PEDIDO</th>
              <th>USUARIO</th>
              <th>FECHA</th>
              <th>TOTAL</th>
              <th>PAGADO?</th>
              <th>ENTREGADO?</th>
              <th>VENDEDOR?</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td data-heading="ID-Pedido">{order._id}</td>
                <td data-heading="Usuario">{order.user.name}</td>
                <td data-heading="Fecha Compra">
                  {order.createdAt.substring(0, 10)}
                </td>
                <td data-heading="Precio Total">
                  {order.totalPrice.toFixed(2)}
                </td>
                <td data-heading="Pagada?">
                  {order.isPaid ? order.paidAt.substring(0, 10) : 'No'}
                </td>
                <td data-heading="Entregado?">
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : 'No'}
                </td>
                <td data-heading="Vendedor?">{order.user.apellido}</td>
                <td data-heading="Acciones">
                  <Tooltip position="left" content="Detalle del Pedido">
                    <button
                      className="small btn-circle"
                      type="button"
                      onClick={() => {
                        props.history.push(`/order/${order._id}`);
                      }}
                    >
                      <i className="fas fa-search"></i>
                    </button>
                  </Tooltip>
                  <Tooltip position="left" content="Eliminar Este Pedido">
                    <button
                      type="button"
                      className="small btn-circle"
                      onClick={() => deleteHandler(order)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </Tooltip>

                  <Tooltip position="left" content="Generar Factura">
                    <button
                      type="button"
                      className="small btn-circle"
                      onClick={() => deleteHandler(facturar)}
                    >
                      <i class="fas fa-cash-register"></i>
                    </button>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
