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
	}

	/* function to delete a cookie with a certain index
	 *
	 * @param {string} name Name to be deleted ( index )
	 */

	CP.erase = function ( name ) {
		this.create( name, '', -1 );
	}

	//Assign cookie object as jquery method
	$.cookie = new Cookie();

} ( window.jQuery ) );