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
			$("#" + key).html("");	
			if($("#" + key)[0].tagName == 'DIV'){
				if(data[key].constructor === Array){
					var cal = data[key][0];
					var viewCal = "";
					for (var bind in cal) {
						viewCal+= '<div id="" class="uk-position-relative uk-background-secondary uk-light uk-padding-small">';
						viewCal+= cal[bind].Criterio;
						viewCal+= '</div>';
						viewCal+= '<div id="" class="uk-position-relative uk-background-secondary uk-light uk-padding-small">';
						viewCal+= cal[bind].Calificacion;
						viewCal+= '</div>';						
					}	
					$("#" + key).html(viewCal);							
				}
				else
					$("#" + key).html(data[key]);
			}
		   	else if($("#" + key)[0].tagName == 'IMG')
		   		$("#" + key).attr("src", 'http://' +  $("#" + key).attr('host') + "/docente/src/" + data[key]);	   	
		   	
	   	}catch(e){

	   	}
	}
}

function onCancelModal(){
	$(".data-edition-area").val("");
}
