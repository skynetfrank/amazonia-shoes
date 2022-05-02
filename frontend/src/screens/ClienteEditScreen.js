import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  detailsCliente,
  updateClienteProfile,
} from '../actions/clienteActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { CLIENTE_UPDATE_PROFILE_RESET } from '../constants/clienteConstants';

export default function ProfileScreen(props) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [rif, setRif] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [prontopago, setProntopago] = useState('');
  const [descuento, setDescuento] = useState('');
  const [contacto, setContacto] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const clienteId = props.match.params.id;
  console.log('clienteId:', clienteId);
  //const userSignin = useSelector(state => state.userSignin);
  //const { userInfo } = userSignin;
  const clienteDetails = useSelector(state => state.clienteDetails);
  const { loading, error, cliente } = clienteDetails;
  const clienteUpdateProfile = useSelector(state => state.clienteUpdateProfile);
  const {
    success: successUpdate,
    error: errorUpdate,
    loading: loadingUpdate,
  } = clienteUpdateProfile;
  const dispatch = useDispatch();
  useEffect(() => {
    if (!cliente) {
      dispatch({ type: CLIENTE_UPDATE_PROFILE_RESET });
      dispatch(detailsCliente(clienteId));
    } else {
      setNombre(cliente.nombre);
      setEmail(cliente.email);
      setRif(cliente.rif);
      setDireccion(cliente.direccion);
      setTelefono(cliente.telefono);
      setProntopago(cliente.prontopago);
      setDescuento(cliente.descuento);
      setContacto(cliente.contacto);
      setObservaciones(cliente.observaciones);
    }
  }, [dispatch, cliente, clienteId]);

  const submitHandler = e => {
    e.preventDefault();
    dispatch(
      updateClienteProfile({
        _id: clienteId,
        nombre,
        email,
        rif,
        direccion,
        telefono,
        prontopago,
        descuento,
        contacto,
        observaciones,
      })
    );
    // dispatch update profile
  };
  return (
    <div>
      <form className="form profile" onSubmit={submitHandler}>
        <div>
          <h1>Editar Informacion de Empresa</h1>
        </div>
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            {loadingUpdate && <LoadingBox></LoadingBox>}
            {errorUpdate && (
              <MessageBox variant="danger">{errorUpdate}</MessageBox>
            )}
            {successUpdate && (
              <MessageBox variant="success">
                Se ha Actualizado la Informacion Correctamente!
              </MessageBox>
            )}
            <div>
              <label htmlFor="name">Razon Social</label>
              <input
                id="name"
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="rif">R.I.F.</label>
              <input
                id="rif"
                type="text"
                value={rif}
                onChange={e => setRif(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              ></input>
            </div>

            <div>
              <label htmlFor="Direccion">Direccion Fiscal</label>
              <input
                id="direccion"
                type="text"
                value={direccion}
                onChange={e => setDireccion(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="telefono">Telefono</label>
              <input
                id="telefono"
                type="text"
                value={telefono}
                onChange={e => setTelefono(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="rif">Pronto Pago</label>
              <input
                id="prontopago"
                type="text"
                value={prontopago}
                onChange={e => setProntopago(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="rif">Descuento</label>
              <input
                id="descuento"
                type="text"
                value={descuento}
                onChange={e => setDescuento(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="rif">Contacto</label>
              <input
                id="contacto"
                type="text"
                value={contacto}
                onChange={e => setContacto(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="rif">Observaciones</label>
              <input
                id="observaciones"
                type="text"
                value={observaciones}
                onChange={e => setObservaciones(e.target.value)}
              ></input>
            </div>
            <div>
              <label />
              <button className="primary" type="submit">
                Actualizar Informacion
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
