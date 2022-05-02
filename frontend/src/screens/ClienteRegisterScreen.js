import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerCliente } from '../actions/clienteActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function RegisterScreen(props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rif, setRif] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [prontoPago, setProntoPago] = useState('');
  const [descuento, setDescuento] = useState('');
  const [contacto, setContacto] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const redirect = props.location.search
    ? props.location.search.split('=')[1]
    : '/';

  const clienteRegister = useSelector(state => state.clienteRegister);
  const { userInfo, loading, error } = clienteRegister;

  const dispatch = useDispatch();

  const submitHandler = e => {
    e.preventDefault();
    dispatch(
      registerCliente(
        name,
        email,
        rif,
        direccion,
        telefono,
        prontoPago,
        descuento,
        contacto,
        observaciones
      )
    );
  };
  useEffect(() => {
    if (userInfo) {
      props.history.push(redirect);
    }
  }, [props.history, redirect, userInfo]);
  return (
    <div>
      <form className="form registro" onSubmit={submitHandler}>
        <div>
          <h1>Agregar Empresas (clientes)</h1>
        </div>
        {loading && <LoadingBox></LoadingBox>}
        {error && <MessageBox variant="danger">{error}</MessageBox>}

        <div>
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            required
            onChange={e => setName(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="apellido">R.i.f.</label>
          <input
            type="text"
            id="apellido"
            required
            onChange={e => setRif(e.target.value)}
          ></input>
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            required
            onChange={e => setEmail(e.target.value)}
          ></input>
        </div>

        <div>
          <label htmlFor="direccion">Direccion Fiscal</label>
          <input
            type="text"
            id="direccion"
            required
            onChange={e => setDireccion(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="telefono">Telefono</label>
          <input
            type="text"
            id="telefono"
            required
            onChange={e => setTelefono(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="prontopago">Pronto Pago</label>
          <input
            type="number"
            id="prontpago"
            onChange={e => setProntoPago(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="descuento">Descuento</label>
          <input
            type="number"
            id="descuento"
            onChange={e => setDescuento(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="contacto">Contacto</label>
          <input
            type="text"
            id="contacto"
            required
            onChange={e => setContacto(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="observaciones">Observaciones</label>
          <input
            type="text"
            id="observaciones"
            required
            onChange={e => setObservaciones(e.target.value)}
          ></input>
        </div>

        <div>
          <label />
          <button className="primary" type="submit">
            Registrar Empresa (cliente)
          </button>
        </div>
      </form>
    </div>
  );
}
