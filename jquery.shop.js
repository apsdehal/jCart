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

			date.setTime( date.getTime() + ( options.duration * 24 * 60 * 60 * 1000 ) );
			expires = '; expires=' + date.toGMTString();
		} else {
			expires = '';
		}


		cookieString  = escape( name ) + '=' + escape( value ) + expires;
		cookieString .= options.path ? '; path=' + options.path : '';
		cookieString .= options.domain ? '; domain=' + options.domain : '';
		cookieString .= options.secure ? '; secure=' + options.secure : '';

		document.cookie = cookieString;
	}

	/* function to find a cookie with a certain index
	 *
	 * @param {string} name Name to be found ( index )
	 * @return {string|null} Value stored in cookie if found
	 */
	CP.get = function ( name ) {
		var nameEq = escape( name ) + '=';
		var slices = document.cookie.split(';');

		for ( var i = 0; i < slices.length; i++ ) {
			var slice = slices[i];
			while ( slice.charAt(0) === ' ' ) slice = slice.substring( 1, slice.length );
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
		var proto = this.prototype;
		proto.cookieName = 'cart';
		proto.index = 0;

		//Set a handle to read and create cookies
		proto.cookieHandle = {read:null, create:null};
		proto.cookieHandle.read = $.cookie.get;
		proto.cookieHandle.create = $.cookie.create;

	};

	var SCP = Cart.prototype;

	SCP.get = function () {
		var orders = $.parseJSON( this.cookieHandle.read( this.cookieName ) );

		if ( orders == null || orders == undefined || orders== "" ){
			return null;
		} else {
			return orders;
		}
	};

	SCP.setArrayCookie = function ( orders ) {
		var orderJSONString = $.toJSON( orders );

		this.cookieHandle.create( this.cookieName, orderJSONString );
	};

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
			current = new Object();
			current.id = orderId;
			current.count = count;
			orders[orders.length] = current;
		}

		this.setArrayCookie( orders );

	};

	SCP.total = function () {
		var orders = this.get();
		if ( orders == null ){
			return 0;
		} else {
			return orders.length();
		}
	};

	SCP.remove = function ( orderId, count) {
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
						orders.splice( i, 1);
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

	SCP.removeItem = function ( orderId ) {
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
					break;
				}
			}
		}


		this.setArrayCookie( orders );

	};

	SCP.change = function ( orderId, count ){
		if( count == null || count == undefined )
			return;
		if( count == 0 ){
			this.removeItem( orderId );
			return;
		}

		var orders = this.get(),
			i = 0,
			current = null;

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

	SCP.clear = function () {
		this.cookieHandle.create( this.cookieName, $.toJSON([]) );
	};

	SCP.removeCookie = function () {
		$.cookie.erase( this.cookieName );
	};

	$.cart = new Cart();

} ( window.jQuery ) );