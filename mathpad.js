function va_en_bas() {
	var obj = document.body;
	obj.scrollTop = obj.scrollHeight;
}

var maxTrou = 0;
var maxSlide = 0;

$(document).ready(
function(){





$couleurFondPara = "#b8c8ec";
$couleurTextePara = "#ffffff";
$couleurCorrection = "#e5ecfd";

$("body").after("<div class='clicGauche' onclick='retourne()'></div>");
$("body").after("<div class='clicDroit' onclick='avance()'></div>");

$("al").css("list-style-type", "lower-latin;");

$("titre").css("border-radius","7px");
$("titre").css("color",$couleurTextePara);
$("titre").css("width", "100%");
$("titre").css("font-size", "180%");
$("titre").css("font-weight", "bold");
$("titre").css("text-align", "center");
$("titre").css("padding-bottom", "10px");
$("titre").css("padding-top", "10px");
$("titre").css("background-color", $couleurFondPara);
$("titre").css("margin-bottom", "20px");
$("titre").css("box-shadow", "4px 4px 5px #c0c0c0");
$("titre").css("width", "100%");


$("cadre").css("border-radius","7px");
$("cadre").css("color",$couleurTextePara);
$("cadre").css("width", "100%");
$("cadre").css("background-color", $couleurFondPara);
$("cadre").css("box-shadow", "4px 4px 5px #c0c0c0");
$("cadre").css("padding","2px");



$("exercice").each(function(i){
j=i+1;
$(this).css("padding","2px");
$(this).css("padding-left","7px");
$(this).css("background-color",$couleurFondPara);
$(this).css("box-shadow","4px 4px 5px #c0c0c0");
$(this).css("border-radius","7px");
$(this).prepend("<span style='font-weight:bold;'>Exercice " + j+"</span>");});

$("exemple").each(function(i){
j=i+1;
$(this).css("padding","2px");
$(this).css("padding-left","7px");
$(this).css("background-color",$couleurFondPara);
$(this).css("box-shadow","4px 4px 5px #c0c0c0");
$(this).css("border-radius","7px");
$(this).prepend("<span style='font-weight:bold;'>Exemple " + j+"</span>");});

$("def").each(function(i){
j=i+1;           
$(this).css("border","solid 1px "+$couleurFondPara);
$(this).css("background-color",$couleurFondPara);
$(this).css("padding","5px");
$(this).css("box-shadow","4px 4px 5px #c0c0c0");
$(this).css("border-radius","7px");
$(this).prepend("<span style='font-weight:bold;'>Définition " + j+"</span>");});

$("prop").each(function(i){
j=i+1;
$(this).css("background-color",$couleurFondPara);           
$(this).css("border","solid 1px "+$couleurFondPara);
$(this).css("padding","5px");
$(this).css("box-shadow","4px 4px 5px #c0c0c0");
$(this).css("color","#000000");
$(this).css("border-radius","7px");
$(this).prepend("<span style='font-weight:bold;'>Propriété " + j+"</span>");});

$("theo").each(function(i){
j=i+1;
$(this).css("background-color",$couleurFondPara);           
$(this).css("border","solid 1px "+$couleurFondPara);
$(this).css("padding","5px");
$(this).css("box-shadow","4px 4px 5px #c0c0c0");
$(this).css("border-radius","7px");
$(this).prepend("<span style='font-weight:bold;'>Théorème " + j+"</span>");});

$("lemme").each(function(i){
j=i+1;
$(this).css("background-color",$couleurFondPara);           
$(this).css("border","solid 1px "+$couleurFondPara);
$(this).css("padding","5px");
$(this).css("box-shadow","4px 4px 5px #c0c0c0");
$(this).css("border-radius","7px");
$(this).prepend("<span style='font-weight:bold;'>Lemme " + j+"</span>");});

$("rem").each(function(i){
j=i+1;
$(this).css("background-color",$couleurFondPara);
$(this).css("padding","2px");
$(this).css("padding-left","7px");
$(this).css("box-shadow","4px 4px 5px #c0c0c0");
$(this).css("border-radius","7px");
$(this).prepend("<span style='font-weight:bold;'>Remarque " + j+"</span>");});

$("slide").each(function(i){
	maxSlide = i;
	}
);

$("slide").each(function(i){
	
	var k=i+1;           
	$(this).attr('id', 'slide_'+k);
	var lienD = 1;
	var lienG = -1;
	if ( i==maxSlide ) { lienD = 0; }
	if ( i==0 ) { lienG = 0; }
	
	$(this).prepend("<div style='position:fixed;top:0px;height:80px;right:0px;width:50px;cursor:pointer;z-index:2000;' onclick='slide("+k+","+lienD+")'></div>");
	$(this).prepend("<div style='position:fixed;top:0px;height:80px;leftt:0px;width:50px;cursor:pointer;z-index:2000;' onclick='slide("+k+","+lienG+")'></div>");
	if ( i == 0 ){ $(this).css("display","block"); }
	
	}
);



$("algo").each(function(i) {

	var contenu = $(this).html();
	$(this).empty();
	
	contenu = "<textarea id='textareaCode"+i+"' style='display:block;width:350px;height:350px;border:solid 1px black;padding:5px;text-align:left;margin:auto;margin-bottom:10px;resize: none;'>"+contenu+"</textarea>";	
	contenu += "<button onclick='algo("+i+")' style='display:block;margin:auto;'>Exécuter</button>";
	contenu += "<div id='resultats"+i+"' style='width:350px;height:350px;background-color:#f8f8f8;border:solid 1px black;text-align:left;padding:5px;margin:auto;margin-top:10px;'></div>";

	$(this).prepend( contenu );
	
	
	}
);

$("code").each(function(i) {
	
	var css = $(this).find("css").html();
	if ( css == undefined ) { css = ""}
	
	var st = "\n<style>\n"+css+"\n</style>\n";
	
	var contenu = $(this).find("page").html();
	if ( contenu == undefined ) { contenu = ""}
	
	$(this).empty();
	
	var codehtml = "<!DOCTYPE html>\n<html>\n<head>\n<meta charset=\"utf-8\" />\n"+st+"\n</head>\n<body>\n"+contenu+"\n</body>\n</html>";
	
	contenu = "<div style='width:100%;text-align:center;'><textarea id='textareaHtml"+i+"' class='input'>"+codehtml+"</textarea></div>";	
	
	contenu += "<div class='sortieHtml'><iframe id='sortieHtml"+i+"' class='output'></iframe></div>";
	
	contenu += "<script>$('#textareaHtml"+i+"').focus(function () { var $this = $(this);$this.keyup(function () {iframe = document.getElementById('sortieHtml"+i+"');iframe.contentWindow.document.open();iframe.html = \"\";iframe.contentWindow.document.write($this.val());iframe.contentWindow.document.close();});});</script>";
	
	$(this).prepend( contenu );
	
	
	}
);




$("python").each(function(i) {
	
	console.log("python");
	
	var codePython = $(this).html();
	$(this).empty();
	
	var contenu = "<div style='width:100%;text-align:center;'><form><textarea id='yourcode"+i+"' class='inputPython'>"+codePython+"</textarea><br />";
	contenu +=  "<button type='button' onclick='runit("+i+")'>Run</button></form>";
	contenu += "<div id='mycanvas"+i+"' class='tortue'></div><pre id='output"+i+"' class='outputPython'></pre></div>"; 
	contenu += "<script>function outf"+i+"(text) {var mypre = document.getElementById(\"output"+i+"\");mypre.innerHTML = mypre.innerHTML + text;}</script>";
	
	
	$(this).prepend( contenu );
	
	
	}
);




$("paragraphe").each(function(i){
	j=i+1;
	
	$(this).nextUntil("paragraphe","subparagraphe").each(function(k){
				var l = k+1;
				$(this).prepend("<span style='font-weight:bold;color:"+$couleurTextePara+";background-color:"+$couleurFondPara+";border-radius:7px;padding:3px;'>"+j+"."+ l +" - </span>");
				});
	$(this).nextUntil("paragraphe","subparagraphe").css("background-color",$couleurFondPara);
	$(this).nextUntil("paragraphe","subparagraphe").css("color",$couleurTextePara);
	$(this).nextUntil("paragraphe","subparagraphe").css("padding","3px");
	$(this).nextUntil("paragraphe","subparagraphe").css("border-radius","7px");
	$(this).nextUntil("paragraphe","subparagraphe").css("font-weight","bold");
	$(this).nextUntil("paragraphe","subparagraphe").css("box-shadow","4px 4px 5px #c0c0c0");
	
	
	$(this).css("background-color",$couleurFondPara);
	$(this).css("color",$couleurTextePara);
	$(this).css("padding","3px");
	$(this).css("border-radius","7px");
	$(this).css("box-shadow","4px 4px 5px #c0c0c0");
	$(this).css("font-weight","bold");
	$(this).prepend("<span style='font-weight:bold;color:"+$couleurTextePara+";background-color:"+$couleurFondPara+";border-radius:7px;padding:3px;'>"+j+" - </span>");
	});






$("pause").each(function(i){
	var cont = $(this).html();
	$(this).html('');
	$(this).prepend("<div id='trou_"+i+"' class='trou'>"+ cont +"</div>");
	maxTrou = i;
	});
	
$("correction").each(function(i){
	var cont = $(this).html();
	$(this).html('');
	$(this).prepend("<button onclick='corrige("+i+")'>Correction</button><div id='correction_"+i+"' class='correction'><div class='intCorr'>"+ cont +"</div><button style='display:block;' onclick='decorrige("+i+")'>✕</button></div>");
	});

$(".intCorr").css("background-color",$couleurCorrection);


$("rouge").css("color","#ff0000");
$("bleu").css("color","#2e2efe");
$("vert").css("color","#31b404");

$("centre").css("text-align","center");
$("centre").css("display","block");

$("gras").css("font-weight","bold");
$("italic").css("font-style","italic");
$("souligne").css("text-decoration","underline");



$("esp").each(function (i) {
	var longueur = parseInt( $(this).html() );
	$(this).html("");
	if ( !longueur ) { longueur = 1; }
	
	for ( var j=1; j<=longueur;j++) {
		$(this).prepend("&nbsp;");
	}
}
);

$( "depasse" ).addClass( "depasse" );
$( "legende" ).addClass( "legende" );

$("tabvar").each(function (i) {
	var nb = i+1;
	var nomTab = 'tabVar'+i;
	
	var nomTabJQ = "#"+nomTab;
	var contenuTab = "<table class='var' id='"+nomTab+"'>";
	
	
	var abs = $(this).children("abs");
	var classe,contenu;
	var casier = abs.children("casier");
	var nbCases = casier.length;
	
	
	
	contenuTab += "<tr>";
	
	for (var j=1;j<=nbCases;j++) {
		if ( j == 1) { classe = "droite"; } else { classe = "bas"; }
		contenu = $(this).children("abs").children("casier:nth-child("+j+")").html();
		
		contenuTab += "<td class='"+classe+"'>"+contenu+"</td>";
	}
	contenuTab += "</tr>";
	
	var signe = $(this).children("signe");
	
	
	if (signe.length>0) {
		for (var nbSigne=2;nbSigne<=signe.length+1;nbSigne++) {
			contenuTab += "<tr>";
			
			for (var j=1;j<=nbCases;j++) {
				if ( j == 1) { classe = "droite"; } else { classe = "bas"; }
				contenu = $(this).children("signe:nth-child("+nbSigne+")").children("casier:nth-child("+j+")").html();
				if ( contenu == "0") { classe="verticale";contenu = "0"; }
				if ( contenu == "interdit") { classe="interdit";contenu = ""; }
				if ( contenu == "barre") { classe="verticale";contenu = ""; }
		
				contenuTab += "<td class='"+classe+"'>"+contenu+"</td>";
			}
			contenuTab += "</tr>";
		}
	}
	
	var varHaut = $(this).children("varHaut");
	
	if (varHaut.length>0) {
	
		contenuTab += "<tr>";
	
		for (var j=1;j<=nbCases;j++) {
			if ( j == 1) { classe = "droite_seule"; } else { classe = "vh"; }
			contenu = $(this).children("varHaut").children("casier:nth-child("+j+")").html();
		
			if ( contenu == "interdit") { classe="interdit_sf";contenu = ""; }
		
			contenuTab += "<td class='"+classe+"'>"+contenu+"</td>";
		}
		contenuTab += "</tr>";
	}
	
	
	
	var varCentre = $(this).children("varCentre");
	
	if (varCentre.length>0) {
		contenuTab += "<tr>";
	
		for (var j=1;j<=nbCases;j++) {
			if ( j == 1) { classe = "droite_seule"; } else { classe = ""; }
			contenu = $(this).children("varCentre").children("casier:nth-child("+j+")").html();
		
			if ( contenu == "interdit") { classe="interdit_sf";contenu = ""; }
			if ( contenu == "croissante") { classe="croissante";contenu = "";}
			if ( contenu == "décroissante") { classe="decroissante";contenu = "";}
		
			contenuTab += "<td class='"+classe+"'>"+contenu+"</td>";
		}
		contenuTab += "</tr>";
	}
	
	
	var varBas = $(this).children("varBas");
	
	if (varBas.length>0) {	
		contenuTab += "<tr>";
		
		for (var j=1;j<=nbCases;j++) {
			if ( j == 1) { classe = "droite_seule"; } else { classe = ""; }
			contenu = $(this).children("varBas").children("casier:nth-child("+j+")").html();
			
			if ( contenu == "interdit") { classe="interdit";contenu = ""; }
			
			
			contenuTab += "<td class='"+classe+"'>"+contenu+"</td>";
		}
		contenuTab += "</tr>";
	}
	
	
	
	contenuTab += "</table>";
	
	
	
	$(this).after(contenuTab);
	contenuTab = "";
	
}
);

	
}
);


