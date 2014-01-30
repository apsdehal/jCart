( function ( $ ) {

	/*@class Cookie
	 *
	 *Represents the class ot be used to interact with Javascript Cookies
	 *@constructor
	 */

	function Cookie () {
		//constructor
	};

	var CP = Cookie.prototype;

	/* function to create a cookie
	 *
	 * @param {string} name Name to be assigned to the key of cookie
	 * @param {string} value Value to be assigned to cookie
	 * @param {object} options Object to be passed with extra value of duration (value to be given in days), path, secure
	 *				   For e.g. {duration: 4, path: '/', domain: 'github.com', secure: ''} Defaults are {duration: '', path:'/',domain: '', secure:''}
	 */

	CP.create = function ( name, value, options ) {
		var expires, cookieString;

		/*You can set defaults by assigning an object to $.cookie.defaults
		this will be overridden by options passed in create function */
		options = $.extend( {}, this.defaults, options );

		if ( options.duration ) {
			var date = new Date();

			//Default duration is in day, Converting them to secondsx`
			date.setTime( date.getTime() + ( options.duration * 24 * 60 * 60 * 1000 ) );
			expires = '; expires=' + date.toGMTString();
		} else {
			expires = '';
		}

		//Create a string with all the data

		cookieString  = escape( name ) + '=' + escape( value ) + expires;
		cookieString .= options.path ? '; path=' + options.path : '';
		cookieString .= options.domain ? '; domain=' + options.domain : '';
		cookieString .= options.secure ? '; secure=' + options.secure : '';

		//Save cookie
		document.cookie = cookieString;
	}

	/* function to find a cookie with a certain index
	 *
	 * @param {string} name Name to be found ( index )
	 * @return {string|null} Value stored in cookie if found
	 */

	CP.get = function ( name ) {
		var nameEq = escape( name ) + '=';
		var slices = document.cookie.split(';');//Split string on the bases of ;

		for ( var i = 0; i < slices.length; i++ ) {
			var slice = slices[i];
			//Get single slice which will contain different parameter
			while ( slice.charAt(0) === ' ' ) slice = slice.substring( 1, slice.length );
			//If its name of slice then return it
			if ( slice.indexOf( nameEQ ) === 0 ) return unescape( slice.substring( nameEq.length, slice.length ) );
		}

		return null;
	};

	/* function to delete a cookie with a certain index
	 *
	 * @param {string} name Name to be deleted ( index )
	 */

	CP.erase = function ( name ) {
		this.create( name, '', -1 );
	};


	//Assign cookie object as jquery method
	$.cookie = new Cookie();

	//Set defaults for the cart
	$.cookie.defaults = {path: '/'};


	/* @class Cart
	 *
	 * Represents class to be used as cart
	 * @constructor
	 */

	function Cart(){
		//Constructor
		var proto = this.prototype; //Assign prototype
		proto.cookieName = 'cart';
		proto.index = 0;

		//Set a handle to read and create cookies
		proto.cookieHandle = {read:null, create:null};
		proto.cookieHandle.read = $.cookie.get;
		proto.cookieHandle.create = $.cookie.create;

	};

	//Assign Cart class's prototype to a variable for easy use
	var SCP = Cart.prototype;

	/* function to get current orders in array forms
	 *
	 * @return {array} orders Array containing current orders' details with
	 * quantity nad id
	 */

	SCP.get = function () {
		//Parse the JSON string to array
		var orders = JSON.parse( this.cookieHandle.read( this.cookieName ) );

		if ( orders == null || orders == undefined || orders== "" ){
			return null;
		} else {
			return orders;
		}
	};

	/* function to set cookie from array
	 *
	 * @param {array} orders The array to be stored in JSON form to be stored
	 * in Javascript cookies
	 */

	SCP.setArrayCookie = function ( orders ) {
		var orderJSONString = JSON.stringify( orders );

		this.cookieHandle.create( this.cookieName, orderJSONString );
	};

	/* function to add a certain count of item to current quantity if it
	 * exists otherwise it's created
	 * @param {int} orderId Id of the item to be added
	 * @param {int} count Count of the item to be added (must be > 0)
	 */

	SCP.set = function ( orderId, count ) {
		count <= 0 ? return;

		var orders = this.get();
			idAlready = false,
			i = 0,
			current = null;

		if ( orders == null || orders == undefined ){
			orders = [];
		}

		for ( i = 0; i<orders.length; i++ ) {
			current = orders[i];
			if ( current.id == orderId ) {
				idAlready = true;
				current.quantity += count;
				orders[i] = current;
				break;
			}
		}

		if( !idAlready ) {
			//Item is not already added Create a new object and add it to array
			current = new Object();
			current.id = orderId;
			current.count = count;
			orders[orders.length] = current;
		}

		this.setArrayCookie( orders );

	};

	/* function to get total no. of items in the cart
	 *
	 * @return {int} No. of items
	 */

	SCP.total = function () {
		var orders = this.get();
		if ( orders == null ){
			return 0;
		} else {
			return orders.length();
		}
	};

	/* function to remove a certain count from an item's quantity
	 *
	 * @param {int} orderId id of item in consideration
	 * @param {int} count Count to be removed from quantity (by default is 1)
	 */


	SCP.remove = function ( orderId, count) {
		//if count has not been passed set default count to 1
		count = count ? count : 1;

		var orders = this.get(),
			i = 0,
			current = null;

		if ( orders == null || orders == undefined ) {
			return;
		} else {
			for ( i = 0; i < orders.length; i++ ) {
				current = orders[i];
				if( orderId == current.id ) {
					current.quantity -= count;
					if ( current.quantity <=0 ) {
						orders.splice( i, 1);//Use array splice method to remove a whole index
						i--; //Just in case something breaks
					} else {
						orders[i] = current;
					}

					break;
				}
			}
		}

		this.setArrayCookie( orders );

	};

	/* function to remove all the data of a particular item
	 *
	 * @param {int} orderId Id of the item to be deleted
	 */

	SCP.removeItem = function ( orderId ) {
		//Check orderid
		if ( orderId == null || orderId == undefined )
			return;

		var orders = this.get(),
			i = 0,
			current = null;

		if ( orders == null || orders == undefined ) {
			return;
		} else {
			for ( i = 0; i < orders.length; i++ ) {
				current = orders[i];
				if( orderId == current.id ) {
					orders.splice( i, 1);
					//Use splice method of arrays to remove curent index
					break;
				}
			}
		}


		this.setArrayCookie( orders );

	};

	/* function to change the quantity of an item directly to some no.
	 *
	 * @param {int} orderId Id of item under consideration
	 * @param {int} count Integer to which the quantity has to be changed
	 */

	SCP.change = function ( orderId, count ){
		//Check count validity
		if( count == null || count == undefined )
			return;
		//If count has been passed as 0 delete that object
		if( count == 0 ){
			this.removeItem( orderId );
			return;
		}

		var orders = this.get(),
			i = 0,
			current = null;

		//Check if orders are there
		if ( orders == null || orders == undefined ) {
			return;
		} else {
			for ( i = 0; i < orders.length; i++ ) {
				current = orders[i];
				if( orderId == current.id ) {
					current.quantity = count;
					orders[i] = current;
					break;
				}
			}
		}

		this.setArrayCookie( orders );

	};

	/* function to clear all the data stored in cookie
	 */

	SCP.clear = function () {
		// Use handle to cookie to create it
		this.cookieHandle.create( this.cookieName, JSON.stringify([]) );
	};

	/* function to remove the cookie from browser
	 */

	SCP.removeCookie = function () {
		$.cookie.erase( this.cookieName );
	};

	//Assign the class as jQuery method
	$.cart = new Cart();

} ( window.jQuery ) );