import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser, updateUserProfile } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [apellido, setApellido] = useState('');
  const [cedula, setCedula] = useState('');
  const [telefono, setTelefono] = useState('');
  const [sellerCodigo, setSellerCodigo] = useState('');
  const [sellerLogo, setSellerLogo] = useState('');
  const [sellerDescription, setSellerDescription] = useState('');

  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;
  const userDetails = useSelector(state => state.userDetails);
  const { loading, error, user } = userDetails;
  const userUpdateProfile = useSelector(state => state.userUpdateProfile);
  const {
    success: successUpdate,
    error: errorUpdate,
    loading: loadingUpdate,
  } = userUpdateProfile;
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) {
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
      dispatch(detailsUser(userInfo._id));
    } else {
      setName(user.name);
      setEmail(user.email);
      setApellido(user.apellido);
      setCedula(user.cedula);
      setTelefono(user.telefono);
      if (user.seller) {
        setSellerCodigo(user.seller.codigo);
        setSellerLogo(user.seller.logo);
        setSellerDescription(user.seller.description);
      }
    }
  }, [dispatch, userInfo._id, user]);
  const submitHandler = e => {
    e.preventDefault();
    // dispatch update profile
    if (password !== confirmPassword) {
      alert('Password and Confirm Password Are Not Matched');
    } else {
      dispatch(
        updateUserProfile({
          userId: user._id,
          name,
          email,
          password,
          apellido,
          cedula,
          telefono,
          sellerCodigo,
          sellerLogo,
          sellerDescription,
        })
      );
    }
  };
  return (
    <div>
      <form className="form profile" onSubmit={submitHandler}>
        <div>
          <h1>Perfil de Usuario</h1>
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
                Perfil Actualizado Exitosamente!
              </MessageBox>
            )}
            <div>
              <label htmlFor="name">Nombre</label>
              <input
                id="name"
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={e => setName(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="apellido">Apellido</label>
              <input
                id="apellido"
                type="text"
                value={apellido}
                onChange={e => setName(e.target.value)}
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
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Solo si desea cambiar su clave actual"
                onChange={e => setPassword(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirme su Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Vuelva a escribir la nueva clave"
                onChange={e => setConfirmPassword(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="cedula">Cedula</label>
              <input
                id="cedula"
                type="text"
                value={cedula}
                onChange={e => setName(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="telefono">Telefono</label>
              <input
                id="telefono"
                type="text"
                value={telefono}
                onChange={e => setName(e.target.value)}
              ></input>
            </div>
            <div>
              <label />
              <button className="primary" type="submit">
                Actualizar Perfil
              </button>
            </div>        
          </>
        )}
      </form>
    </div>
  );
}
