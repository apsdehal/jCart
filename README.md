#Shopping Cart jQuery Plugin

Shopping Cart simplified

###About

Shopping Cart plugin has been created with essence to simplify the process of making shopping carts for the websites that need a proper interface for customers. With number of functions available, it all works as a breeze.
Code is heavily commented for easy understanding.

###Usage

Include the plugin as follows:-

```html
<script type="text/javascript" src="jquery.js"/>
<!-- Must include jQuery before including plugin -->
<script type="text/javascript" src="jquery.cart.js">
```

All the methods for the cart are available through `$.cart` variable.

There is an orderid defined for each item along with its quantity.

Functions available are as documentated below:

```javascript

$.cart.set( orderId, count );
//To set an order with quantity = count in the cart.
//Important: If item is already present this count will be added to current quantity

$.cart.get();
//Get an object containing orders with attributes id and count

$.cart.getJSON();
//Get a JSON string of the orders.

$.cart.total();
//Get total number of types of items in cart.

$.cart.totalQty();
//Get total nuber of items in cart.

/* For example:- If you have bought 2 Lays' and 1 Uncle Chipps
   $.cart.total() will be 2 and $.cart.totalQty() will be 3
*/

$.cart.remove( orderId, count );
//To remove a certain amount of count from item with id = orderId.

$.cart.removeItem ( orderId );
//To remove whole quantity of a particular item.

$.cart.clear();
//To clear the whole cart

$.cart.change( orderId, count );
//To change the quantity of the orderId to count.

$.cart.removeCookie();
//To remove the cookie in which all the data of cart is stored.
```

By default orders are stored in cookie named 'orders'.

You can override it by setting $.cookie.defaults.

$.cookie object is also available to play with cookies all over.

###License
MIT License

Copyright (c) 2014 Amanpreet Singh