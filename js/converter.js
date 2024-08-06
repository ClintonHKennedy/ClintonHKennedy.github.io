var curList=['usd','eur','gbp','chf','cad','aud','sek','nok','dkk','aed','jpy','try','cny','sar','inr','myr',
								'rub','thb','sgd','hkd','azn','amd','afn','kwd','iqd','bhd','omr','qar','btc'];
function converter(elem) {
		var fcode = $("#fromSelect").val();
		var famount = reverse($("#famount").val());
		var tcode = $("#toSelect").val();
		var tamount = reverse($("#tamount").val());
		var usd = $("#usd1").text();
		var eur = $("#eur1").text();
		var bitcoin = parseFloat($("#bitcoin").text().replace(/,/g, ''));
		setCookie("converter", fcode + "|" + tcode);
		if (fcode != tcode){
				$("#converterArrow").addClass("sr-only");
				$(".loader").removeClass("sr-only");
				$.post('/converter', function(json) {
					var from = json[fcode];
					var to = json[tcode];
					if (fcode === "IRR") {
						from = eur;
					}
					if (tcode === "IRR") {
						to = eur;
					}
					if ($.inArray(fcode.toLowerCase(), curList) >-1) {
						if (fcode === "BTC") {
							from = parseFloat(eur)/(parseFloat(usd)*bitcoin);
						}
						else {
							from = parseFloat(eur)/parseFloat($("#"+fcode.toLowerCase()+"1").text());
						}
					}
					if ($.inArray(tcode.toLowerCase(), curList) >-1) {
						if (tcode === "BTC") {
							to = parseFloat(eur)/(parseFloat(usd)*bitcoin);
						}
						else {
							to = parseFloat(eur)/parseFloat($("#"+tcode.toLowerCase()+"1").text());
						}
					}
					if ($(elem).attr('id')!="tamount"){
						$("#tamount").val(roundRates(parseFloat(famount)*parseFloat(to)/parseFloat(from)));
					}
					else {
						$("#famount").val(roundRates(parseFloat(tamount)*parseFloat(from)/parseFloat(to)));
					}
				},'json')
				.always(function() {
					$(".loader").addClass("sr-only");
					$("#converterArrow").removeClass("sr-only");
				});
		} else {
			$("#tamount").val(famount);
		}
};

function roundRates(rate) {
	var rounded = 0;
	if(rate<=1){
		rounded = rate.toFixed(8);
	} else if(rate<=10){
		rounded = rate.toFixed(3);
	} else if(rate<=100){
		rounded = rate.toFixed(2);
	} else {
		rounded = rate.toFixed(0);
		if (rounded>=1000){
			var num = rounded;
			rounded = num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
		}
	}
	return rounded;
};

function reverse(s) {
	return s.replace(/\,/g , "");
};

function setCookie(cname, cvalue) {
		document.cookie = cname + "=" + cvalue;
}
