import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { detailsProduct, updateProduct } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';

export default function ProductEditScreen(props) {
	const productId = props.match.params.id;
	const [modelo, setModelo] = useState('');
	const [subcategory, setSubcategory] = useState('');
	const [costo, setCosto] = useState(0);
	const [preciomayor, setPreciomayor] = useState(0);
	const [precioespecial, setPrecioespecial] = useState(0);
	const [preciodocena, setPreciodocena] = useState(0);
	const [genero, setGenero] = useState('unisex');
	const [tipo, setTipo] = useState('');
	const [proveedor, setProveedor] = useState('60f6db4f143c7d2bf856444a');
	const [tags, setTags] = useState([]);
	const [name, setName] = useState('');
	const [price, setPrice] = useState(0);
	const [image, setImage] = useState('');
	const [cloudImage, setCloudImage] = useState('');
	const [category, setCategory] = useState('');
	const [countInStock, setCountInStock] = useState(0);
	const [sizesInStock, setSizesInStock] = useState([]);
	const [brand, setBrand] = useState('');
	const [description, setDescription] = useState('');
	const [visible, setVisible] = useState(false);
	const productDetails = useSelector((state) => state.productDetails);
	const [codigo, setCodigo] = useState('');

	const { loading, error, product } = productDetails;

	const productUpdate = useSelector((state) => state.productUpdate);
	const {
		loading: loadingUpdate,
		error: errorUpdate,
		success: successUpdate,
	} = productUpdate;

	const dispatch = useDispatch();

	useEffect(() => {
		if (successUpdate) {
			props.history.push('/productlist');
		}
		if (!product || product._id !== productId || successUpdate) {
			dispatch({ type: PRODUCT_UPDATE_RESET });
			dispatch(detailsProduct(productId));
		} else {
			setName(product.name);
			setCodigo(codigo);
			setPrice(product.price);
			setImage(product.image);
			setCloudImage(product.cloudImage);
			setCategory(product.category);
			setCountInStock(product.countInStock);
			setSizesInStock(product.sizesInStock);
			setBrand(product.brand);
			setDescription(product.description);
			setModelo(product.modelo);
			setSubcategory(product.subcategory);
			setCosto(product.costo);
			setPreciomayor(product.precioMayor);

			setPrecioespecial(product.precioEspecial);
			setPreciodocena(product.preciodocena);
			setGenero(product.genero);
			setTipo(product.tipo);

			setProveedor(product.proveedor);
			setTags(product.tags);
			setVisible(product.visible);

			const populateStock = () => {
				var myStockTable = document.getElementById('stock-table');
				var fullStockArray = product.sizesInStock;
				var columna = 1;
				console.log(fullStockArray);

				for (var i = 0; i < 11; i++) {
					columna = 1;

					for (var j = 2; j < 29; j += 2) {
						let cant = fullStockArray[i][j];
						myStockTable.rows[i + 2].cells[columna].children[0].value = cant;
						columna++;
					}
				}
			};

			if (product.sizesInStock.length > 0) {
				populateStock();
				totalesPorTalla();
			}
		}
	}, [product, dispatch, productId, successUpdate, props.history, codigo]);

	const submitHandler = (e) => {
		e.preventDefault();

		if (countInStock === 0) {
			alert('No ha cargado el inventario para este producto');
			return;
		}

		dispatch(
			updateProduct({
				_id: productId,
				name,
				codigo,
				price,
				image,
				cloudImage,
				category,
				brand,
				countInStock,
				sizesInStock,
				description,
				modelo,
				subcategory,
				costo,
				preciomayor,
				precioespecial,
				preciodocena,
				genero,
				tipo,
				proveedor,
				tags,
				visible,
			})
		);
	};
	const [loadingUpload, setLoadingUpload] = useState(false);
	const [errorUpload, setErrorUpload] = useState('');

	const userSignin = useSelector((state) => state.userSignin);
	const { userInfo } = userSignin;

	const uploadFileHandler = async (e) => {
		const file = e.target.files[0];
		const bodyFormData = new FormData();
		bodyFormData.append('image', file);
		setLoadingUpload(true);
		try {
			const { data } = await Axios.post('/api/uploads', bodyFormData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${userInfo.token}`,
				},
			});
			console.log('data upload recibida:', data);
			setImage(data.url);
			setCloudImage(data.cloudinaryUrl);
			setLoadingUpload(false);
		} catch (error) {
			setErrorUpload(error.message);
			setLoadingUpload(false);
		}
	};

	const scanStock = () => {
		//e.preventDefault();
		let totalGeneralStock = 0;
		var myStockTable = document.getElementById('stock-table');
		let fullStockArray = [];
		var arrayColores = [];
		var arrayCantidad = [];
		var arrayTallas = [];
		let itemStockArray = [];

		for (var i = 2; i <= 12; i++) {
			itemStockArray.push(myStockTable.rows[i].cells[0].innerHTML);
			arrayColores.push(myStockTable.rows[i].cells[0].innerHTML);
			for (var m = 1; m <= 14; m++) {
				itemStockArray.push(myStockTable.rows[1].cells[m].innerHTML);
				arrayTallas.push(myStockTable.rows[1].cells[m].innerHTML);

				for (var j = 1; j <= 1; j++) {
					let cantidad = Number(
						myStockTable.rows[i].cells[m].children[0].value
					);
					if (cantidad < 0 || cantidad > 999 || !Number.isInteger(cantidad)) {
						alert(
							'La Siguiente Cantidad es Erronea: ' +
								cantidad +
								' .No se cargo el inventario...verifique!!'
						);
					}
					itemStockArray.push(
						Number(myStockTable.rows[i].cells[m].children[0].value)
					);
					arrayCantidad.push(myStockTable.rows[i].cells[m].children[0].value);
					totalGeneralStock += cantidad;
				}
			}
			fullStockArray.push(itemStockArray);
			itemStockArray = [];
		}
		setCountInStock(totalGeneralStock);

		setSizesInStock(fullStockArray);
		myStockTable.rows[0].cells[0].innerHTML = totalGeneralStock;
		console.log('sizesInStock after scan: ', sizesInStock);
		totalesPorTalla();
	};

	const totalesPorTalla = () => {
		var myStockTable = document.getElementById('stock-table');
		var itemsColumna = [];
		var totalStock = 0;

		for (let m = 1; m < 15; m++) {
			itemsColumna = [];
			for (var i = 2; i <= 12; i++) {
				for (var j = 1; j <= 1; j++) {
					itemsColumna.push(
						Number(myStockTable.rows[i].cells[m].children[0].value)
					);
				}

				var totalColumna = itemsColumna.reduce(function (a, b) {
					return a + b;
				});
				myStockTable.rows[13].cells[m].children[0].value = totalColumna;
			}
			console.log('totalStock:', totalColumna, totalStock);
			totalStock += totalColumna;
		}

		myStockTable.rows[0].cells[0].innerHTML = 'Total: ' + totalStock;
	};

	const handleVisible = (e) => {
		let isChecked = e.target.checked;
		setVisible(isChecked);
	};

	return (
		<div className='wrapper'>
			<div className='div-producto'>
				<form
					className='form producto'
					id='form-producto'
					onSubmit={submitHandler}
				>
					{loadingUpdate && <LoadingBox></LoadingBox>}
					{errorUpdate && (
						<MessageBox variant='danger'>{errorUpdate}</MessageBox>
					)}
					{loading ? (
						<LoadingBox></LoadingBox>
					) : error ? (
						<MessageBox variant='danger'>{error}</MessageBox>
					) : (
						<React.Fragment key={99}>
							<div>
								<label htmlFor='codigo'>Nombre</label>
								<input
									id='codigo'
									type='text'
									placeholder='Ingrese el Codigo'
									value={codigo}
									maxLength='35'
									onChange={(e) => setCodigo(e.target.value)}
								></input>
							</div>
							<div>
								<label htmlFor='name'>Nombre</label>
								<input
									id='name'
									type='text'
									placeholder='Enter name'
									value={name}
									maxLength='25'
									onChange={(e) => setName(e.target.value)}
								></input>
							</div>
							<div>
								<label htmlFor='modelo'>Modelo</label>
								<input
									id='modelo'
									type='text'
									placeholder='Ingrese un Modelo'
									value={modelo}
									onChange={(e) => setModelo(e.target.value)}
								></input>
							</div>
							<div>
								<label htmlFor='price'>Precio</label>
								<input
									id='price'
									type='text'
									placeholder='Enter price'
									value={price}
									onChange={(e) => setPrice(e.target.value)}
								></input>
							</div>
							<div className='hide'>
								<label htmlFor='countInStock'>Inventario</label>
								<input
									id='countInStock'
									type='text'
									placeholder='numero de unidades en Stock'
									value={countInStock}
									onChange={(e) => setCountInStock(e.target.value)}
								></input>
							</div>

							<div className='hide'>
								<label htmlFor='image'>Imagen</label>
								<input
									id='image'
									type='text'
									value={image}
									onChange={(e) => setImage(e.target.value)}
								></input>
							</div>
							<div className='hide'>
								<label htmlFor='cloudImage'>Cloudinary</label>
								<input
									id='cloudImage'
									type='text'
									value={cloudImage}
									onChange={(e) => setCloudImage(e.target.value)}
								></input>
							</div>

							<div>
								<label htmlFor='imageFile'>Imagen</label>
								<input
									type='file'
									id='imageFile'
									label='Choose Image'
									onChange={uploadFileHandler}
								></input>
								{loadingUpload && <LoadingBox></LoadingBox>}
								{errorUpload && (
									<MessageBox variant='danger'>{errorUpload}</MessageBox>
								)}
							</div>
							<div id='div-tiny-image'>
								<img src={image} className='tiny-image' alt='imagen' />
								<p>
									Imagen actual asignada selecciona un archivo con el boton de
									arriba para cambiar la imagen.
								</p>
							</div>

							<div>
								<label htmlFor='category'>Categoria</label>
								<input
									id='category'
									type='text'
									placeholder='Ingrese una categoria'
									value={category}
									onChange={(e) => setCategory(e.target.value)}
								></input>
							</div>
							<div className='hide'>
								<label htmlFor='subcategory'>Sub Categoria</label>
								<input
									id='subcategory'
									type='text'
									placeholder='Ingrese una sub-categoria'
									value={subcategory}
									onChange={(e) => setSubcategory(e.target.value)}
								></input>
							</div>
							<div>
								<label htmlFor='brand'>Marca</label>
								<input
									id='brand'
									type='text'
									placeholder='Ingrese una Marca de producto'
									value={brand}
									onChange={(e) => setBrand(e.target.value)}
								></input>
							</div>

							<div>
								<label htmlFor='description'>Descripcion</label>
								<textarea
									id='description'
									rows='2'
									type='text'
									placeholder='escriba una pequeña descripcion del producto'
									value={description}
									onChange={(e) => setDescription(e.target.value)}
								></textarea>
							</div>

							<div className='hide'>
								<label htmlFor='genero'>Genero</label>
								<input
									id='genero'
									type='text'
									placeholder='Ingrese un genero'
									value={genero}
									onChange={(e) => setGenero(e.target.value)}
								></input>
							</div>
							<div className='hide'>
								<label htmlFor='tipo'>Tipo</label>
								<input
									id='tipo'
									type='text'
									placeholder='Ingrese un Tipo'
									value={tipo}
									onChange={(e) => setTipo(e.target.value)}
								></input>
							</div>

							<div>
								<label htmlFor='costo'>Costo</label>
								<input
									id='costo'
									type='number'
									value={costo}
									onChange={(e) => setCosto(e.target.value)}
								></input>
							</div>
							<div>
								<label htmlFor='preciomayor'>Precio al Mayor</label>
								<input
									id='preciomayor'
									type='number'
									value={preciomayor}
									onChange={(e) => setPreciomayor(e.target.value)}
								></input>
							</div>

							<div className='hide'>
								<label htmlFor='precioespecial'>Precio Especial</label>
								<input
									id='precioespecial'
									type='number'
									value={precioespecial}
									onChange={(e) => setPrecioespecial(e.target.value)}
								></input>
							</div>
							<div className='hide'>
								<label htmlFor='preciodocena'>Precio por Docena</label>
								<input
									id='preciodocena'
									type='number'
									value={preciodocena}
									onChange={(e) => setPreciodocena(e.target.value)}
								></input>
							</div>

							<div className='hide'>
								<label htmlFor='proveedor'>Proveedor</label>
								<input
									id='proveedor'
									type='text'
									value={proveedor}
									onChange={(e) => setProveedor(e.target.value)}
								></input>
							</div>
							<div>
								<label htmlFor='visible'>Visible?</label>
								<input
									id='visible'
									type='checkbox'
									checked={visible}
									onChange={(e) => handleVisible(e)}
								></input>
							</div>

							<div>
								<button className='primary block' type='submit'>
									Guardar Producto
								</button>
							</div>
						</React.Fragment>
					)}
				</form>
				{/* tiny stock app  */}
				<div id='tiny-stock-app'>
					<h2>Inventario por Talla y Color: {name}</h2>
					<table id='stock-table' onClick={totalesPorTalla}>
						<thead>
							<tr>
								<th></th>
								<th colSpan='14' id='th-tallas'>
									&#8592; Tallas &#8594;
								</th>
							</tr>
							<tr>
								<th id='th-colores'>Colores &#8595;</th>
								<th>34</th>
								<th>35</th>
								<th>36</th>
								<th>37</th>
								<th>38</th>
								<th>39</th>
								<th>40</th>
								<th>41</th>
								<th>42</th>
								<th>43</th>
								<th>44</th>
								<th>45</th>
								<th>46</th>
								<th>47</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>En-Imagen</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
							</tr>
							<tr>
								<td>Blanco</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
							</tr>
							<tr>
								<td>Negro</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
							</tr>

							<tr>
								<td>Azul</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
							</tr>

							<tr>
								<td>Amarillo</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
							</tr>

							<tr>
								<td>Verde</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
							</tr>
							<tr>
								<td>Rojo</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
							</tr>
							<tr>
								<td>Rosado</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
							</tr>
							<tr>
								<td>Vinotinto</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
							</tr>
							<tr>
								<td>Fucsia</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
							</tr>
							<tr>
								<td>Violeta</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										defaultValue='0'
									/>
								</td>
							</tr>
							<tr>
								<td>Subtotal &#8594;</td>
								<td>
									<input
										type='number'
										className='input-talla '
										disabled
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										disabled
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										disabled
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										disabled
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										disabled
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										disabled
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										disabled
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										disabled
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										disabled
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										disabled
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										disabled
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										disabled
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										disabled
										defaultValue='0'
									/>
								</td>
								<td>
									<input
										type='number'
										className='input-talla'
										disabled
										defaultValue='0'
									/>
								</td>
							</tr>
						</tbody>
					</table>
					<button className='admin' onClick={scanStock}>
						Cargar Inventario ({countInStock} pares)
					</button>
				</div>
			</div>
		</div>
	);
}
