import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, maxLength: 25 },
		codigo: { type: String, unique: true, required: true },
		seller: { type: mongoose.Schema.Types.ObjectID, ref: 'User' },
		image: { type: String, required: true },
		cloudImage: { type: String, required: false },
		brand: { type: String, required: true },
		modelo: { type: String },
		category: { type: String, required: true },
		subcategory: { type: String },
		description: { type: String, required: true },
		costo: { type: Number },
		price: { type: Number, required: true },
		precioMayor: { type: Number, required: false },
		precioDescuento: { type: Number, required: false },
		precioEspecial: { type: Number, required: false },
		colores: [],
		genero: { type: String, required: false },
		tipo: { type: String, required: false },
		proveedor: { type: String },
		selectedItemStock: { type: Number },
		countInStock: { type: Number, required: true },
		sizesInStock: [],
		visible: { type: Boolean, default: true },
	},
	{
		timestamps: true,
	}
);
const Product = mongoose.model('Product', productSchema);

export default Product;
