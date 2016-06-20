window.onload = loadPage;


function loadPage(){
	var today = new Date();
	var oneMonthAgo = new Date();

	var dd = today.getDate();
	var mm = today.getMonth()+1;
	var oma = mm-1;
	var yyyy = today.getFullYear();
	var yyyyoma = yyyy;

	if(oma == 0){
		oma = 12;
		yyyyoma = yyyy - 1;

	}

	if(dd<10){
		dd = '0' + dd;
	}
	if(mm<10){
		mm = '0' + mm;
	}
	if(oma<10){
		oma = '0' + oma;
	}

	today = yyyy + '-' + mm +'-' + dd;
	oneMonthAgo = yyyyoma + '-' + oma + '-' + dd;

	$('#to').attr('value', today);
	$('#from').attr('value', oneMonthAgo);

	drawChart("avgScore");
}