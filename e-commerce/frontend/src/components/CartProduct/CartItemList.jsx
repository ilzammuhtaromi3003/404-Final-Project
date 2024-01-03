import React from "react";
import ItemCard from "./cartItemCard";

const ItemList = ({ cartItems, onIncrement, onDecrement, onRemove }) => {
  return (
    <div>
      {cartItems.map((item) => (
        <ItemCard
          key={`${item.cart_item_id}-${item.quantity}`} 
          itemName={item.product.name}
          price={item.product.price}
          image={item.product.image}
          quantity={item.quantity}
          onIncrement={() => onIncrement(item)}
          onDecrement={() => onDecrement(item)}
          onRemove={() => onRemove(item)}
          isIncrementDisabled={item.quantity >= item.product.stock}
        />
      ))}
    </div>
  );
};

export default ItemList;