function allume(n) {
	var nom = "trou_"+n;
	document.getElementById(nom).style.backgroundImage = "radial-gradient( red, rgba(255,255,255,0) )";
	document.getElementById(nom).style.borderRadius = "10px";
	
	console.log("allume "+n);
	setTimeout( function () {eteint(n)}, 1000  );
}

function eteint(n) {
	var nom = "trou_"+n;
	document.getElementById(nom).style.backgroundImage = "";
	
	
	console.log("Eteint "+n);
}

var trou = 0;
function retourne() {
	console.log(trou+"--"+maxTrou);
	if (trou>0) {trou--;	}
	var nom = "trou_"+trou;
	document.getElementById(nom).style.visibility = "hidden";
	if ( rouge ) { allume(trou-1); }
	}
function avance() {
	console.log(trou+"--"+maxTrou);
	var nom = "trou_"+trou;
	document.getElementById(nom).style.visibility = "visible";
	if ( rouge ) { allume(trou); }	
	trou++;
	}
function corrige(n) {
	
	var nom = "correction_"+n;
	document.getElementById(nom).style.display = "block";
}
function decorrige(n) {
	var nom = "correction_"+n;
	document.getElementById(nom).style.display = "none";
}


function avance20() {
	for (var i=0;i<20;i++) {
		console.log(trou+"--"+maxTrou);
		var nom = "trou_"+trou;
		document.getElementById(nom).style.visibility = "visible";
		trou++;
		}
	}

