// Create an instance of Notyf

function viewNotification(mensaje){
	//var notyf = new Notyf();
	setTimeout(function() {
		new Notyf({
		  delay:2000 
		}).confirm(mensaje);
	}, 500);
}

function viewAlert(mensaje){
	//var notyf = new Notyf();
	setTimeout(function() {
		new Notyf({
		  delay:2000
		}).alert(mensaje);
	}, 500);
}





