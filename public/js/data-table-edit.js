$(document).on('click', '.data-edition', onTableDataEdit);

$(document).on('click', '.data-view', onTableDataView);

function onTableDataEdit(e)
{
	var data = JSON.parse($(e.currentTarget).attr( "data" ));
	for (var key in data){
		try{
	   		$("#" + key).val(data[key]);
	   	}catch(e){

	   	}
	}
}

function onTableDataView(e)
{
	var data = JSON.parse($(e.currentTarget).attr( "data" ));
	for (var key in data) {
		try{
			if($("#" + key)[0].tagName == 'DIV')
		   		$("#" + key).html(data[key]);
		   	else if($("#" + key)[0].tagName == 'IMG')
		   		$("#" + key).attr("src","http://127.0.0.1:3000/docente/src/" + data[key]);	   	
	   	}catch(e){

	   	}
	}
}

function onCancelModal(){
	$(".data-edition-area").val("");
}
