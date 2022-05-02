import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteCliente, listClientes } from '../actions/clienteActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { CLIENTE_DETAILS_RESET } from '../constants/clienteConstants';

export default function UserListScreen(props) {
  const clienteList = useSelector(state => state.clienteList);
  const { loading, error, clientes } = clienteList;

  const clienteDelete = useSelector(state => state.clienteDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = clienteDelete;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listClientes());
    dispatch({
      type: CLIENTE_DETAILS_RESET,
    });
  }, [dispatch, successDelete]);
  const deleteHandler = cliente => {
    if (
      window.confirm('Esta seguro de eliminar definitivamente esta empresa?')
    ) {
      dispatch(deleteCliente(cliente._id));
    }
  };

  const createHandler = () => {
    //TODO
  };

 

  return (
    <div>
      <div className="row">
        <h1>Listado de Empresas (clientes)</h1>
        <Link to="/registrarcliente">
          <button type="button" className="no-margins" onClick={createHandler}>
            Agregar Empresa
          </button>
        </Link>
      </div>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
      {successDelete && (
        <MessageBox variant="success">
          Cliente Eliminado Exitosamante
        </MessageBox>
      )}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NOMBRE</th>
              <th>R.I.F.</th>
              <th>DIRECCION FISCAL</th>
              <th>E-MAIL</th>
              <th>TELEFONO</th>
              <th>CONTACTO</th>
              <th>DESCUENTO</th>
              <th>PRONTO PAGO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente._id}>
                <td>{cliente._id.substr(1, 6)}</td>
                <td>{cliente.nombre}</td>

                <td>{cliente.rif}</td>
                <td>{cliente.direccion}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.contacto}</td>
                <td>{cliente.descuento}</td>
                <td>{cliente.prontopago}</td>
                <td>
                  <button
                    type="button"
                    className="small"
                    onClick={() =>
                      props.history.push(`/cliente/${cliente._id}/edit`)
                    }
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="small"
                    onClick={() => deleteHandler(cliente)}
                  >
                    Delete
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
