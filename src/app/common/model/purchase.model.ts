import { Address } from '../model/address.model';
import { Customer } from '../model/customer.model';
import { Order } from '../model/order.model';
import { OrderItem } from '../model/order-item.model';

export class Purchase {
    customer: Customer;
    shippingAddress: Address;
    billingAddress: Address;
    order: Order;
    orderItems: OrderItem[];
}
