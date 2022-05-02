import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import {
  createProduct,
  deleteProduct,
  listProducts,
} from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {
  PRODUCT_CREATE_RESET,
  PRODUCT_DELETE_RESET,
} from '../constants/productConstants';

export default function ProductListScreen(props) {
  const { pageNumber = 1 } = useParams();

  const sellerMode = props.match.path.indexOf('/seller') >= 0;
  const productList = useSelector(state => state.productList);
  const { loading, error, products, page, pages } = productList;

  const productCreate = useSelector(state => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const productDelete = useSelector(state => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;
  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();
  useEffect(() => {
    if (successCreate) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      props.history.push(`/product/${createdProduct._id}/edit`);
    }
    if (successDelete) {
      dispatch({ type: PRODUCT_DELETE_RESET });
    }
    dispatch(
      listProducts({ seller: sellerMode ? userInfo._id : '', pageNumber })
    );
  }, [
    createdProduct,
    dispatch,
    props.history,
    sellerMode,
    successCreate,
    successDelete,
    userInfo._id,
    pageNumber,
  ]);

  const deleteHandler = product => {
    if (window.confirm('Are you sure to delete?')) {
      dispatch(deleteProduct(product._id));
    }
  };
  const createHandler = () => {
    dispatch(createProduct());
  };
  const verHandler = () => {};

  return (
    <div>
      <div className="row">
        <h1>Listado de Productos</h1>
        <button type="button" className="no-margins" onClick={createHandler}>
          Agregar Producto
        </button>
      </div>

      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}

      {loadingCreate && <LoadingBox></LoadingBox>}
      {errorCreate && <MessageBox variant="danger">{errorCreate}</MessageBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <React.Fragment key={99}>
          <table
            className="table table-container__table table-container__table--break-sm"
            id="product-list-table"
          >
            <thead>
              <tr>
                <th>ID-Producto</th>
                <th>Nombre</th>
                <th>Descripcion</th>
                <th>Precio</th>
                <th>Categoria</th>
                <th>Marca</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td data-heading="ID-PRODUCTO">
                    {product._id.substr(1, 10)}
                  </td>
                  <td data-heading="Nombre Producto">{product.name}</td>
                  <td data-heading="Descripcion">{product.description}</td>
                  <td data-heading="Precion US$">{product.price}</td>
                  <td data-heading="Categoria">{product.category}</td>
                  <td data-heading="Marca">{product.brand}</td>
                  <td data-heading="Stock">{product.countInStock}</td>
                  <td data-heading="Acciones">
                    <button
                      type="button"
                      className="small btn-circle"
                      onClick={() => verHandler(product)}
                    >
                      <i className="fas fa-search"></i>
                    </button>
                    <button
                      type="button"
                      className="small btn-circle"
                      onClick={() =>
                        props.history.push(`/product/${product._id}/edit`)
                      }
                    >
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button
                      type="button"
                      className="small btn-circle"
                      onClick={() => deleteHandler(product)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row center pagination">
            {[...Array(pages).keys()].map(x => (
              <Link
                className={x + 1 === page ? 'active' : ''}
                key={x + 1}
                to={`/productlist/pageNumber/${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
