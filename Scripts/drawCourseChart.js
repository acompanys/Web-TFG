function drawChart(chart){
	var wrapper = ADL.XAPIWrapper;
	wrapper.changeConfig({	"endpoint" : 'https://cloud.scorm.com/tc/P19T692CLI/sandbox/',
						 	"user": '8hLCdL7Y01-1PUtt8s8',
						 	"password": 'Y2S6fM5JSbq5rhRk9fA'});

	var dash = new ADL.XAPIDashboard('#individualGraphContainer');
	var text = "";

	switch(chart){
		case "avgCourseScore":
			drawCourseAvgScore(dash);
			text = "Average Score";
			break;
		case "attempts":
			drawCourseAttempts(dash);
			text = "Attempts";
			break;
		case "pass":
			drawPass(dash);
			text = "Students that Succeeded";
			break;
		case "fail":
			drawFail(dash);
			text = "Students that Failed";
			break;
		case "logins":
			drawLogins(dash);
			text = "Number of Logins over time";
			break;

	}

	document.getElementById("title").innerHTML = text;
}

function drawCourseAvgScore(dash){
	var d = new Date(Date.now());
	var from = new Date(dateToTimestamp(document.getElementById("from").value));
	var to = new Date(dateToTimestamp(document.getElementById("to").value));

	if(d.getDate() == to.getDate() && d.getMonth() == to.getMonth() && d.getFullYear() == to.getFullYear()){
		to = new Date(Date.now());
	}
	var query = {'since': from.toISOString(), 'until': to.toISOString()};
	dash.fetchAllStatements(query, courseAvgScoreDoneCallback);

	console.log(from.toISOString());

	function courseAvgScoreDoneCallback(){
		var chart = dash.createBarChart({
			container: '#courseGraphContainer',
			process: function(data, event, opts){
				data.where("verb.id = 'http://adlnet.gov/expapi/verbs/passed' or verb.id = 'http://adlnet.gov/expapi/verbs/failed'").orderBy('object.id');
				data.groupBy('object.id').average('result.score.raw').select('group as in, average as out').exec(opts.cb);

			},
			customize: function(chart){
				chart.xAxis.rotateLabels(15);
		            chart.xAxis.tickFormat(function(d){ return /[^\/]+$/.exec(d)[0]; });
		            chart.xAxis.axisLabel("Game Level");
		            chart.forceY([0,100])
		            chart.yAxis.axisLabel("Average Score");
			}
		});
		chart.draw();
	}
}

function drawCourseAttempts(dash){
	var d = new Date(Date.now());
	var from = new Date(dateToTimestamp(document.getElementById("from").value));
	var to = new Date(dateToTimestamp(document.getElementById("to").value));

	if(d.getDate() == to.getDate() && d.getMonth() == to.getMonth() && d.getFullYear() == to.getFullYear()){
		to = new Date(Date.now());
	}
	var query = {'since': from.toISOString(), 'until': to.toISOString()};
	dash.fetchAllStatements(query, attemptsDoneCallback);

	function attemptsDoneCallback(){
		var chart = dash.createBarChart({
			container: '#courseGraphContainer',
			process: function(data, event, opts){
				data.where("verb.id = 'http://adlnet.gov/expapi/verbs/attempted'").orderBy('object.id');
				data.groupBy('object.id').count().select('group as in, count as out').exec(opts.cb);

			},
			customize: function(chart){
				chart.xAxis.rotateLabels(15);
		            chart.xAxis.tickFormat(function(d){ return /[^\/]+$/.exec(d)[0]; });
		            chart.xAxis.axisLabel("Game Level");
		            chart.yAxis.axisLabel("Number of attempts");
			}
		});
		chart.draw();
	}
}

function drawPass(dash){
	var d = new Date(Date.now());
	var from = new Date(dateToTimestamp(document.getElementById("from").value));
	var to = new Date(dateToTimestamp(document.getElementById("to").value));

	if(d.getDate() == to.getDate() && d.getMonth() == to.getMonth() && d.getFullYear() == to.getFullYear()){
		to = new Date(Date.now());
	}
	var query = {'since': from.toISOString(), 'until': to.toISOString()};
	dash.fetchAllStatements(query, passDoneCallback);

	function passDoneCallback(){
		var chart = dash.createBarChart({
			container: '#courseGraphContainer',
			process: function(data, event, opts){
				data.where("verb.id = 'http://adlnet.gov/expapi/verbs/passed'").orderBy('object.id');
				data.groupBy('object.id').count().select('group as in, count as out').exec(opts.cb);

			},
			customize: function(chart){
				chart.xAxis.rotateLabels(15);
		            chart.xAxis.tickFormat(function(d){ return /[^\/]+$/.exec(d)[0]; });
		            chart.xAxis.axisLabel("Game Level");
		            chart.yAxis.axisLabel("Number of Passing");
			}
		});
		chart.draw();
	}
}

function drawFail(dash){
	var d = new Date(Date.now());
	var from = new Date(dateToTimestamp(document.getElementById("from").value));
	var to = new Date(dateToTimestamp(document.getElementById("to").value));

	if(d.getDate() == to.getDate() && d.getMonth() == to.getMonth() && d.getFullYear() == to.getFullYear()){
		to = new Date(Date.now());
	}
	var query = {'since': from.toISOString(), 'until': to.toISOString()};
	dash.fetchAllStatements(query, failDoneCallback);

	function failDoneCallback(){
		var chart = dash.createBarChart({
			container: '#courseGraphContainer',
			process: function(data, event, opts){
				data.where("verb.id = 'http://adlnet.gov/expapi/verbs/failed'").orderBy('object.id');
				data.groupBy('object.id').count().select('group as in, count as out').exec(opts.cb);

			},
			customize: function(chart){
				chart.xAxis.rotateLabels(15);
		            chart.xAxis.tickFormat(function(d){ return /[^\/]+$/.exec(d)[0]; });
		            chart.xAxis.axisLabel("Game Level");
		            chart.yAxis.axisLabel("Number of Failing");
			}
		});
		chart.draw();
	}
}

function drawLogins(dash){
	var d = new Date(Date.now());
	var from = new Date(dateToTimestamp(document.getElementById("from").value));
	var to = new Date(dateToTimestamp(document.getElementById("to").value));

	if(d.getDate() == to.getDate() && d.getMonth() == to.getMonth() && d.getFullYear() == to.getFullYear()){
		to = new Date(Date.now());
	}
	var query = {'since': from.toISOString(), 'until': to.toISOString()};
	dash.fetchAllStatements(query, loginsDoneCallback);

	function loginsDoneCallback(){
		var chart = dash.createBarChart({
			container: '#courseGraphContainer',
			process: function(data, event, opts){
				data.where("verb.id = 'http://adlnet.gov/expapi/verbs/loggedin'").orderBy('timestamp');
				data.groupBy('timestamp',[from.toISOString(), to.toISOString(), 1000*60*60*24*1]).count().select('group as in, count as out').exec(opts.cb);

			},
			customize: function(chart){
				chart.xAxis.rotateLabels(60);
		            chart.xAxis.tickFormat(function(d){ return /[^\/]+$/.exec(d)[0].substring(0,10); });
		            chart.xAxis.axisLabel("Date");
		            chart.yAxis.axisLabel("Number of Logins");
			}
		});
		chart.draw();
	}
}

function dateToTimestamp(date){
	//Converts date to timestamp format
	date = date.split("-");
	var newDate = date[1] + "/" + date[2]  + "/" + date[0];
	return new Date(newDate).getTime();
}

function readjustDates(){
	var value = document.getElementById("select").value;
	drawChart(value);
}