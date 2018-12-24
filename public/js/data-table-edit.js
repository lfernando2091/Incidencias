$(document).on('click', '.data-edition', onTableDataEdit);

$(document).on('click', '.data-view', onTableDataView);

function onTableDataEdit(e)
{
	var data = JSON.parse($(e.currentTarget).attr( "data" ));
	for (var key in data) 
	   $("#" + key).val(data[key]);
}

function onTableDataView(e)
{
	var data = JSON.parse($(e.currentTarget).attr( "data" ));
	for (var key in data) {
		try{
			if($("#" + key)[0].tagName == 'DIV')
		   		$("#" + key).html(data[key]);
	   	}catch(e){

	   	}
	}
}

function onCancelModal(){
	$(".data-edition-area").val("");
}
