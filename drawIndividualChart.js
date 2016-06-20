function drawChart(chart){
	var wrapper = ADL.XAPIWrapper;
	wrapper.changeConfig({	"endpoint" : 'https://cloud.scorm.com/tc/P19T692CLI/sandbox/',
						 	"user": '8hLCdL7Y01-1PUtt8s8',
						 	"password": 'Y2S6fM5JSbq5rhRk9fA'});

	var dash = new ADL.XAPIDashboard('#individualGraphContainer');
	var text = "";

	switch(chart){
		case "avgScore":
			drawAvgScoreChart(dash);
			text = "Total Average Score";
			break;
		case "avgScore1":
			drawAvgScoreLevel(dash,1);
			text = "Level 1 Average Score";
			break;
		case "avgScore2":
			drawAvgScoreLevel(dash,2);
			text = "Level 2 Average Score";
			break;
		case "avgScore3":
			drawAvgScoreLevel(dash,3);
			text = "Level 3 Average Score";
			break;
		case "nlogs":
			drawNlogsChart(dash);
			text = "Number of User Logins";
			break;
		case "attempts":
			drawAttemptsChart(dash);
			text = "Total Attempts";
			break;
		case "attempts1":
			drawAttemptsLevel(dash, 1);
			text = "Level 1 Attempts";
			break;
		case "attempts2":
			drawAttemptsLevel(dash, 2);
			text = "Level 2 Attempts";
			break;
		case "attempts3":
			drawAttemptsLevel(dash, 3);
			text = "Level 3 Attempts";
			break;

	}

	document.getElementById("title").innerHTML = text;
}

function drawAvgScoreChart(dash){
	var d = new Date(Date.now());
	var from = new Date(dateToTimestamp(document.getElementById("from").value));
	var to = new Date(dateToTimestamp(document.getElementById("to").value));

	if(d.getDate() == to.getDate() && d.getMonth() == to.getMonth() && d.getFullYear() == to.getFullYear()){
		to = new Date(Date.now());
	}
	var query = {'since': from.toISOString(), 'until': to.toISOString()};


	dash.fetchAllStatements(query, avgScoreDoneCallback);
	function avgScoreDoneCallback(){
		var chart = dash.createBarChart({
			process: function(data, event, opts){
				data.where("verb.id = 'http://adlnet.gov/expapi/verbs/passed' or verb.id = 'http://adlnet.gov/expapi/verbs/failed'").orderBy("actor.mbox");
				data.groupBy('actor.mbox').average('result.score.scaled').select('group as in, average as out').exec(opts.cb);

			},
			customize: function(chart){
				chart.xAxis.rotateLabels(15);
		            chart.xAxis.tickFormat(function(d){ return /[^\/]+$/.exec(d)[0].substring(7); });
		            chart.xAxis.axisLabel("User");
		            chart.forceY([0,1]);
		            chart.yAxis.axisLabel("Average Score (0-1)");
			}
		});
		chart.draw();
	}
}

function drawAvgScoreLevel(dash, level){
	var d = new Date(Date.now());
	var from = new Date(dateToTimestamp(document.getElementById("from").value));
	var to = new Date(dateToTimestamp(document.getElementById("to").value));

	if(d.getDate() == to.getDate() && d.getMonth() == to.getMonth() && d.getFullYear() == to.getFullYear()){
		to = new Date(Date.now());
	}
	var query = {'since': from.toISOString(), 'until': to.toISOString()};
	dash.fetchAllStatements(query, avgScoreDoneCallback);
	function avgScoreDoneCallback(){
		var chart = dash.createBarChart({
			process: function(data, event, opts){
				data.where("(verb.id = 'http://adlnet.gov/expapi/verbs/passed' or verb.id = 'http://adlnet.gov/expapi/verbs/failed') and object.id = 'https://curatr3.com/define/type/level"+level+"'").orderBy("actor.mbox");
				data.groupBy('actor.mbox').average('result.score.scaled').select('group as in, average as out').exec(opts.cb);

			},
			customize: function(chart){
				chart.xAxis.rotateLabels(15);
		            chart.xAxis.tickFormat(function(d){ return /[^\/]+$/.exec(d)[0].substring(7); });
		            chart.xAxis.axisLabel("User");
		            chart.forceY([0,1]);
		            chart.yAxis.axisLabel("Average Score Level "+ level +" (0-1)");
			}
		});
		chart.draw();
	}
}

function drawNlogsChart(dash){
	var d = new Date(Date.now());
	var from = new Date(dateToTimestamp(document.getElementById("from").value));
	var to = new Date(dateToTimestamp(document.getElementById("to").value));

	if(d.getDate() == to.getDate() && d.getMonth() == to.getMonth() && d.getFullYear() == to.getFullYear()){
		to = new Date(Date.now());
	}
	var query = {'since': from.toISOString(), 'until': to.toISOString()};
	dash.fetchAllStatements(query, nLogsDoneCallback);

	function nLogsDoneCallback(){
		var chart = dash.createBarChart({
			process: function(data, event, opts){
				data.where("verb.id = 'http://adlnet.gov/expapi/verbs/loggedin'").orderBy('actor.mbox');
				data.groupBy('actor.mbox').count().select('group as in, count as out').exec(opts.cb);

			},
			customize: function(chart){
				chart.xAxis.rotateLabels(15);
		            chart.xAxis.tickFormat(function(d){ return /[^\/]+$/.exec(d)[0].substring(7); });
		            chart.xAxis.axisLabel("User");
		            chart.yAxis.axisLabel("Number of Logins");
			}
		});
		chart.draw();
	}
}

function drawAttemptsChart(dash){
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
			process: function(data, event, opts){
				data.where("verb.id = 'http://adlnet.gov/expapi/verbs/passed' or verb.id = 'http://adlnet.gov/expapi/verbs/failed'").orderBy('actor.mbox');
				data.groupBy('actor.mbox').count().select('group as in, count as out').exec(opts.cb);

			},
			customize: function(chart){
				chart.xAxis.rotateLabels(15);
		            chart.xAxis.tickFormat(function(d){ return /[^\/]+$/.exec(d)[0].substring(7); });
		            chart.xAxis.axisLabel("User");
		            chart.yAxis.axisLabel("Total Levels Attempted");
			}
		});
		chart.draw();
	}
}

function drawAttemptsLevel(dash, level){
	var d = new Date(Date.now());
	var from = new Date(dateToTimestamp(document.getElementById("from").value));
	var to = new Date(dateToTimestamp(document.getElementById("to").value));

	if(d.getDate() == to.getDate() && d.getMonth() == to.getMonth() && d.getFullYear() == to.getFullYear()){
		to = new Date(Date.now());
	}
	var query = {'since': from.toISOString(), 'until': to.toISOString()};
	dash.fetchAllStatements(query, attemptsLevelDoneCallback);

	function attemptsLevelDoneCallback(){
		var chart = dash.createBarChart({
			process: function(data, event, opts){
				data.where("(verb.id = 'http://adlnet.gov/expapi/verbs/passed' or verb.id = 'http://adlnet.gov/expapi/verbs/failed') and object.id = 'https://curatr3.com/define/type/level"+level+"'").orderBy('actor.mbox');
				data.groupBy('actor.mbox').count().select('group as in, count as out').exec(opts.cb);

			},
			customize: function(chart){
				chart.xAxis.rotateLabels(15);
		            chart.xAxis.tickFormat(function(d){ return /[^\/]+$/.exec(d)[0].substring(7); });
		            chart.xAxis.axisLabel("User");
		            chart.yAxis.axisLabel("Level " + level +" Attempts");
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