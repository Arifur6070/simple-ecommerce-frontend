import { CartItem } from '../../components/cart-status/model/cart.model';

export class OrderItem {
    imageUrl: string;
    unitPrice: number;
    quantity: number;
    productId: string;

    constructor(cartItem: CartItem) {
        this.imageUrl = cartItem.imageUrl;
        this.quantity = cartItem.quantity;
        this.unitPrice = cartItem.unitPrice;
        this.productId = cartItem.id;
    }
}
