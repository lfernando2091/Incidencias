$(document).on('click', '.data-edition', onTableDataEdit);

function onTableDataEdit(e)
{
	var data = JSON.parse($(e.currentTarget).attr( "data" ));
	for (var key in data) 
	   $("#" + key).val(data[key]);
}