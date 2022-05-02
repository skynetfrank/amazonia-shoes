import { Link } from 'react-router-dom';

function Product(props) {
	const { product } = props;
	return (
		<div key={product._id} className='card'>
			<a href={`/product/${product._id}`}>
				<img className='medium' src={product.image} alt='foto' />
			</a>
			<div className='card-body'>
				<div className='row'>
					<a href={`/product/${product._id}`}>
						<h2 className='no-margin'>{product.name}</h2>
					</a>
					<div className='price'>${product.price}</div>
				</div>
			</div>
		</div>
	);
}

export default Product;
