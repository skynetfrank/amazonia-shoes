import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsProduct } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

function ProductScreen(props) {
  const dispatch = useDispatch();
  const productId = props.match.params.id;
  const [qty, setQty] = useState(1);
  const [talla, setTalla] = useState('');
  const [arrayTallas,setArrayTallas] = useState([
    '',
    '34',
    '35',
    '36',
    '37',
    '38',
    '39',
    '40',
    '41',
    '42',
    '43',
    '44',
    '45',
    '46',
    '47',
  ]);
  const [color, setColor] = useState('En-Imagen');
  const [disponible, setDisponible] = useState(0);
  const productDetails = useSelector(state => state.productDetails);
  const { loading, error, product } = productDetails;

  useEffect(() => {
    dispatch(detailsProduct(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (product) {
     
      for (let index = 0; index < product.sizesInStock.length; index++) {
        const element = product.sizesInStock[index];
        const found = element.find(z => z === color);
        if (found) {
           console.log("array de Tallas",element)
           let tallasDisponibles=[' '];

          for (let index = 0; index < element.length; index+=2) {
            
            if(element[index]>0){
              tallasDisponibles.push(element[index-1]);                         
            }            
          }
      
          setArrayTallas(tallasDisponibles)
          const foundTalla = element.findIndex(c => c === talla);
          const cantDisponible = element[foundTalla + 1];
      
          setDisponible(cantDisponible);
        }
       
      }
    }
  }, [color, disponible, product, talla]);

  const addToCartHandler = () => {
    props.history.push(
      `/cart/${productId}?qty=${qty}&talla=${talla}&color=${color}&disponible=${disponible}`
    );
  };

  return (
    <div className="screen-offset">
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">Ha ocurrido un error: {error}</MessageBox>
      ) : (
        <div className="screen-offset">
          <div className="row">
            <div className="col-2">
              <img className="large" src={product.image} alt={product.name} />
            </div>
            <div className="col-1">
              <ul>
                <li>
                  <h1>{product.name}</h1>
                </li>
                <li>
                  <h2>Precio ${product.price}</h2>
                  <p>Modelo: {product.modelo}</p>
                </li>
                <li>
                  <p>Descripcion: </p> {product.description}
                </li>
                <li>
                  <div>
                    <p>Talla :</p>
                    <select
                      id="select-talla"
                      value={talla}
                      onChange={e => setTalla(e.target.value)}
                    >
                      {arrayTallas.map((x, ind) => (
                        <option key={ind} value={x}>
                          {x}
                        </option>
                      ))}
                    </select>
                  </div>
                </li>
                <li>
                  <div>
                    <p>Color:</p>
                    <select
                      id="select-color"
                      value={color}
                      onChange={e => setColor(e.target.value)}
                    >
                      {product.sizesInStock.map(x => (
                        <option key={x} value={x[0]}>
                          {x[0]}
                        </option>
                      ))}
                    </select>
                  </div>
                </li>
              </ul>
            </div>
            <div className="col-1">
              <div className="card card-body">
                <div className="row center">
                  <h1>Resumen</h1>
                </div>

                <ul>
                  <li>
                    <div className="row">
                      <div>Precio:</div>
                      <div className="price">${product.price}</div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div>Status:</div>
                      <div>
                        {disponible > 0 ? (
                          <span className="success">Disponible</span>
                        ) : (
                          <span className="danger">No Disponible</span>
                        )}
                      </div>
                    </div>
                  </li>
                  {product.countInStock > 0 && (
                    <>
                      <li>
                        <div className="row">
                          <div>Cantidad:</div>
                          <div>
                            <select
                              id="select-cant"
                              value={qty}
                              onChange={e => setQty(e.target.value)}
                            >
                              {[...Array(disponible).keys()].map(x => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </li>

                      <li>
                        <button
                          className="primary block"
                          onClick={addToCartHandler}
                          disabled={disponible === 0 || talla === ''}
                        >
                          Agregar al Carrito
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductScreen;
