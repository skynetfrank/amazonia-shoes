import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import { isAdmin, isAuth, isSellerOrAdmin } from '../utils.js';

const productRouter = express.Router();

productRouter.get(
	'/',
	expressAsyncHandler(async (req, res) => {
		const pageSize = 9;
		const page = Number(req.query.pageNumber) || 1;
		const name = req.query.name || '';
		const category = req.query.category || '';
		const order = req.query.order || '';
		const min =
			req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
		const max =
			req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
		const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
		const categoryFilter = category ? { category } : {};
		const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
		const count = await Product.countDocuments({
			...nameFilter,
			...categoryFilter,
			...priceFilter,
		});
		const products = await Product.find({
			...nameFilter,
			...categoryFilter,
			...priceFilter,
		})
			.skip(pageSize * (page - 1))
			.limit(pageSize);

		res.send({ products, page, pages: Math.ceil(count / pageSize) });
	})
);

productRouter.get(
	'/categories',
	expressAsyncHandler(async (req, res) => {
		const categories = await Product.find().distinct('category');
		res.send(categories);
	})
);

productRouter.get(
	'/encontrar',
	expressAsyncHandler(async (req, res) => {
		console.log('ROUTER ENTRANDO', req.query);
		const codigo = req.query.codigo || '';
		const producto = await Product.findOne({ codigo });
		console.log('PRODUCTO ENCONTRADO:', producto);
		if (producto) {
			res.send(producto);
		} else {
			res.status(404).send({ message: 'Producto No encontrado' });
		}
	})
);

productRouter.get(
	'/seed',
	expressAsyncHandler(async (req, res) => {
		await Product.remove({});
		/*  const seller = await User.findOne({ isSeller: true });
    if (seller) {
      const products = data.products.map(product => ({
        ...product,
        seller: seller._id,
      }));
      const createdProducts = await Product.insertMany(products);
      res.send({ createdProducts });
    } else {
      res
        .status(500)
        .send({ message: 'No seller found. first run /api/users/seed' });
    } */
		res.send({});
	})
);

productRouter.get(
	'/:id',
	expressAsyncHandler(async (req, res) => {
		const product = await Product.findById(req.params.id).populate(
			'seller',
			'seller.name seller.logo seller.rating seller.numReviews'
		);
		if (product) {
			res.send(product);
		} else {
			res.status(404).send({ message: 'Producto No encontrado' });
		}
	})
);

productRouter.post(
	'/',
	isAuth,
	isSellerOrAdmin,
	expressAsyncHandler(async (req, res) => {
		const product = new Product({
			name: 'ID-' + Date.now(),
			codigo: ' ',
			seller: req.user._id,
			image: '/images/nuevo.jpg',
			cloudImage: ' ',
			price: 0,
			category: 'N/A',
			brand: 'N/A',
			countInStock: 0,
			sizesInStock: [],
			description: 'producto nuevo',
			modelo: 'N/A',
			subcategory: 'N/A',
			costo: 0,
			preciomayor: 0,
			preciodescuento: 0,
			precioespecial: 0,
			genero: 'N/A',
			tipo: 'N/A',
			proveedor: ' ',
			visible: true,
		});
		const createdProduct = await product.save();
		res.send({ message: 'Product Created', product: createdProduct });
	})
);

productRouter.put(
	'/:id',
	isAuth,
	isSellerOrAdmin,
	expressAsyncHandler(async (req, res) => {
		const productId = req.params.id;
		const product = await Product.findById(productId);
		if (product) {
			product.name = req.body.name;
			product.codigo = req.body.codigo;
			product.price = req.body.price;
			product.image = req.body.image;
			product.cloudImage = req.body.cloudUrl;
			product.category = req.body.category;
			product.brand = req.body.brand;
			product.countInStock = req.body.countInStock;
			product.sizesInStock = req.body.sizesInStock;
			product.description = req.body.description;
			product.modelo = req.body.modelo;
			product.subcategoria = req.body.subcategoria;
			product.costo = req.body.costo;
			product.preciomayor = req.body.preciomayor;
			product.preciodescuento = req.body.preciodescuento;
			product.precioespecial = req.body.precioespecial;
			product.genero = req.body.genero;
			product.tipo = req.body.tipo;
			product.proveedor = req.body.proveedor;
			product.visible = req.body.visible;

			const updatedProduct = await product.save();
			res.send({ message: 'Product Updated', product: updatedProduct });
		} else {
			res.status(404).send({ message: 'Product Not Found' });
		}
	})
);

productRouter.delete(
	'/:id',
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const product = await Product.findById(req.params.id);
		if (product) {
			const deleteProduct = await product.remove();
			res.send({ message: 'Product Deleted', product: deleteProduct });
		} else {
			res.status(404).send({ message: 'Product Not Found' });
		}
	})
);

productRouter.put(
	'/existencia/:id',
	isAuth,
	isSellerOrAdmin,
	expressAsyncHandler(async (req, res) => {
		console.log('req.params.id:', req.params.id);
		console.log('req.body', req.body);
		const productId = req.params.id;
		//const product = await Product.findById(productId); ROUTER DE RONY-SHOES

		await Product.findByIdAndUpdate(
			req.params.id,
			{ sizesInStock: req.body.copiaStock },
			{ new: true },
			(err, doc) => {
				if (err) {
					console.log('Lookup error: ' + err);
					res.status(500).send('Error');
				} else if (doc) {
					res.status(200).send('cualquier vaina');
				} else {
					/** `doc` value will be null if no doc is not found for given id */
					res.status(404).send('Something is wrong');
				}
			}
		);
	})
);

export default productRouter;