function slide(k,n) {
	console.log("Slide : "+k +"/"+maxSlide);
	var l = k+n;
	$("#slide_"+k).css("display","none");
	$("#slide_"+l).css("display","block");
}


function algo(nNn) {
	function afficher(t) {
		document.getElementById('resultats'+nNn).innerHTML += t+"<br />";
	}
	
	function entAlea(a,b){
		return a+ Math.floor( (b-a+1)*Math.random() );	
	}
	
	var today = new Date();	
	var date = today.toLocaleDateString()+"--"+today.getHours()+"h"+today.getMinutes()+"min"+today.getSeconds()+","+today.getMilliseconds()+"s";
	
	document.getElementById('resultats'+nNn).innerHTML = "<div style='font-style:italic;color:#e0e0e0;font-size:80%;'>-- sarmateScript computed -- "+ date +" -- </div>";
	
	var texte = document.getElementById("textareaCode"+nNn).value;
	
	texte = texte.replace( new RegExp( 'rand[(]' , 'g' )  ,'Math.random(' );
	texte = texte.replace( new RegExp( 'puissance[(]' , 'g' )  ,'Math.pow(' );	
	texte = texte.replace( new RegExp( 'ln[(]' , 'g' )  ,'Math.log(' );
	texte = texte.replace( new RegExp( 'exp[(]' , 'g' )  ,'Math.exp(' );
	texte = texte.replace( new RegExp( 'cos[(]' , 'g' )  ,'Math.cos(' );
	texte = texte.replace( new RegExp( 'sin[(]' , 'g' )  ,'Math.sin(' );
	texte = texte.replace( new RegExp( 'tan[(]' , 'g' )  ,'Math.tan(' );
	texte = texte.replace( new RegExp( 'racineCarrée[(]' , 'g' )  ,'Math.sqrt(' );
	texte = texte.replace( new RegExp( '%PI' , 'g' )  ,'Math.PI' );
	texte = texte.replace( new RegExp( '%E' , 'g' )  ,'Math.E' );
	texte = texte.replace( new RegExp( 'OU' , 'g' )  ,'||' );
	texte = texte.replace( new RegExp( 'ET' , 'g' )  ,'&&' );
	
	console.log( texte );
	
	console.log( eval(texte) );
	
	var obj = document.getElementById("resultats"+nNn);
	obj.scrollTop = obj.scrollHeight;
}








function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
            throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}
// Here's everything you need to run a python program in skulpt
// grab the code from your textarea
// get a reference to your pre element for output
// configure the output function
// call Sk.importMainWithBody()
function runit(n) { 
   var prog = document.getElementById("yourcode"+n).value;
   var tortue = prog.search("turtle");
   if ( tortue > 0) { document.getElementById('mycanvas'+n).style.display = "block";  } else { document.getElementById('mycanvas'+n).style.display = "none";  }
   var mypre = document.getElementById("output"+n); 
   mypre.innerHTML = ''; 
   Sk.pre = "output"+n;
   Sk.configure({output:eval("outf"+n), read:builtinRead}); 
   (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'mycanvas'+n;
   var myPromise = Sk.misceval.asyncToPromise(function() {
       return Sk.importMainWithBody("<stdin>", false, prog, true);
   });
   myPromise.then(function(mod) {
       console.log('success');
   },
       function(err) {
       console.log(err.toString());
   });
} 








