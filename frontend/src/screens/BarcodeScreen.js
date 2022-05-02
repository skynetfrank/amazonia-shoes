import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductoByCode } from '../actions/productActions';

function BarcodeScreen() {
	const [barcode, setBarcode] = useState('');
	const [talla, setTalla] = useState('');
	const [color, setColor] = useState('En-Imagen');
	const [disponible, setDisponible] = useState(0);
	const [arrayTallas, setArrayTallas] = useState([
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

	const dispatch = useDispatch();

	const productByCode = useSelector((state) => state.productbyCode);
	const { loading, error, success, producto: product } = productByCode;

	useEffect(() => {
		if (product) {
			for (let index = 0; index < product.sizesInStock.length; index++) {
				const element = product.sizesInStock[index];
				let tallasDisponibles = [' '];

				for (let index = 0; index < element.length; index += 2) {
					if (element[index] > 0) {
						tallasDisponibles.push(element[index - 1]);
					}
				}

				setArrayTallas(tallasDisponibles);
			}
		}
	}, [product]);

	useEffect(() => {
		console.log('useeffect triggered');
		dispatch(getProductoByCode(barcode));
	}, [barcode, dispatch]);

	console.log('Producto encontrado:', product, 'barcode:', barcode);
	console.log('Tallas Disponibles:', product?.sizesInStock[0]);
	return (
		<div className='centrado'>
			<h1 className='scan'>Scan Producto</h1>
			<>
				<div className='search-div scan'>
					<input
						type='text'
						value={barcode}
						className='search-input'
						placeholder='ingresa un codigo'
						onChange={(e) => setBarcode(e.target.value)}
					></input>
				</div>
			</>
			<>
				<div className='screen-offset'>
					<div className='row'>
						{product && (
							<div className='col-2 scan'>
								<img className='large' src={product?.image} alt='foto' />
							</div>
						)}
						{product && (
							<div className='col-1 scan'>
								<ul className='scan'>
									<li>
										<h1>{product?.name}</h1>
									</li>
									<li>
										<p>Modelo: {product?.modelo}</p>
									</li>
									<li>
										<p>Descripcion: </p> {product?.description}
									</li>
									<li>
										<p>Precio: ${product?.price}</p>
									</li>
									<li>
										<p>Existencia: {product?.countInStock} (pares)</p>
									</li>
									<li>
										<div>
											<p>Tallas :</p>
											<p>
												{product.sizesInStock[0].map((x) =>
													x.length === 2 ? x + '-' : ''
												)}
											</p>
										</div>
									</li>
								</ul>
							</div>
						)}
					</div>
				</div>
			</>
		</div>
	);
}

export default BarcodeScreen;
