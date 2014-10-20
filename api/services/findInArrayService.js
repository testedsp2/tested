module.exports = {
	findInArray : function( arry, param, value ){
	//This function return the index of a param in a value
		for (var i = 0, len = arry.length; i<len; i++) {
			if (param == "") {
				if ( arry[i] == value) return i;
			} else {
				if (param in arry[i] && arry[i][param] == value) return i;
			}
		}
		return false;
	}
}