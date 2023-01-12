/*

Mathpad  est une librairie permettant de créer des documents à vocation scientifique
Copyright (C) 2016  Frattini Fabrice

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or  any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.


*/


//
// mathpad.js utilise python skulpt et jQuery
//




function va_en_bas() {
	var obj = document.body;
	obj.scrollTop = obj.scrollHeight;
	}

var maxTrou = 0;
var maxSlide = 0;
var editorPython = [];
var editorPythonImpr = [];
var editorHTML = [];
var editorCode = [];
var editorCodeGraphe = [];
var theme;



// Thèmes 

if( theme === undefined ){ 
	theme = 'classique';
	}


var themesGraphique = {
	'classique' : {
			'fondPage' : 'white',
			'textePage' : 'black',
			'fondPara' : '#b8c8ec',
			'textePara' : '#ffffff',
			'numPara' : 'black',
			'texteProp' : 'black',
			'titrePartie' : '#d3ddf5',
			'texteTitrePartie': 'black',
			'fondCorrection' : 'rgba(255,124,92,0.2)',
			'barreBtnCorr' : '#ff7c5c',
			'fondBtnCorr' : '#f7f7f7',
			'fondCode' : 'white',
			'texteCode' : 'black'
		},
	'dark' : {
			'fondPage' : 'rgb(180,180,180)',
			'textePage': 'black',
			'fondPara' : 'black',
			'textePara' : '#ffffff',
			'numPara' : 'black',
			'texteProp' : 'white',
			'titrePartie' : 'rgb(200,200,200)',
			'texteTitrePartie': 'black',
			'fondCorrection' : 'rgba(230,230,230,0.7)',
			'barreBtnCorr' : 'rgb(50,50,50)',
			'fondBtnCorr' : 'rgb(200,200,200)',
			'fondCode' : 'black',
			'texteCode' : 'white'
		},
	'green' : {
			'fondPage' : 'rgb(255,255,255)',
			'textePage': 'black',
			'fondPara' : 'rgb(121,210,140)',
			'textePara' : '#ffffff',
			'numPara' : 'black',
			'texteProp' : 'black',
			'titrePartie' : 'rgb(140,230,160)',
			'texteTitrePartie': 'black',
			'fondCorrection' : 'rgba(180,255,200,0.5)',
			'barreBtnCorr' : 'rgb(116,190,130)',
			'fondBtnCorr' : 'rgb(245,245,245)',
			'fondCode' : 'white',
			'texteCode' : 'black'
		},
		'ellicio' : {
			'fondPage' : 'rgb(255,255,255)',
			'textePage': 'black',
			'fondPara' : 'rgb(207,172,113)',
			'textePara' : '#ffffff',
			'numPara' : 'white',
			'texteProp' : 'black',
			'titrePartie' : 'rgb(150,57,20)',
			'texteTitrePartie': 'white',
			'fondCorrection' : 'rgba(207,172,113,0.5)',
			'barreBtnCorr' : 'rgb(150,57,20)',
			'fondBtnCorr' : 'rgb(245,245,245)',
			'fondCode' : 'white',
			'texteCode' : 'black'
		},
		'livio' : {
			'fondPage' : 'rgb(255,255,255)',
			'textePage': 'black',
			'fondPara' : 'rgb(39,64,239)',
			'textePara' : '#ffffff',
			'numPara' : 'white',
			'texteProp' : 'white',
			'titrePartie' : 'rgb(0,16,130)',
			'texteTitrePartie': 'white',
			'fondCorrection' : 'rgba(90,90,90,0.3)',
			'barreBtnCorr' : 'rgb(0,0,0)',
			'fondBtnCorr' : 'rgb(245,245,245)',
			'fondCode' : 'white',
			'texteCode' : 'black'
		},
		'marseille' : {
			'fondPage' : 'rgb(255,255,255)',
			'textePage': 'black',
			'fondPara' : 'rgb(0,180,225)',
			'textePara' : 'white',
			'numPara' : 'black',
			'texteProp' : 'black',
			'titrePartie' : 'rgb(202,140,84)',
			'texteTitrePartie': 'black',
			'fondCorrection' : 'rgba(255,124,92,0.2)',
			'barreBtnCorr' : '#ff7c5c',
			'fondBtnCorr' : '#f7f7f7',
			'fondCode' : 'white',
			'texteCode' : 'black'
		},
		'sunshine' : {
			'fondPage' : 'rgb(255,246,131)',
			'textePage': 'black',
			'fondPara' : 'rgb(255,166,54)',
			'textePara' : 'white',
			'numPara' : 'white',
			'texteProp' : 'black',
			'titrePartie' : 'rgb(255,120,80)',
			'texteTitrePartie': 'white',
			'fondCorrection' : 'rgba(255,124,80,0.8)',
			'barreBtnCorr' : '#ff7c5c',
			'fondBtnCorr' : '#f7f7f7',
			'fondCode' : 'white',
			'texteCode' : 'black'
		},
		'ferrari' : {
			'fondPage' : 'rgb(255,0,0)',
			'textePage': 'black',
			'fondPara' : 'rgb(255,255,0)',
			'textePara' : 'black',
			'numPara' : 'white',
			'texteProp' : 'black',
			'titrePartie' : 'rgb(0,0,0)',
			'texteTitrePartie': 'white',
			'fondCorrection' : 'rgba(220,220,220,1)',
			'barreBtnCorr' : 'black',
			'fondBtnCorr' : 'rgb(220,220,220)',
			'fondCode' : 'white',
			'texteCode' : 'black'
		},
		'black' : {
			'fondPage' : 'rgb(0,0,0)',
			'textePage': 'white',
			'fondPara' : 'rgb(50,50,50)',
			'textePara' : 'white',
			'numPara' : 'white',
			'texteProp' : 'white',
			'titrePartie' : 'rgb(100,100,100)',
			'texteTitrePartie': 'white',
			'fondCorrection' : 'rgba(120,120,120,0.8)',
			'barreBtnCorr' : 'rgb(255,255,255)',
			'fondBtnCorr' : 'rgb(100,100,100)',
			'fondCode' : 'black',
			'texteCode' : 'white'
		},
		'clair' : {
			'fondPage' : 'rgb(255,255,255)',
			'textePage': 'black',
			'fondPara' : 'rgb(255,205,245)',
			'textePara' : 'rgb(178,72,157)',
			'numPara' : 'white',
			'texteProp' : 'rgb(178,72,157)',
			'titrePartie' : 'rgb(178,72,157)',
			'texteTitrePartie': 'white',
			'fondCorrection' : 'rgba(178,72,157,0.2)',
			'barreBtnCorr' : 'rgb(178,72,157)',
			'fondBtnCorr' : 'rgb(240,240,240)',
			'fondCode' : 'white',
			'texteCode' : 'black'
		},
		'bonbon' : {
			'fondPage' : 'rgb(255,255,255)',
			'textePage': 'black',
			'fondPara' : 'rgb(122,213,255)',
			'textePara' : 'rgb(0,0,0)',
			'numPara' : 'black',
			'texteProp' : 'rgb(0,0,0)',
			'titrePartie' : 'rgb(128,255,122)',
			'texteTitrePartie': 'black',
			'fondCorrection' : 'rgba(255,40,40,0.5)',
			'barreBtnCorr' : 'rgb(255,40,40)',
			'fondBtnCorr' : 'rgb(240,240,240)',
			'fondCode' : 'rgba(255,40,40,0.5)',
			'texteCode' : 'black'
		},
		'livre' : {
			'fondPage' : 'rgb(255,255,255)',
			'textePage': 'black',
			'fondPara' : 'rgb(144,205,234)',
			'textePara' : 'rgb(0,0,0)',
			'numPara' : 'black',
			'texteProp' : 'rgb(0,0,0)',
			'titrePartie' : 'rgb(135,245,130)',
			'texteTitrePartie': 'black',
			'fondCorrection' : 'rgba(255,40,40,0.5)',
			'barreBtnCorr' : 'rgb(255,40,40)',
			'fondBtnCorr' : 'rgb(240,240,240)',
			'fondCode' : 'rgba(255,40,40,0.5)',
			'texteCode' : 'black'
		}
};


// Fin Thèmes


$(document).ready(
	function(){
		mathpad();
		$("body").after("<div class='clicGauche' onclick='retourne()'></div>");
		$("body").after("<div class='clicDroit' onclick='avance()'></div>");
		}
	);


// Pour faire apparaître ou disparaître les "<pause></pause>"

function allume(n) {
	var nom = "trou_"+n;
	document.getElementById(nom).style.backgroundImage = "radial-gradient( red, rgba(255,255,255,0) )";
	document.getElementById(nom).style.borderRadius = "10px";
	//console.log("allume "+n);
	setTimeout( function () {eteint(n)}, 1000  );
	}

function eteint(n) {
	var nom = "trou_"+n;
	document.getElementById(nom).style.backgroundImage = "";
	//console.log("Eteint "+n);
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
	
	
	
// Pour la zone déroulable des corrections

function corrige(n) {
	var nom = "correction_"+n;
	var elt = document.getElementById(nom);	
	elt.style.display = "block";
	var h = elt.offsetHeight;
	//elt.style.height = "0px";
	elt.style.opacity = 1
	window.setTimeout( function () {
		elt.style.transform = 'scale(1)';
		//elt.style.height = h+"px";
		},0);
	}

function decorrige(n) {
	var nom = "correction_"+n;
	var elt = document.getElementById(nom);
	elt.style.transform = 'scale(0)';
	elt.style.opacity = 0;
	//elt.style.height = "0px";
	//var h = elt.offsetHeight;
	window.setTimeout( function () {
		elt.style.display = "none";
		//elt.style.height = h+"px";
		},700);
	}


// Pour gagner du temps pour compléter les "trous"

function avance20() {
	for (var i=0;i<20;i++) {
		console.log(trou+"--"+maxTrou);
		var nom = "trou_"+trou;
		document.getElementById(nom).style.visibility = "visible";
		trou++;
		}
	}


// Pour passer les slides

function slide(k,n) {
	console.log("Slide : "+k +"/"+maxSlide);
	var l = k+n;
	$("#slide_"+k).css("display","none");
	$("#slide_"+l).css("display","block");
	}



function curseur(a,b,c,d,e) {
	return true;
	}


function curseurChange(i,largeur,hauteur) {
	//console.log( document.getElementById("curseur"+i).value );
	return parseFloat(document.getElementById("curseur"+i).value);
	}


// Les zones d'algorithmes

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
	
	//var texte = document.getElementById("textareaCode"+nNn).value;
	var texte = editorCode[nNn].getValue();
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
	//console.log( texte );
	console.log( eval(texte) );
	var obj = document.getElementById("resultats"+nNn);
	obj.scrollTop = obj.scrollHeight;
	}



// Algorithmes graphiques

class SarmateGraphe {
	constructor(dimensionL, dimensionH, context){
		this.dimensionL = dimensionL;
		this.dimensionH = dimensionH;
		this.context = context;
		let couleur, peinture, transparence, trait, Xmin, Xmax, Ymin, Ymax, GradX, GradY, AxeX, AxeY, Grille;		
		this.couleur = '#000000';
		this.peinture = '#ffffff'; 
		this.transparence = 0;
		this.trait = 1;
		this.Xmin = -10;
		this.Xmax = 10;
		this.Ymin = -10;
		this.Ymax = 10;
		this.GradX = 1;
		this.GradY = 1;
		this.AxeX = false;
		this.AxeY = false;
		this.Grille = false;
		
		this.convert3_2 = function (P) {
			let T = [-2,-2];
			T[0] = -2-0.2*P[0]+P[1];
			T[1] = -2-0.15*P[0]+0.99*P[2];
			return T;
			}
		this.coordX = function (x) {
			var a = this.dimensionL/(this.Xmax-this.Xmin);
			var b = -this.Xmin*a;
			return a*x+b;
			}
		this.coordY = function (y) {
			var a = this.dimensionH/(this.Ymin-this.Ymax);
			var b = -this.Ymax*a;
			return a*y+b;
			}
		this.point = function (X) {
			if (X.length == 3) { X = this.convert3_2(X) }	
			context.strokeStyle = this.couleur;
			context.fillStyle = this.couleur;
			context.lineWidth = this.trait;
			context.beginPath();
			context.arc(this.coordX(X[0]),this.coordY(X[1]),3*this.trait,0,2*Math.PI);
			context.fill();
			context.closePath();		
			}
		this.effaceEcran = function () {
			context.fillStyle = "#fff";
			context.strokeStyle = this.couleur;
			context.lineWidth = this.trait;
			context.beginPath();
			context.moveTo(0,0);
			context.lineTo(this.dimensionL,0);
			context.lineTo(this.dimensionL,this.dimensionH);
			context.lineTo(0,this.dimensionH);
			context.lineTo(0,0);
			context.fill();
			context.closePath();	
			}	
		this.traceG = function (nbSx, nbSy) {
			if ( !nbSx ) { nbSx = 0; }
			if ( !nbSy ) { 
				if ( nbSx == 0 ) { nbSy = 0; }else{ nbSy = nbSx; }
				}
			var coul = this.couleur;
			this.couleur = "rgb(220,220,220)";
			if ( nbSx > 0 ) {
				let pas = 1/(nbSx+1);
				for (var i = 0; i < (this.Xmax)/this.GradX ; i = i+pas) {
					this.segment( [i*this.GradX,this.Ymin],[i*this.GradX,this.Ymax] );
					}
				for (var i = 0; i > (this.Xmin)/this.GradX ; i = i-pas) {
					this.segment( [i*this.GradX,this.Ymin],[i*this.GradX,this.Ymax] );
					}
				}
			if ( nbSy > 0 ) {
				let pas = 1/(nbSy+1);
				for (var i = 0;i < (this.Ymax)/this.GradY ; i = i+pas) {
					this.segment([this.Xmin,i*this.GradY],[this.Xmax,i*this.GradY]);
					}
				for (var i = 0; i > (this.Ymin)/this.GradY ; i = i-pas) {
					this.segment([this.Xmin,i*this.GradY],[this.Xmax,i*this.GradY]);
					}
				}
			this.couleur = "#c0c0c0";
			for (var i = 0; i < (this.Xmax)/this.GradX ; i++) {
				this.segment([i*this.GradX,this.Ymin],[i*this.GradX,this.Ymax]);
				}
			for (var i = 0; i > (this.Xmin)/this.GradX ; i--) {
				this.segment([i*this.GradX,this.Ymin],[i*this.GradX,this.Ymax]);
			}
			for (var i = 0;i < (this.Ymax)/this.GradY ; i++) {
				this.segment([this.Xmin,i*this.GradY],[this.Xmax,i*this.GradY]);
			}
			for (var i = 0; i > (this.Ymin)/this.GradY ; i--) {
				this.segment([this.Xmin,i*this.GradY],[this.Xmax,i*this.GradY]);
			}
			this.couleur = coul;
			}	
		this.peintTout = function (coulPeinture) {
			context.fillStyle = coulPeinture;
			context.strokeStyle = this.couleur;
			context.lineWidth = this.trait;
			context.beginPath();
			context.moveTo(0,0);
			context.lineTo(dimensionL,0);
			context.lineTo(dimensionL,dimensionH);
			context.lineTo(0,dimensionH);
			context.lineTo(0,0);
			context.fill();
			context.closePath();
			}
		this.traceX = function (unit,nbS) {
			if ( !unit) { unit = false; }
			if ( !nbS ){ nbS = 0; }
			this.segment([this.Xmin,0],[this.Xmax,0]);
			this.trait = 1*this.trait;
			this.segment([this.Xmax-(this.Xmax-this.Xmin)/100,(this.Ymax-this.Ymin)/150],[this.Xmax,0]);
			this.segment([this.Xmax-(this.Xmax-this.Xmin)/100,-(this.Ymax-this.Ymin)/150],[this.Xmax,0]);
			this.trait = this.trait/1;
			var coul = this.couleur;
			this.couleur = "rgb(100,100,100)";
			if ( unit ) {
				if ( nbS > 0 ) {
					let pas = 1/(nbS+1);
					for (var i = 0; i < (this.Xmax)/this.GradX ; i = i+pas) {
						this.segment( [i*this.GradX,-(this.Ymax-this.Ymin)/150],[i*this.GradX,(this.Ymax-this.Ymin)/150] );
						}
					for (var i = 0; i > (this.Xmin)/this.GradX ; i = i-pas) {
						this.segment( [i*this.GradX,-(this.Ymax-this.Ymin)/150],[i*this.GradX,(this.Ymax-this.Ymin)/150] );
						}
					}
				this.couleur = "rgb(0,0,0)";
				for (var i = 0; i < (this.Xmax)/this.GradX ; i++) {
					this.segment([i*this.GradX,-(this.Ymax-this.Ymin)/150],[i*this.GradX,(this.Ymax-this.Ymin)/150]);
					}
				for (var i = 0; i > (this.Xmin)/this.GradX ; i--) {
					this.segment([i*this.GradX,-(this.Ymax-this.Ymin)/150],[i*this.GradX,(this.Ymax-this.Ymin)/150]);
					}
				}
			this.couleur = coul;			
			}
		this.traceY = function (unit, nbS) {
			if ( !unit) { unit = false; }
			if ( !nbS ){ nbS = 0; }
			this.segment([0,this.Ymin],[0,this.Ymax]);
			this.trait = 1*this.trait;
			this.segment([(this.Xmax-this.Xmin)/150,this.Ymax-(this.Ymax-this.Ymin)/100],[0,this.Ymax]);
			this.segment([-(this.Xmax-this.Xmin)/150,this.Ymax-(this.Ymax-this.Ymin)/100],[0,this.Ymax])
			this.trait = this.trait/1;
			var coul = this.couleur;
			this.couleur = "rgb(100,100,100)";
			if ( unit ) {
				if ( nbS > 0 ) {
					let pas = 1/(nbS+1);
					for (var i = 0;i < (this.Ymax)/this.GradY ; i = i+pas) {
						this.segment([-(this.Xmax-this.Xmin)/150,i*this.GradY],[(this.Xmax-this.Xmin)/150,i*this.GradY]);
						}
					for (var i = 0; i > (this.Ymin)/this.GradY ; i = i-pas) {
						this.segment([-(this.Xmax-this.Xmin)/150,i*this.GradY],[(this.Xmax-this.Xmin)/150,i*this.GradY]);
						}
					}
				this.couleur = "rgb(0,0,0)";
				for (var i = 0;i < (this.Ymax)/this.GradY ; i++) {
					this.segment([-(this.Xmax-this.Xmin)/150,i*this.GradY],[(this.Xmax-this.Xmin)/150,i*this.GradY]);
					}
				for (var i = 0; i > (this.Ymin)/this.GradY ; i--) {
					this.segment([-(this.Xmax-this.Xmin)/150,i*this.GradY],[(this.Xmax-this.Xmin)/150,i*this.GradY]);
					}
				}
			this.couleur = coul;
			}
		this.segment = function (A,B,P) {
			if (A.length == 3) {
				A = this.convert3_2(A);
				B = this.convert3_2(B);
				}
			if ( !P ) { P = [] }
			context.setLineDash(P);
			context.strokeStyle = this.couleur;
			context.fillStyle = this.peinture;
			context.lineWidth = this.trait;
			context.beginPath();	
			context.moveTo(this.coordX(A[0]),this.coordY(A[1]));
			context.lineTo(this.coordX(B[0]),this.coordY(B[1]));
			context.stroke();
			context.closePath();
			}		
		this.hachure = function (P) {
			context.setLineDash(P);
			}
		this.droite = function (A,B,P) {
			if ( !P ) { P = [] }
			context.setLineDash(P);
			if (A.length == 3) {
				A = this.convert3_2(A);
				B = this.convert3_2(B);
				}
			var varH = B[0]-A[0];
			if ( varH == 0 ) { varH = 0.00000001; }
			var a = (B[1]-A[1])/(varH);
			var b = A[1]-a*A[0];
			this.segment( [this.Xmin,a*this.Xmin+b], [this.Xmax,a*this.Xmax+b] );
			}
		this.texte = function (T,A,fs) {
			if (A.length == 3) {
				A = this.convert3_2(A);
				}
			if (!fs) { fs = 15 }
			context.font = fs+"px Helvetica";
			context.fillStyle = this.couleur;
			context.fillText( T, this.coordX(A[0]), this.coordY(A[1]) );
			}
		this.texteMath = function (T,A,fs) {
			let g = document.createElement('div');
			g.setAttribute("id", "captureAZD");
			document.body.appendChild(g)
			g.style.color = this.couleur;
			g.style.fontSize = fs+"px";
			katex.render(T, document.getElementById("captureAZD"), { displayMode: false });
			html2canvas( document.querySelector("#captureAZD"), {backgroundColor:null, height:100} ).then(canvas => {
	   		let pngUrl = canvas.toDataURL();
    			let img = new Image();
    			img.onload = () => {
    				context.drawImage(img, this.coordX(A[0]), this.coordY(A[1]));
  					};
    			img.src = pngUrl;
				});
			g.remove();
			}
		this.cercle = function (X,r,P) {
			if ( !P ) { P = [] }
			context.setLineDash(P);
			context.globalAlpha = this.transparence;
			context.strokeStyle = this.couleur;
			context.fillStyle = this.peinture;
			context.lineWidth = this.trait;
			context.beginPath();	
			var rayonX = r*this.dimensionL/(this.Xmax-this.Xmin);
			var rayonY = r*this.dimensionH/(this.Ymax-this.Ymin);
			context.ellipse(this.coordX(X[0]),this.coordY(X[1]),rayonX,rayonY,0,0,2*Math.PI);
			context.fill();
			context.closePath();
			context.globalAlpha = 1
			context.stroke();
			}
		this.cercle3d = function (C,N,r,P) {
			let base = this.baseOrtho(C,N);
			let U = base[0];
			let V = base[1];
			if ( !P ) { P = [] }
			let M = [0,0,0];
			let M0 = [0,0,0];
			M[0] = C[0]+r*U[0];
			M[1] = C[0]+r*U[1];
			M[2] = C[0]+r*U[2];
			for (var t = 0; t <= 2*Math.PI+0.05 ; t = t+0.05) {
				M0[0] = M[0];
				M0[1] = M[1];
				M0[2] = M[2];
				M[0] = C[0]+r*U[0]*Math.cos(t)+r*V[0]*Math.sin(t);
				M[1] = C[0]+r*U[1]*Math.cos(t)+r*V[1]*Math.sin(t);
				M[2] = C[0]+r*U[2]*Math.cos(t)+r*V[2]*Math.sin(t);
				this.segment(M,M0,P);
				}
			
			}
		this.arcCercle = function (X,r,ad,af,P) {
			if ( !P ) { P = [] }
			context.setLineDash(P);
			context.globalAlpha = this.transparence;
			context.strokeStyle = this.couleur;
			context.fillStyle = this.peinture;
			context.lineWidth = this.trait;
			context.beginPath();	
			var rayonX = this.dimensionL/(this.Xmax-this.Xmin)*r;
			var rayonY = r*this.dimensionH/(this.Ymax-this.Ymin);
			context.moveTo(this.coordX(X[0]),this.coordY(X[1]));
			context.ellipse(this.coordX(X[0]),this.coordY(X[1]),rayonX,rayonY,0,-af,-ad);
			context.fill();
			context.closePath();
			context.globalAlpha = 1;
			context.stroke();
			}
		this.arcCercle3d = function (C,N,r,a1,a2,P) {
			let base = this.baseOrtho(C,N);
			let U = base[0];
			let V = base[1];
			if ( !P ) { P = [] }
			let M = [0,0,0];
			let M0 = [0,0,0];
			M[0] = C[0]+r*U[0]*Math.cos(a1)+r*V[0]*Math.sin(a1);
			M[1] = C[0]+r*U[1]*Math.cos(a1)+r*V[1]*Math.sin(a1);
			M[2] = C[0]+r*U[2]*Math.cos(a1)+r*V[2]*Math.sin(a1);
			for (var t = a1; t <= a2 ; t = t+0.05) {
				M0[0] = M[0];
				M0[1] = M[1];
				M0[2] = M[2];
				M[0] = C[0]+r*U[0]*Math.cos(t)+r*V[0]*Math.sin(t);
				M[1] = C[0]+r*U[1]*Math.cos(t)+r*V[1]*Math.sin(t);
				M[2] = C[0]+r*U[2]*Math.cos(t)+r*V[2]*Math.sin(t);
				this.segment(M,M0,P);
				}
			
			}
		this.rectangle = function (A,L,l,P) {
			if ( !P ) { P = [] }
			context.setLineDash(P);
			context.globalAlpha = this.transparence;
			context.strokeStyle = this.couleur;
			context.fillStyle = this.peinture;
			context.lineWidth = this.trait;
			context.beginPath();		
			var Lx = L*	this.dimensionL/(this.Xmax-this.Xmin);
			var ly = l*this.dimensionH/(this.Ymax-this.Ymin);		
			context.rect(this.coordX(A[0]),this.coordY(A[1]),Lx,ly);	
			context.fill();
			context.closePath();
			context.globalAlpha = 1;
			context.stroke();
			}
		this.triangle = function (A,B,C,P) {
			if ( !P ) { P = [] }
			context.setLineDash(P);
			if (A.length == 3) {
				A = this.convert3_2(A);
				B = this.convert3_2(B);
				C = this.convert3_2(C);
				}
			context.globalAlpha = this.transparence;
			context.strokeStyle = this.couleur;
			context.fillStyle = this.peinture;
			context.lineWidth = this.trait;
			context.beginPath();
			context.moveTo(this.coordX(A[0]),this.coordY(A[1]));
			context.lineTo(this.coordX(B[0]),this.coordY(B[1]));
			context.lineTo(this.coordX(C[0]),this.coordY(C[1]));
			context.lineTo(this.coordX(A[0]),this.coordY(A[1]));			
			context.fill();
			context.closePath();
			context.globalAlpha = 1;
			context.stroke();
			}
		this.quadri = function (A,B,C,D,P) {
			if ( !P ) { P = [] }
			context.setLineDash(P);
			if (A.length == 3) {
				A = this.convert3_2(A);
				B = this.convert3_2(B);
				C = this.convert3_2(C);
				D = this.convert3_2(D);
				}
			context.globalAlpha = this.transparence;
			context.strokeStyle = this.couleur;
			context.fillStyle = this.peinture;
			context.lineWidth = this.trait;
			context.beginPath();			
			context.moveTo(this.coordX(A[0]),this.coordY(A[1]));
			context.lineTo(this.coordX(B[0]),this.coordY(B[1]));
			context.lineTo(this.coordX(C[0]),this.coordY(C[1]));
			context.lineTo(this.coordX(D[0]),this.coordY(D[1]));
			context.lineTo(this.coordX(A[0]),this.coordY(A[1]));			
			context.fill();
			context.closePath();
			context.globalAlpha = 1;
			context.stroke();
			}	
		this.poly = function (L,P) {
			if ( !P ) { P = [] }
			context.setLineDash(P);
			var n = L.length;
			if ( L[0].length == 3 ) {
				for (var i = 0; i < n; i++) {
					L[i] = this.convert3_2(L[i]);
					}
				}
			context.globalAlpha = this.transparence;
			context.strokeStyle = this.couleur;
			context.fillStyle = this.peinture;
			context.lineWidth = this.trait;
			context.beginPath();
			context.moveTo(this.coordX(L[0][0]),this.coordY(L[0][1]));
			for (var i = 1; i < n; i++) {
				context.lineTo(this.coordX(L[i][0]),this.coordY(L[i][1]));
				}
			context.fill();
			context.closePath();
			context.globalAlpha = 1;
			context.stroke();
			}		
		this.chaine = function (L,P) {
			if ( !P ) { P = [] }
			context.setLineDash(P);
			var n = L.length;
			if ( L[0].length == 3 ) {
				for (var i = 0; i < n; i++) {
					L[i] = this.convert3_2(L[i]);
					}
				}
			for (var i = 1; i < n; i++) {
				this.segment(L[i-1],L[i],P);
				}
			}	
		this.graphe = function (f,a,b) {
			context.strokeStyle = this.couleur;
			context.fillStyle = this.peinture;
			context.lineWidth = this.trait;
			var pas = (b-a)/1000;
			for (var i = 1; i < 1000 ; i++) {
				context.beginPath();
				context.moveTo(this.coordX(a+(i-1)*pas),this.coordY(f(a+(i-1)*pas))  );
				context.lineTo(this.coordX(a+i*pas),this.coordY(f(a+i*pas))  );
				context.stroke();
				context.closePath();
				}
			}
		this.peintureCourbe = function (f,a,b) {
			context.globalAlpha = this.transparence;
			context.fillStyle = this.peinture;
			context.beginPath();
			context.moveTo(this.coordX(a),this.coordY(0)  );
			var pas = (b-a)/1000;
			for (var i = 0 ; i < 1000 ; i++) {
				context.lineTo( this.coordX(a+i*pas), this.coordY(f(a+i*pas)) );		
				}
			context.lineTo(this.coordX(b),this.coordY(0)  );
			context.fill();
			context.closePath();
			context.globalAlpha = 1;
			}	
		this.droiteParam = function (X,U,P) {
			var Y = [];
			for (var i = 0;i<X.length;i++) {
				Y[i] = X[i]+U[i];
				}	
			if (U.length == 3) {
				X = this.convert3_2(X);
				Y = this.convert3_2(Y);
				}
			this.droite(X,Y,P);
			}		
		this.rotation2d = function (C,a,P) {
			var Q = [0,0];
			var c = Math.cos(a);
			var s = Math.sin(a);
			Q[0] = (P[0]-C[0])*c-(P[1]-C[1])*s+C[0];
			Q[1] = (P[0]-C[0])*s+(P[1]-C[1])*c+C[1];
			return Q;
			}		
		this.rotation3d = function (U,a,C,P) {
			var Q = [0,0,0];
			var D = [0,0,0];
			var c = Math.cos(a);
			var s = Math.sin(a);
			var d = Math.sqrt( U[0]*U[0]+U[1]*U[1]+U[2]*U[2] )
			U[0] = U[0]/d;
			U[1] = U[1]/d;
			U[2] = U[2]/d;			
			var cst = -(U[0]*P[0]+U[1]*P[1]+U[2]*P[2]);
			var t = -cst-U[0]*C[0]-U[1]*C[1]-U[2]*C[2];
			D[0] = U[0]*t+C[0];
			D[1] = U[1]*t+C[1];
			D[2] = U[2]*t+C[2];			
			Q[0] = (P[0]-D[0])*( U[0]*U[0]*(1-c)+c )+(P[1]-D[1])*( U[0]*U[1]*(1-c)-U[2]*s )+(P[2]-D[2])*( U[0]*U[2]*(1-c)+U[1]*s )+D[0];
			Q[1] = (P[0]-D[0])*( U[0]*U[1]*(1-c)+U[2]*s )+(P[1]-D[1])*( U[1]*U[1]*(1-c)+c )+(P[2]-D[2])*( U[1]*U[2]*(1-c)-U[0]*s )+D[1];
			Q[2] = (P[0]-D[0])*( U[0]*U[2]*(1-c)-U[1]*s )+(P[1]-D[1])*( U[1]*U[2]*(1-c)+U[0]*s )+(P[2]-D[2])*( U[2]*U[2]*(1-c)+c )+D[2];		
			return Q
			}
		this.baseOrtho = function (A,N){
			let a = N[0];
			let b = N[1];
			let c = N[2];
			let d = -a*A[0]-b*A[1]-c*A[2];
			let B = [0,0,0];
			if (a == 0){
				if ( b == 0) {
					B = [1,1,-d/c];
					}
				if ( c == 0) {
					B = [1,-d/b,1];
					}
				}
			else {
				B = [(-b-c-d)/a,1,1];
				}
			let Ub = [B[0]-A[0], B[1]-A[1], B[2]-A[2]];
			let NUb = Math.sqrt( Ub[0]*Ub[0]+Ub[1]*Ub[1]+Ub[2]*Ub[2] );
			let U = [ Ub[0]/NUb , Ub[1]/NUb , Ub[2]/NUb ];
			let I = [A[0]+U[0] , A[1]+U[1], A[2]+U[2] ];
			let J = this.rotation3d(N, Math.PI/2, A, I);
			
			return [I,J];
			}
		this.proj = function (U,C,P) {
			if ( U.length < 3) {
				var D = [0,0];
				var d = Math.sqrt( U[0]*U[0]+U[1]*U[1] )
				U[0] = U[0]/d;
				U[1] = U[1]/d;
				var cst = -(U[0]*P[0]+U[1]*P[1]);
				var t = -cst-U[0]*C[0]-U[1]*C[1];
				D[0] = U[0]*t+C[0];
				D[1] = U[1]*t+C[1];
				}
			else {
				var D = [0,0,0];
				var d = Math.sqrt( U[0]*U[0]+U[1]*U[1]+U[2]*U[2] )
				U[0] = U[0]/d;
				U[1] = U[1]/d;
				U[2] = U[2]/d;
				var cst = -(U[0]*P[0]+U[1]*P[1]+U[2]*P[2]);
				var t = -cst-U[0]*C[0]-U[1]*C[1]-U[2]*C[2];
				D[0] = U[0]*t+C[0];
				D[1] = U[1]*t+C[1];
				D[2] = U[2]*t+C[2];
				}
			return D;
			}		
		this.translation = function (U,P) {
			var Q = [];
			for (var i = 0; i < U.length; i++) {
				Q.push( U[i]+P[i] );
				}
			return Q;
			}	
		this.symC = function (C,P){
			var Q = [];
			for (var i = 0; i < C.length; i++) {
				Q.push( 2*C[i]-P[i] );
				}
			return Q;
			}	
		this.symA = function (U,C,P) {
			var Q = this.proj(U,C,P);
			var Q = this.symC(Q,P);
			return Q;
			}	
		this.ht = function (C,k,P) {
			var Q = [];
			for (var i = 0; i < C.length; i++) {
				Q.push( k*(P[i]-C[i])+C[i] );
				}
			return Q;
			}	
		this.vec = function (A,B) {
			var Q = [];
			for (var i = 0; i < A.length; i++) {
				Q.push( B[i] - A[i] );
				}
			return Q;	
			}		
		this.entAlea = function (a,b){
			return a+ Math.floor( (b-a+1)*Math.random() );	
			}		
		this.traceAxes3d = function () {
			var O = [0,0,0];
			//var I = [this.Ymax/0.4-2,0,0];
			let x1 = -(2+this.Xmin)/0.2;
			let x2 = -(2+this.Ymin)/0.15;
			var I = [Math.max(x1,x2),0,0];
			var J = [0,this.Xmax+2,0];
			var K = [0,0,this.Ymax+3];
			this.segment(O,I);
			this.segment(O,J);
			this.segment(O,K);
			}		
		this.distance = function (A,B) {
			var n = A.length;
			var d = 0;
			for (var i = 0;i < n; i++) {
				d = d+(A[i]-B[i])*(A[i]-B[i]);
				}
			d = Math.sqrt(d);
			return d;
			}
		}
	}

function convertSarmateGraphe(textarea, nNn) {
		let eltName = textarea+nNn;
		let Texte = "\n"+document.getElementById(eltName).value;
		Texte += '\n'+'couleur = "#000000";peinture = "#ffffff";transparence = 0;trait = 1;';
		Texte = Texte.replace( new RegExp( 'point' , 'g' )  ,'sarmateGraphe.point' );
		Texte = Texte.replace( new RegExp( 'traceG' , 'g' )  ,'sarmateGraphe.traceG' );
		Texte = Texte.replace( new RegExp( 'effaceEcran' , 'g' )  ,'sarmateGraphe.effaceEcran' );
		Texte = Texte.replace( new RegExp( 'traceX' , 'g' )  ,'sarmateGraphe.traceX' );
		Texte = Texte.replace( new RegExp( 'traceY' , 'g' )  ,'sarmateGraphe.traceY' );
		Texte = Texte.replace( new RegExp( 'segment' , 'g' )  ,'sarmateGraphe.segment' );
		Texte = Texte.replace( new RegExp( 'droite' , 'g' )  ,'sarmateGraphe.droite' );
		Texte = Texte.replace( new RegExp( 'texte' , 'g' )  ,'sarmateGraphe.texte' );
		Texte = Texte.replace( new RegExp( 'cercle' , 'g' )  ,'sarmateGraphe.cercle' );
		Texte = Texte.replace( new RegExp( 'arcCercle' , 'g' )  ,'sarmateGraphe.arcCercle' );
		Texte = Texte.replace( new RegExp( 'rectangle' , 'g' )  ,'sarmateGraphe.rectangle' );
		Texte = Texte.replace( new RegExp( 'triangle' , 'g' )  ,'sarmateGraphe.triangle' );
		Texte = Texte.replace( new RegExp( 'quadri' , 'g' )  ,'sarmateGraphe.quadri' );
		Texte = Texte.replace( new RegExp( 'poly' , 'g' )  ,'sarmateGraphe.poly' );
		Texte = Texte.replace( new RegExp( 'chaine' , 'g' )  ,'sarmateGraphe.chaine' );
		Texte = Texte.replace( new RegExp( 'hachure' , 'g' )  ,'sarmateGraphe.hachure' );
		Texte = Texte.replace( new RegExp( 'graphe' , 'g' )  ,'sarmateGraphe.graphe' );
		Texte = Texte.replace( new RegExp( 'rotation2d' , 'g' )  ,'sarmateGraphe.rotation2d' );
		Texte = Texte.replace( new RegExp( 'rotation3d' , 'g' )  ,'sarmateGraphe.rotation3d' );
		Texte = Texte.replace( new RegExp( 'proj' , 'g' )  ,'sarmateGraphe.proj' );
		Texte = Texte.replace( new RegExp( 'translation' , 'g' )  ,'sarmateGraphe.translation' );
		Texte = Texte.replace( new RegExp( 'symC' , 'g' )  ,'sarmateGraphe.symC' );
		Texte = Texte.replace( new RegExp( 'symA' , 'g' )  ,'sarmateGraphe.symA' );
		Texte = Texte.replace( new RegExp( 'ht' , 'g' )  ,'sarmateGraphe.ht' );
		Texte = Texte.replace( new RegExp( 'vec' , 'g' )  ,'sarmateGraphe.vec' );
		Texte = Texte.replace( new RegExp( 'entAlea' , 'g' )  ,'sarmateGraphe.entAlea' );
		Texte = Texte.replace( new RegExp( 'traceAxes3d' , 'g' )  ,'sarmateGraphe.traceAxes3d' );
		Texte = Texte.replace( new RegExp( 'distance' , 'g' )  ,'sarmateGraphe.distance' );
				
		Texte = Texte.replace( new RegExp( 'rand[(]' , 'g' )  ,'Math.random(' );
		Texte = Texte.replace( new RegExp( 'puissance[(]' , 'g' )  ,'Math.pow(' );	
		Texte = Texte.replace( new RegExp( 'ln[(]' , 'g' )  ,'Math.log(' );
		Texte = Texte.replace( new RegExp( 'exp[(]' , 'g' )  ,'Math.exp(' );
		Texte = Texte.replace( new RegExp( 'cos[(]' , 'g' )  ,'Math.cos(' );
		Texte = Texte.replace( new RegExp( 'sin[(]' , 'g' )  ,'Math.sin(' );
		Texte = Texte.replace( new RegExp( 'tan[(]' , 'g' )  ,'Math.tan(' );
		Texte = Texte.replace( new RegExp( 'arct[(]' , 'g' )  ,'Math.atan(' );
		Texte = Texte.replace( new RegExp( 'racineCarrée[(]' , 'g' )  ,'Math.sqrt(' );
		Texte = Texte.replace( new RegExp( '%PI' , 'g' )  ,'Math.PI' );
		Texte = Texte.replace( new RegExp( '%E' , 'g' )  ,'Math.E' );
		Texte = Texte.replace( new RegExp( 'OU' , 'g' )  ,'||' );
		Texte = Texte.replace( new RegExp( 'ET' , 'g' )  ,'&&' );
		
		Texte = Texte.replace( new RegExp( 'transparence', 'g' )  ,'sarmateGraphe.transparence' );
		Texte = Texte.replace( new RegExp( 'peinture', 'g' )  ,'sarmateGraphe.peinture' );
		Texte = Texte.replace( new RegExp( 'couleur', 'g' )  ,'sarmateGraphe.couleur' );
		Texte = Texte.replace( new RegExp( 'trait', 'g' )  ,'sarmateGraphe.trait' );
		Texte = Texte.replace( new RegExp( 'Xmin', 'g' )  ,'sarmateGraphe.Xmin' );
		Texte = Texte.replace( new RegExp( 'Xmax', 'g' )  ,'sarmateGraphe.Xmax' );
		Texte = Texte.replace( new RegExp( 'Ymin', 'g' )  ,'sarmateGraphe.Ymin' );
		Texte = Texte.replace( new RegExp( 'Ymax', 'g' )  ,'sarmateGraphe.Ymax' );
		
		Texte = Texte.replace( new RegExp( "couleur = rouge", 'g' )  ,'couleur = "red"' );
		Texte = Texte.replace( new RegExp( "couleur = vert", 'g' )  ,'couleur = "green"' );
		Texte = Texte.replace( new RegExp( "couleur = bleu", 'g' )  ,'couleur = "blue"' );
		Texte = Texte.replace( new RegExp( "couleur = rose", 'g' )  ,'couleur = "pink"' );
		Texte = Texte.replace( new RegExp( "couleur = jaune", 'g' )  ,'couleur = "yellow"' );
		Texte = Texte.replace( new RegExp( "couleur = violet", 'g' )  ,'couleur = "purple"' );
		Texte = Texte.replace( new RegExp( "couleur = noir", 'g' )  ,'couleur = "black"' );
		Texte = Texte.replace( new RegExp( "couleur = marron", 'g' )  ,'couleur = "brown"' );
		Texte = Texte.replace( new RegExp( "couleur = gris", 'g' )  ,'couleur = "gray"' );
		Texte = Texte.replace( new RegExp( "couleur = indigo", 'g' )  ,'couleur = "indigo"' );
		Texte = Texte.replace( new RegExp( "couleur = orange", 'g' )  ,'couleur = "orange"' );
		Texte = Texte.replace( new RegExp( "couleur = blanc", 'g' )  ,'couleur = "white"' );
		
		Texte = Texte.replace( new RegExp( "peinture = rouge", 'g' )  ,'peinture = "red"' );
		Texte = Texte.replace( new RegExp( "peinture = vert", 'g' )  ,'peinture = "green"' );
		Texte = Texte.replace( new RegExp( "peinture = bleu", 'g' )  ,'peinture = "blue"' );
		Texte = Texte.replace( new RegExp( "peinture = rose", 'g' )  ,'peinture = "pink"' );
		Texte = Texte.replace( new RegExp( "peinture = jaune", 'g' )  ,'peinture = "yellow"' );
		Texte = Texte.replace( new RegExp( "peinture = violet", 'g' )  ,'peinture = "purple"' );
		Texte = Texte.replace( new RegExp( "peinture = noir", 'g' )  ,'peinture = "black"' );
		Texte = Texte.replace( new RegExp( "peinture = marron", 'g' )  ,'peinture = "brown"' );
		Texte = Texte.replace( new RegExp( "peinture = gris", 'g' )  ,'peinture = "gray"' );
		Texte = Texte.replace( new RegExp( "peinture = indigo", 'g' )  ,'peinture = "indigo"' );
		Texte = Texte.replace( new RegExp( "peinture = orange", 'g' )  ,'peinture = "orange"' );
		Texte = Texte.replace( new RegExp( "peinture = blanc", 'g' )  ,'peinture = "white"' );
		
		// Modification du textarea
		if ( Texte.match("curseur[(]") ) {
			var deb = Texte.match("curseur[(]").index;
			var sousTexte = Texte.substring( deb , Texte.length );
			var fin =  sousTexte.match("[)]").index;
			var chaineTexte = sousTexte.substring( 8 , fin );
			var tabInfo = chaineTexte.split(",");
			var nomCurseur = "{"+tabInfo[0].replace( new RegExp( '\"', 'g' )  ,'' )+"}";
			Texte = Texte.replace( new RegExp(  nomCurseur , 'g' )  , curseurChange(nNn) );
			var debT = document.getElementById(textarea+nNn).value.match("curseur[(]").index;
			var sousTexteT =  document.getElementById(textarea+nNn).value.substring( debT ,  document.getElementById(textarea+nNn).value.length );
			var finT =  sousTexteT.match("[)]").index;
			var chaineT = sousTexteT.substring( 8 , fin );
			var tabInfoT = chaineT.split(",");
			tabInfoT[1] = curseurChange(nNn);
			chaineT = tabInfoT.join();
			var numT = debT+8;
			var ancienT = document.getElementById(textarea+nNn).value;
			document.getElementById(textarea+nNn).value = ancienT.substring(0,numT)+chaineT+ancienT.substring(debT+finT, ancienT.length);
			}
		
	return Texte;
}



// Algorithmes graphiques avec code visible dans la page

function algoGraphe(nNn,dimensionL,dimensionH) {
	var canvasGraphe = document.getElementById("resultatsGraphe"+nNn);
	var context = canvasGraphe.getContext('2d');
	let sarmateGraphe = new SarmateGraphe(dimensionL, dimensionH, context);
	let Texte = convertSarmateGraphe("textareaCodeGraphe", nNn);
	sarmateGraphe.effaceEcran();
	eval(Texte);	
}

// algorithmes graphiques sans code visible

function algoGrapheInv(nNn,dimensionLInv,dimensionHInv) {
	var canvasGraphe = document.getElementById("resultatsGrapheInv"+nNn);
	var context = canvasGraphe.getContext('2d');
	let sarmateGraphe = new SarmateGraphe(dimensionLInv, dimensionHInv, context);
	let Texte = convertSarmateGraphe("textareaCodeGrapheInv", nNn);
	sarmateGraphe.effaceEcran();
	eval(Texte);	
}


// algorithmes Python

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
   var prog = editorPython[n].getValue();
   var pygame = prog.search("pygame");
   if ( pygame > 0) { document.getElementById('mypgcanvas'+n).style.display = "block";  } else { document.getElementById('mypgcanvas'+n).style.display = "none";  }

   //console.log( pygame );
   
   if ( pygame == -1 ) {
   	var tortue = prog.search("turtle");
   	if ( tortue > 0) { document.getElementById('mycanvas'+n).style.display = "block";  } else { document.getElementById('mycanvas'+n).style.display = "none";  }
   	var mypre = document.getElementById("output"+n); 
   	mypre.innerHTML = ''; 
   	Sk.pre = "output"+n;
   	Sk.configure({output:eval("outf"+n), read:builtinRead, __future__: Sk.python3}); 
   	(Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'mycanvas'+n;
   	var myPromise = Sk.misceval.asyncToPromise(function() {
      	 return Sk.importMainWithBody("<stdin>", false, prog, true);
   	});
   	myPromise.then(function(mod) {
      	 console.log('success');
   	},
       function(err) {
      	 console.log(err.toString());
       	mypre.innerHTML = err.toString();
   	});
   }
   if ( pygame > 0) {
   	function addModal() {
        $(Sk.main_canvas).css("border", "1px solid black");
        
        var currentTarget = resetTarget();

        var div1 = document.createElement("div");
        currentTarget.appendChild(div1);
        $(div1).addClass("modal");
        $(div1).css("text-align", "center");

        var btn1 = document.createElement("span");
        $(btn1).addClass("btn btn-primary btn-sm pull-right");
        var ic = document.createElement("i");
        $(ic).addClass("fas fa-times");
        btn1.appendChild(ic);

        $(btn1).on('click', function (e) {
            Sk.insertEvent("quit");
        });

        var div2 = document.createElement("div");
        $(div2).addClass("modal-dialog modal-lg");
        $(div2).css("display", "inline-block");
        $(div2).width(self.width + 42);
        $(div2).attr("role", "document");
        div1.appendChild(div2);

        var div3 = document.createElement("div");
        $(div3).addClass("modal-content");
        div2.appendChild(div3);

        var div4 = document.createElement("div");
        $(div4).addClass("modal-header d-flex justify-content-between");
        var div5 = document.createElement("div");
        $(div5).addClass("modal-body");
        var div6 = document.createElement("div");
        $(div6).addClass("modal-footer");
        var div7 = document.createElement("div");
        $(div7).addClass("col-md-8");
        var div8 = document.createElement("div");
        $(div8).addClass("col-md-4");
        var header = document.createElement("h5");
        Sk.title_container = header;
        $(header).addClass("modal-title");

        div3.appendChild(div4);
        div3.appendChild(div5);
        div3.appendChild(div6);
        div4.appendChild(header);
        div4.appendChild(btn1);
        // div7.appendChild(header);
        // div8.appendChild(btn1);
        div5.appendChild(Sk.main_canvas);

        createArrows(div6);
        $(div1).modal({
            backdrop: 'static',
            keyboard: false
        });
    }
   
   function resetTarget() {
        var selector = Sk.TurtleGraphics.target;
        var target = typeof selector === "string" ? document.getElementById(selector) : selector;
        // clear canvas container
        while (target.firstChild) {
            target.removeChild(target.firstChild);
        }
        return target;
    }
    
   function createArrows(div) {
        var arrows = new Array(4);
        var direction = ["left", "right", "up", "down"];
        $(div).addClass("d-flex justify-content-center");
        for (var i = 0; i < 4; i++) {
            arrows[i] = document.createElement("span");
            div.appendChild(arrows[i]);
            $(arrows[i]).addClass("btn btn-primary btn-arrow");
            var ic = document.createElement("i");
            $(ic).addClass("fas fa-arrow-" + direction[i]);
            arrows[i].appendChild(ic);
        }

        var swapIcon = function (id) {
            $(arrows[id].firstChild).removeClass("fa-arrow-" + direction[id]).addClass("fa-arrow-circle-" + direction[id]);
        }

        var returnIcon = function (id) {
            $(arrows[id].firstChild).removeClass("fa-arrow-circle-" + direction[id]).addClass("fa-arrow-" + direction[id]);
        }

        $(arrows[0]).on('mousedown', function () {
            Sk.insertEvent("left");
            swapIcon(0);
        });
        $(arrows[0]).on('mouseup', function () {
            returnIcon(0);
        });
        $(arrows[1]).on('mousedown', function () {
            Sk.insertEvent("right");
            swapIcon(1);
        });
        $(arrows[1]).on('mouseup', function () {
            returnIcon(1);
        });
        $(arrows[2]).on('mousedown', function () {
            Sk.insertEvent("up");
            swapIcon(2);
        });
        $(arrows[2]).on('mouseup', function () {
            returnIcon(2);
        });
        $(arrows[3]).on('mousedown', function () {
            Sk.insertEvent("down");
            swapIcon(3);
        });
        $(arrows[3]).on('mouseup', function () {
            returnIcon(3);
        });

        $(document).keydown(function (e) {
            switch (e.which) {
                case 37:
                    swapIcon(0);
                    break;
                case 38:
                    swapIcon(2);
                    break;
                case 39:
                    swapIcon(1);
                    break;
                case 40:
                    swapIcon(3);
                    break;
            }
        });

        $(document).keyup(function (e) {
            switch (e.which) {
                case 37:
                    returnIcon(0);
                    break;
                case 38:
                    returnIcon(2);
                    break;
                case 39:
                    returnIcon(1);
                    break;
                case 40:
                    returnIcon(3);
                    break;
            }
        });
    };

    function printString(text) {
        var output = document.getElementById("output");
        text = text.replace(/</g, '&lt;');
        output.innerHTML = output.innerHTML + text;
    }

    function clearOutput() {
        var output = document.getElementById("output");
        output.innerHTML = '';
    }

    function builtinRead(x) {
        if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
            throw "File not found: '" + x + "'";
        return Sk.builtinFiles["files"][x];
    }
   

    (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'mypgcanvas'+n;
    Sk.configure({read: builtinRead, output: printString});
   	
   	Sk.main_canvas = document.createElement("canvas");
        Sk.quitHandler = function () {
            $('.modal').modal('hide');
        };
        addModal();
   	Sk.misceval.asyncToPromise(function () {
            try {
                return Sk.importMainWithBody("<stdin>", false, prog, true);
            } catch (e) {
                alert(e)
            }
        });
   }
}





function runHTML(n){
	 var codeHTML = editorHTML[n].getValue();
	 var iframeHTML = document.getElementById('sortieHtml'+n);
	 iframeHTML.contentWindow.document.open();
	 iframeHTML.html = "";
	 iframeHTML.contentWindow.document.write( editorHTML[n].getValue() );
	 iframeHTML.contentWindow.document.close();
}



function mathpad(){
	
	// Checked box
	//localStorage.removeItem("checked"+document.URL);
	
	if (!localStorage.getItem("checked"+document.URL) ){
		localStorage.setItem("checked"+document.URL, ["00000000000000000000000000000000000000000000000000000000000000000000000000000000000"]);
		}
		
	$('.check-box').each(function(i){
		$(this).attr('id',"check_"+i);
    	$(this).on('click', function (){changeChecked(i)});
    	//console.log(i);
	});
	
	let n = $('.check-box').length;
	
	for(var i = 0; i < n ; i++){
		let nom = "check_"+i;
    	let elt = document.getElementById(nom);
    	console.log(localStorage.getItem("checked"+document.URL)[i]);
    	if(localStorage.getItem("checked"+document.URL)[i] == 1){
    		elt.checked = true;
        	//console.log(i+" checked");
    	}
    	else{
    		elt.checked = false;
    	}
	}
	
	
	function changeChecked(n){
		let nom = "check_"+n;
		let elt = document.getElementById(nom);
    	listChecked = localStorage.getItem("checked"+document.URL);
    	val = (parseInt(listChecked[n])+1)%2;
    	listChecked = listChecked.substring(0,n)+val+listChecked.substring(n+1);
		localStorage.setItem("checked"+document.URL, listChecked);
	}
	
	
	// Fin checked box
			
	
	// Les couleurs à modifier en fonction du thème	
	
	if ( themesGraphique[theme] == undefined ) { theme = 'classique';}	
	$bgBody = themesGraphique[theme]['fondPage'];
	$couleurFondPara = themesGraphique[theme]['fondPara'];
	$couleurTextePara = themesGraphique[theme]['textePara'];
	$couleurNumPara = themesGraphique[theme]['numPara'];
	$texteProp = themesGraphique[theme]['texteProp'];
	$couleurTitrePartie = themesGraphique[theme]['titrePartie'];
	$couleurTexteTitrePartie = themesGraphique[theme]['texteTitrePartie'];
	$couleurCorrection = themesGraphique[theme]['fondCorrection'];
	$barreCorrection = themesGraphique[theme]['barreBtnCorr'];
	$fondCorrection = themesGraphique[theme]['fondBtnCorr'];
	$fondCode = themesGraphique[theme]['fondCode'];
	$texteCode = themesGraphique[theme]['texteCode'];
	
	
	
	// Pour faire apparaître les zones de clic pour compléter ou effacer les "trous" dans le texte
		
	$("body").after("<div class='clicGauche' onclick='retourne()'></div>");
	$("body").after("<div class='clicDroit' onclick='avance()'></div>");
	$("body").css("background-color", $bgBody);
	
	$("al").css("list-style-type", "lower-latin;");

	$("titre").css("border-radius","0px");
	$("titre").css("color",$couleurTextePara);
	$("titre").css("width", "100%");
	$("titre").css("font-size", "180%");
	$("titre").css("font-weight", "bold");
	$("titre").css("text-align", "center");
	$("titre").css("padding-bottom", "10px");
	$("titre").css("padding-top", "10px");
	$("titre").css("background-color", $couleurFondPara);
	$("titre").css("margin-bottom", "20px");
	$("titre").css("box-shadow", "0px 1px 2px rgba(0, 0, 0, 0.29)");
	$("titre").css("width", "100%");

	$("cadre").css("border-radius","0px");
	$("cadre").css("color",$couleurTextePara);
	$("cadre").css("width", "100%");
	$("cadre").css("background-color", $couleurFondPara);
	$("cadre").css("box-shadow", "0px 1px 2px rgba(0, 0, 0, 0.29)");
	$("cadre").css("padding","2px");

	$("gris").css("border-radius","3px");
	$("gris").css("color","black");
	$("gris").css("width", "100%");
	$("gris").css("background-color", "#f0f0f0");
	$("gris").css("padding","4px");
	$("gris").css("margin-bottom","10px");
	$("gris").css("margin-top","10px");

	$("exercice").each(function(i){
		j=i+1;
		$(this).css("padding","2px");
		$(this).css("padding-left","7px");
		$(this).css("background-color",$couleurFondPara);
		$(this).css("box-shadow","0px 1px 2px rgba(0, 0, 0, 0.29)");
		$(this).css("border-radius","0px");
		$(this).css("color",$texteProp);
		$(this).prepend("<span style='font-weight:bold;'>Exercice " + j+"</span>");
		});

	$("exemple").each(function(i){
		j=i+1;
		$(this).css("padding","2px");
		$(this).css("padding-left","7px");
		$(this).css("background-color",$couleurFondPara);
		$(this).css("box-shadow","0px 1px 2px rgba(0, 0, 0, 0.29)");
		$(this).css("border-radius","0px");
		$(this).css("color",$texteProp);
		$(this).prepend("<span style='font-weight:bold;'>Exemple " + j+"</span>");});

	$("def").each(function(i){
		j=i+1;           
		$(this).css("border","solid 1px "+$couleurFondPara);
		$(this).css("background-color",$couleurFondPara);
		$(this).css("padding","5px");
		$(this).css("box-shadow","0px 1px 2px rgba(0, 0, 0, 0.29)");
		$(this).css("border-radius","0px");
		$(this).css("color",$texteProp);
		if( navigator.languages[0] == "fr" || navigator.languages[0] == "fr-FR" || navigator.languages[0] == "fr-fr" ){
			$(this).prepend("<span class='prop' >Définition " + j+"</span>");
		}
		else {
			$(this).prepend("<span class='prop' >Definition " + j+"</span>");}
		}
	);

	$("prop").each(function(i){
		j=i+1;
		$(this).css("background-color",$couleurFondPara);           
		$(this).css("border","solid 1px "+$couleurFondPara);
		$(this).css("padding","5px");
		$(this).css("box-shadow","0px 1px 2px rgba(0, 0, 0, 0.29)");
		$(this).css("color","#000000");
		$(this).css("border-radius","0px");
		$(this).css("color",$texteProp);
		if( navigator.languages[0] == "fr" || navigator.languages[0] == "fr-FR" || navigator.languages[0] == "fr-fr" ){
			$(this).prepend("<span class='prop'>Propriété " + j+"</span>");
		}
		else {
			$(this).prepend("<span class='prop'>Property " + j+"</span>");
		}
	}
	);

	$("propN").each(function(i){
		j=i+1;
		$(this).css("background-color",$couleurFondPara);           
		$(this).css("border","solid 1px "+$couleurFondPara);
		$(this).css("padding","2px");
		$(this).css("box-shadow","0px 1px 2px rgba(0, 0, 0, 0.29)");
		$(this).css("color","#000000");
		$(this).css("border-radius","0px");
		$(this).css("color",$texteProp);
		if( navigator.languages[0] == "fr" || navigator.languages[0] == "fr-FR" || navigator.languages[0] == "fr-fr" ){
			$(this).prepend("<span class='prop'>Propriété " + j+"</span>");
		}
		else {
			$(this).prepend("<span class='prop'>Property " + j+"</span>");
		}
	}
	);


	$("propo").each(function(i){
		j=i+1;
		$(this).css("background-color",$couleurFondPara);           
		$(this).css("border","solid 1px "+$couleurFondPara);
		$(this).css("padding","5px");
		$(this).css("box-shadow","0px 1px 2px rgba(0, 0, 0, 0.29)");
		$(this).css("color","#000000");
		$(this).css("border-radius","0px");
		$(this).css("color",$texteProp);
		$(this).prepend("<span class='prop'>Proposition </span><br />");
		if( navigator.languages[0] == "fr" || navigator.languages[0] == "fr-FR"  || navigator.languages[0] == "fr-fr"){
			$(this).prepend("<span class='prop'>Proposition </span><br />");
		}
		else {
			$(this).prepend("<span class='prop'>Proposition </span><br />");
		}
	}
	);

	$("theo").each(function(i){
		j=i+1;
		$(this).css("background-color",$couleurFondPara);           
		$(this).css("border","solid 1px "+$couleurFondPara);
		$(this).css("padding","5px");
		$(this).css("box-shadow","0px 1px 2px rgba(0, 0, 0, 0.29)");
		$(this).css("border-radius","0px");
		$(this).css("color",$texteProp);		
		if( navigator.languages[0] == "fr" || navigator.languages[0] == "fr-FR" || navigator.languages[0] == "fr-fr" ){
			$(this).prepend("<span class='prop'>Théorème " + j+"</span>");
			}
		else {
			$(this).prepend("<span class='prop'>Theorem " + j+"</span>");
			}
		}
	);

	$("lemme").each(function(i){
		j=i+1;
		$(this).css("background-color",$couleurFondPara);           
		$(this).css("border","solid 1px "+$couleurFondPara);
		$(this).css("padding","5px");
		$(this).css("box-shadow","0px 1px 2px rgba(0, 0, 0, 0.29)");
		$(this).css("border-radius","0px");
		$(this).css("color",$texteProp);		
		if( navigator.languages[0] == "fr" || navigator.languages[0] == "fr-FR" || navigator.languages[0] == "fr-fr" ){
			$(this).prepend("<span class='prop'>Lemme " + j+"</span>");
			}
		else {
			$(this).prepend("<span class='prop'>Lemma " + j+"</span>");
			}
		}
	);
	
	
	$("rem").each(function(i){
		j=i+1;
		$(this).css("background-color",$couleurFondPara);
		$(this).css("padding","2px");
		$(this).css("padding-left","7px");
		$(this).css("box-shadow","0px 1px 2px rgba(0, 0, 0, 0.29)");
		$(this).css("border-radius","0px");
		$(this).css("color",$texteProp);		
		if( navigator.languages[0] == "fr" || navigator.languages[0] == "fr-FR" || navigator.languages[0] == "fr-fr" ){
			$(this).prepend("<span style='font-weight:bold;'>Remarque " + j+"</span>");
			}
		else {
			$(this).prepend("<span style='font-weight:bold;'>Remark " + j+"</span>");
			}
		}
	);
	
	
	$("roc").each(function(i){
		$(this).css("display","inline-table");
		$(this).css("width","45px");
		$(this).css("height","45px");
		$(this).css("line-height","45px");
		$(this).css("position","absolute");
		$(this).css("right","10px");
		$(this).css("background-color","rgba(255,0,0,0.5)");
		$(this).css("text-align","center");
		$(this).css("box-shadow","4px 4px 5px #c0c0c0");
		$(this).css("border-radius","45px");
		$(this).html("ROC");
		$(this).css("font-weight","bold");
		$(this).css("color","white");
		});
		
	$('.prop').css("background-color", $couleurTitrePartie);
	$('.prop').css("color", $couleurTexteTitrePartie);
	$('.prop').css("border-left","solid 6px "+$couleurTitrePartie);
	$('.prop').css("border-right","solid 6px "+$couleurTitrePartie);
	$('.prop').css("border-top","solid 6px "+$couleurTitrePartie);


	// Pour créer des slides à la manière d'un beamer LaTeX : on passe les slides en cliquant en haut à gauche ou à droite

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
	
		
	// Une zone d'algorithme, basé sur du Javascript compléter par des instructions en "français", cf https://www.sarmate.free.fr/sarmateScript/sarmate_script.html
	
	$("algo").each(function(i) {
		var dimensionL = 350;
		if( $(this).attr('largeur') ){ dimensionL = $(this).attr('largeur'); }
		if( $(this).attr('width') ){ dimensionL = $(this).attr('width'); }
		var dimensionH = dimensionL;
		if( $(this).attr('hauteur') ){ dimensionH = $(this).attr('hauteur'); }
		if( $(this).attr('height') ){ dimensionH = $(this).attr('height'); }		
		var contenu = $(this).html();
		$(this).empty();		
		contenu = "<div class=\"containHTML\"><textarea id='textareaCode"+i+"' style='display:block;width:350px;height:350px;border:solid 1px black;padding:5px;text-align:left;margin:auto;margin-bottom:10px;resize: none;'>"+contenu+"</textarea></div>";	
		contenu +=  "<div class=\"containHTML\"><a class='btnPython' type='button' onclick='algo("+i+")'>Exécuter</a></div>";	
		//contenu += "<div id='resultats"+i+"' class='sortieHtml'></div>";
		contenu += "<div id='resultats"+i+"' style='width:350px;height:auto;background-color:#f8f8f8;border:solid 1px black;text-align:left;padding:5px;margin:auto;margin-top:10px;'></div>";
		$(this).prepend( contenu );
		var code = $("#textareaCode"+i)[0];
		
		editorCode.push( CodeMirror.fromTextArea(code, {
        //mode: {name: "js"},
        			lineNumbers: true,
        			indentUnit: 4,
        			matchBrackets: true,
        			theme: 'abcdef'
			}));			
		editorCode[i].setSize(dimensionL,dimensionH);		
		}
	);


	// Une zone d'algorithme "graphique", cf https://www.sarmate.xyz/sarmateGraph/sarmate_graph.html
	
	$("algoGraphe").each(function(i) {
		var dimensionL = 350;
		var dimensionLS = 350;
		var vis = "block";		
		if ( $(this).attr('visible') ) { if ($(this).attr('visible')=="non" ) { vis ="none"; } }		
		if( $(this).attr('largeur') ){ dimensionL = $(this).attr('largeur'); }
		if( $(this).attr('width') ){ dimensionL = $(this).attr('width'); }
		if( $(this).attr('largeurSortie') ){ dimensionLS = $(this).attr('largeurSortie'); }		
		var dimensionH = dimensionL;
		var dimensionHS = dimensionLS;		
		if( $(this).attr('hauteur') ){ dimensionH = $(this).attr('hauteur'); }
		if( $(this).attr('height') ){ dimensionH = $(this).attr('height'); }
		if( $(this).attr('hauteurSortie') ){ dimensionHS = $(this).attr('hauteurSortie'); }		
		var contenu = $(this).html();
		$(this).empty();		
		contenu = "<div  class=\"containHTML\"><textarea id='textareaCodeGraphe"+i+"' style='display:"+vis+";width:350px;height:350px;border:solid 1px black;padding:5px;text-align:left;margin:auto;margin-bottom:10px;resize: none;'>"+contenu+"</textarea></div>";	
		contenu +=  "<div class=\"containHTML\"><a class='btnPython' type='button' onclick='algoGraphe("+i+","+dimensionLS+","+dimensionHS+")'>Exécuter</a></div>";	
		
		var newCanvas = $('<canvas/>',{
                    id: 'resultatsGraphe'+i                   
                }).prop({
                    width: dimensionLS,
                    height: dimensionHS,
                });
		newCanvas.css('border','solid 1px black');
		newCanvas.css('margin-left','auto');
		newCanvas.css('margin-right','auto');
		newCanvas.css('margin-top','10px');
		newCanvas.css('display','block');		
		$(this).prepend( contenu );		
		var code = $("#textareaCodeGraphe"+i)[0];		
		editorCodeGraphe.push( CodeMirror.fromTextArea(code, {
        //mode: {name: "js"},
        			lineNumbers: true,
        			indentUnit: 4,
        			matchBrackets: true,
        			theme: 'abcdef'
			}));		
		editorCodeGraphe[i].setSize(dimensionL,dimensionH);
		$(this).append( newCanvas );
		}
	);

	var nbAlgoGrapheInv = -1;
	var dimensionLInv = [];
	var dimensionHInv = [];
	
	// Une zone d'algorithme graphique dans laquelle juste la fenêtre graphique apparaît.
	
	$("algoGrapheInv").each(function(i) {
		nbAlgoGrapheInv = i;
		var dimensionL = 350;
		if( $(this).attr('largeur') ){ 
				dimensionLInv.push( $(this).attr('largeur'));
				dimensionL = $(this).attr('largeur');
			 } 
		else { dimensionLInv.push(350); }
		if( $(this).attr('width') ){ 
				dimensionLInv.push( $(this).attr('width'));
				dimensionL = $(this).attr('width');
		} 
		else { dimensionLInv.push(350); }		
		dimensionH = dimensionL;
		if( $(this).attr('hauteur') ){ 
				dimensionHInv.push( $(this).attr('hauteur'));
				dimensionH = $(this).attr('hauteur');
		 } 
		else { dimensionHInv.push( dimensionL ); }
		if( $(this).attr('height') ){ 
				dimensionHInv.push( $(this).attr('height'));
				dimensionH = $(this).attr('height');
		} 
		else { dimensionHInv.push( dimensionL ); }
		var contenu = $(this).html();
		$(this).empty();		
		contenu = "<textarea id='textareaCodeGrapheInv"+i+"' style='display:none;width:350px;height:350px;border:solid 1px black;padding:5px;text-align:left;margin:auto;margin-bottom:10px;resize: none;'>"+contenu+"</textarea>";	
			
		var newCanvas = $('<canvas/>',{
                    id: 'resultatsGrapheInv'+i                   
                		}).prop({
                    		width: dimensionL,
                    		height: dimensionH,
                		});
		newCanvas.css('border','solid 0px black');
		newCanvas.css('margin-left','auto');
		newCanvas.css('margin-right','auto');
		newCanvas.css('margin-top','10px');
		newCanvas.css('display','block');
		
		$(this).prepend( contenu );
		$(this).append( newCanvas );
		var tabCurseur = [];
		var posCurseur = 0;
		var iCurseur = -1;
		while ( posCurseur !=-1 ){
			posCurseur = contenu.indexOf( "curseur(",iCurseur+1 );
			iCurseur = posCurseur
			if ( posCurseur !=-1 ) { tabCurseur.push( posCurseur ) }
		}
			
	// Curseur : syntaxe --> curseur("n",2,0,5,0.1) --> nom, valeur, min, max, pas
	// pour réutiliser le curseur dans le code {n}
	
		if ( contenu.match("curseur[(]") ) {
			//console.log("Curseur 0 ! ");
			//for (var j = 0; j < tabCurseur.length; j++) {
			var deb = contenu.match("curseur[(]").index;
			var sousContenu = contenu.substring( deb , contenu.length );
			var fin =  sousContenu.match("[)]").index;
			var chaine = sousContenu.substring( 8 , fin );
			var tabInfo = chaine.split(",");
			var newLegende = document.createElement("div");
			newLegende.id = "legende"+i;
			newLegende.style.textAlign = "center";
			newLegende.style.width = dimensionLInv+"px";
			newLegende.style.marginLeft = 'auto';
			newLegende.style.marginRight = 'auto';
			$(this).append( newLegende );
			
			var newInput = document.createElement("input");
			newInput.id = "curseur"+i;
 			newInput.type = "range";
  			newInput.name = tabInfo[0].replace( new RegExp( '\"', 'g' )  ,'' );
  			newInput.value = tabInfo[1];
  			newInput.min = tabInfo[2];
  			newInput.max = tabInfo[3];
  			newInput.step = tabInfo[4];
  			newInput.addEventListener('input', function (){ algoGrapheInv(i,dimensionL,dimensionH); },false );
  			newInput.style.border = "solid 0px black";
			newInput.style.marginLeft = 'auto';
			newInput.style.marginRight = 'auto';
			newInput.style.marginTop = '10px';
			
			var newMessage = document.createElement("span");
			newMessage.innerHTML = newInput.name;
			newMessage.style.padding = "10px";
			
			$("#legende"+i).append( newMessage );
			$("#legende"+i).append( newInput );
			}
	
		}
	);


	// Pour lancer l'éxécution de l'algorithme graphique
	var chargement = "";
	if ( nbAlgoGrapheInv => 0  ) {
		for (var i = 0;i <= nbAlgoGrapheInv;i++ ) {
			chargement += "algoGrapheInv("+i+"," + dimensionLInv[i] + ","+dimensionHInv[i]+");";
			}
		}
	$('body').attr('onload',chargement);
	
	// Pour faire apparaître une fenêtre avec du code html et le résultat d'affichage
	
	$("codeHTML").each(function(i) {
		var dimensionL = 350;
		if( $(this).attr('largeur') ){ dimensionL = $(this).attr('largeur'); }
		if( $(this).attr('width') ){ dimensionL = $(this).attr('width'); }
		var dimensionH = dimensionL;
		if( $(this).attr('hauteur') ){ dimensionH = $(this).attr('hauteur'); }
		if( $(this).attr('height') ){ dimensionH = $(this).attr('height'); }
		
		var css = $(this).find("css").html();
		if ( css == undefined ) { css = ""}		
		var st = "\n<style>\n"+css+"\n</style>\n";		
		var contenu = $(this).find("page").html();
		if ( contenu == undefined ) { contenu = ""}		
		$(this).empty();		
		var codehtml = "<!DOCTYPE html>\n<html>\n<head>\n<meta charset=\"utf-8\" />\n"+st+"\n</head>\n<body>\n"+contenu+"\n</body>\n</html>";
		contenu = "<div class='containHTML'><textarea id='textareaHtml"+i+"' class='inputHTML'>"+codehtml+"</textarea></div>";	
		contenu +=  "<div class=\"containHTML\"><a class='btnPython' type='button' onclick='runHTML("+i+")'>Exécuter</a></div>";
		contenu += "<div class='sortieHtml'><iframe id='sortieHtml"+i+"' class='outputHTML'></iframe></div>";
		contenu += "<script>$('#textareaHtml"+i+"').focus(function () { var $this = $(this);$this.keyup(function () {iframe = document.getElementById('sortieHtml"+i+"');iframe.contentWindow.document.open();iframe.html = \"\";iframe.contentWindow.document.write( editorHTML["+i+"].getValue() );iframe.contentWindow.document.close();});});</script>";
		$(this).prepend( contenu );
		var code = $("#textareaHtml"+i)[0];
	
		editorHTML.push( CodeMirror.fromTextArea(code, {
        mode: {name: "text/html"},
        			lineNumbers: true,
        			indentUnit: 4,
        			matchBrackets: true,
        			theme: 'abcdef'
			}));
		editorHTML[i].setSize(dimensionL,dimensionH);
		}
	);


	// Les zones de réponses des élèves pour les devoirs maison en ligne
	
	$("repel").each(function(i) {
		var css = $(this).find("css").html();
		if ( css == undefined ) { css = ""}
		var st = "\n<style>\n"+css+"\n</style>\n";
		var contenu = $(this).find("page").html();
		if ( contenu == undefined ) { contenu = ""}
		$(this).empty();
		contenu = "<div style='width:100%;text-align:center;'><textarea name='q'"+i+" rows='10' cols='50' ></textarea></div>";	
		contenu += "<div style='width:100%;text-align:center;margin-top:10px;'><div id='sortieEl"+i+"' style='margin: auto;padding:3px;text-align: left;width:350px;height:350px;border: solid 1px black;'></div></div>";
		contenu += "<script>$('#q"+i+"').focus(function () { var $this = $(this);$this.keyup(function () {iframe = document.getElementById('sortieEl"+i+"');iframe.innerHTML = $this.val();MathJax.Hub.Queue([\"Typeset\",MathJax.Hub]); } ); });</script>";
		$(this).prepend( contenu );
		}
	);
	
	// Une zone de code Python, cf https://www.sarmate.free.fr/sarmatePython/sarmate_python.html
	
	$("python").each(function(i) {
		console.log("Python n° "+i);
		var dimensionL = 350;
		if( $(this).attr('largeur') ){ dimensionL = $(this).attr('largeur'); }
		if( $(this).attr('width') ){ dimensionL = $(this).attr('width'); }
		var dimensionH = dimensionL;
		if( $(this).attr('hauteur') ){ dimensionH = $(this).attr('hauteur'); }
		if( $(this).attr('height') ){ dimensionH = $(this).attr('height'); }
		var th = 'abcdef';
		if( $(this).attr('theme') ){ th = $(this).attr('theme'); }
		var codePython = $(this).html();
		$(this).empty();
		var contenu = "<div class=\"containPython\"><textarea id='yourcode"+i+"' class='inputPython'>"+codePython+"</textarea></div>";
		contenu +=  "<div class=\"containPython\"><a class='btnPython' style=\"width:"+dimensionL+"px\" type='button' onclick='runit("+i+")'>Exécuter</a></div>";
		contenu += "<div id='mycanvas"+i+"' class='tortue'></div><pre id='output"+i+"' class='outputPython' style=\"width:"+(dimensionL-20)+"px\"></pre>";
		contenu += "<div id='mypgcanvas"+i+"'</div>"; 
		contenu += "<script>function outf"+i+"(text) {var mypre = document.getElementById(\"output"+i+"\");mypre.innerHTML = mypre.innerHTML + text;}</script>";
		$(this).prepend( contenu );
		var code = $("#yourcode"+i)[0];
		editorPython.push( CodeMirror.fromTextArea(code, {
        mode: {name: "text/x-cython",
               version: 3,
               singleLineStringErrors: false},
        			lineNumbers: true,
        			indentUnit: 4,
        			matchBrackets: true,
        			theme: th
			}));
		editorPython[i].setSize(dimensionL,dimensionH);
		}
	);
	
	
	$(".btnPython").css("background-color", $fondCorrection);
	$(".btnPython").css("color", $barreCorrection);
	$(".outputPython").css("background-color", $fondCode);
	$(".outputPython").css("color", $texteCode);
	
	$("pythonImpr").each(function(i) {
		var dimensionL = 350;
		if( $(this).attr('largeur') ){ dimensionL = $(this).attr('largeur'); }
		if( $(this).attr('width') ){ dimensionL = $(this).attr('width'); }
		var dimensionH = dimensionL;
		if( $(this).attr('hauteur') ){ dimensionH = $(this).attr('hauteur'); }
		if( $(this).attr('height') ){ dimensionH = $(this).attr('height'); }
		var codePython = $(this).html();
		$(this).empty();
		var contenu = "<div class=\"containPython\"><textarea id='yourcode2"+i+"' class='inputPython'>"+codePython+"</textarea></div>";
		$(this).prepend( contenu );
		var code = $("#yourcode2"+i)[0];
		editorPythonImpr.push( CodeMirror.fromTextArea(code, {
        mode: {name: "text/x-cython",
               version: 3,
               singleLineStringErrors: false},
        			lineNumbers: true,
        			indentUnit: 4,
        			matchBrackets: true,
        			theme: 'default'
			}));
		editorPythonImpr[i].setSize(dimensionL,dimensionH);
		}
	);


	$("paragraphe").each(function(i){
		j=i+1;
		$(this).nextUntil("paragraphe","subparagraphe").each(function(k){
			var l = k+1;
			$(this).prepend("<span class='numSubPara'>"+j+"."+ l +"</span>");
			});
		$(this).nextUntil("paragraphe","subparagraphe").css("background-color",$couleurFondPara);
		$(this).nextUntil("paragraphe","subparagraphe").css("color",$couleurTextePara);
		$(this).nextUntil("paragraphe","subparagraphe").css("padding","0px");
		$(this).nextUntil("paragraphe","subparagraphe").css("border-radius","0px");
		$(this).nextUntil("paragraphe","subparagraphe").css("font-weight","bold");
		$(this).nextUntil("paragraphe","subparagraphe").css("box-shadow","0px 1px 2px rgba(0, 0, 0, 0.29)");
		//$(this).css("border-left","solid 15px #d3ddf5");
		$(this).css("background-color",$couleurFondPara);
		$(this).css("color",$couleurTextePara);
		$(this).css("padding","0px");
		$(this).css("border-radius","0px");
		$(this).css("box-shadow","0px 1px 2px rgba(0, 0, 0, 0.29)");
		$(this).css("font-weight","bold");
		$(this).prepend("<span class=\"numPara\">"+j+"</span>");
		});

	$('.numPara').css("background-color", $couleurTitrePartie);
	$('.numPara').css("color", $couleurNumPara);
	$('.numSubPara').css("background-color", $couleurTitrePartie);
	$('.numSubPara').css("color", $couleurNumPara);
	
	// Balise permettant de ne pas afficher son contenu, jusqu'au clic correspondant
	
	$("pause").each(function(i){
		var cont = $(this).html();
		$(this).html('');
		$(this).prepend("<div id='trou_"+i+"' class='trou'>"+ cont +"</div>");
		maxTrou = i;
		});


	// Une zone de correction déroulable
	
	$("correction").each(function(i){
		var cont = $(this).html();
		$(this).html('');
		$(this).prepend("<a class=\"btnCorr\" onclick='corrige("+i+")'>Correction</a><div id='correction_"+i+"' class='correction'><div class='intCorr'>"+ cont +"</div><a class='clos' style='display:block;' onclick='decorrige("+i+")'>✕</a></div>");
		});
	
	$(".intCorr").css("background-color",$couleurCorrection);
	$(".btnCorr").css("background-color", $fondCorrection);
	$(".btnCorr").css("border-left", "solid 6px "+$barreCorrection);
	$(".btnCorr").css("color", $barreCorrection );
	$(".clos").css("border-right", "solid 6px "+$barreCorrection);
	$(".clos").css("color", $barreCorrection);
	$(".clos").css("background-color", $fondCorrection);
	
	$("rouge").css("color","#ff0000");
	$("bleu").css("color","#2e2efe");
	$("vert").css("color","#31b404");
	
	$("centre").css("text-align","center");
	$("centre").css("display","block");
	
	$("gras").css("font-weight","bold");
	$("italic").css("font-style","italic");
	$("souligne").css("text-decoration","underline");
	

	// Affiche le nombre d'espace horizontaux entré
	
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
	
	// Les tableaux de variations !
	
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
	});
	
	
	// Balises en anglais
	
	$("title").css("border-radius","0px");
	$("title").css("color",$couleurTextePara);
	$("title").css("width", "100%");
	$("title").css("font-size", "180%");
	$("title").css("font-weight", "bold");
	$("title").css("text-align", "center");
	$("title").css("padding-bottom", "10px");
	$("title").css("padding-top", "10px");
	$("title").css("background-color", $couleurFondPara);
	$("title").css("margin-bottom", "20px");
	$("title").css("box-shadow", "0px 1px 2px rgba(0, 0, 0, 0.29)");
	$("title").css("width", "100%");

	$("framed").css("border-radius","0px");
	$("framed").css("color",$couleurTextePara);
	$("framed").css("width", "100%");
	$("framed").css("background-color", $couleurFondPara);
	$("framed").css("box-shadow", "0px 1px 2px rgba(0, 0, 0, 0.29)");
	$("framed").css("padding","2px");

	$("grey").css("border-radius","3px");
	$("grey").css("color","black");
	$("grey").css("width", "100%");
	$("grey").css("background-color", "#f0f0f0");
	$("grey").css("padding","4px");
	$("grey").css("margin-bottom","10px");
	$("grey").css("margin-top","10px");
	
	$("red").css("color","#ff0000");
	$("blue").css("color","#2e2efe");
	$("green").css("color","#31b404");
	
	$("center").css("text-align","center");
	$("center").css("display","block");
	
	$("bold").css("font-weight","bold");
	$("underline").css("text-decoration","underline");
	
	$("credits").addClass( "legende" );
	
	
	$("example").each(function(i){
	j=i+1;
	$(this).css("padding","2px");
	$(this).css("padding-left","7px");
	$(this).css("background-color",$couleurFondPara);
	$(this).css("box-shadow","0px 1px 2px rgba(0, 0, 0, 0.29)");
	$(this).css("border-radius","0px");
	$(this).css("color",$texteProp);
	$(this).prepend("<span style='font-weight:bold;'>Example " + j+"</span>");});

	$("paragraph").each(function(i){
		j=i+1;
		
		$(this).nextUntil("paragraph","subparagraph").each(function(k){
				var l = k+1;
				$(this).prepend("<span class='numSubPara'>"+j+"."+ l +"</span>");
		});
		$(this).nextUntil("paragraph","subparagraph").css("background-color",$couleurFondPara);
		$(this).nextUntil("paragraph","subparagraph").css("color",$couleurTextePara);
		$(this).nextUntil("paragraph","subparagraph").css("padding","0px");
		$(this).nextUntil("paragraph","subparagraph").css("border-radius","0px");
		$(this).nextUntil("paragraph","subparagraph").css("font-weight","bold");
		$(this).nextUntil("paragraph","subparagraph").css("box-shadow","0px 1px 2px rgba(0, 0, 0, 0.29)");
		
		//$(this).css("border-left","solid 15px #d3ddf5");
				
		$(this).css("background-color",$couleurFondPara);
		$(this).css("color",$couleurTextePara);
		$(this).css("padding","0px");
		$(this).css("border-radius","0px");
		$(this).css("box-shadow","0px 1px 2px rgba(0, 0, 0, 0.29)");
		$(this).css("font-weight","bold");
		$(this).prepend("<span class=\"numPara\">"+j+"</span>");
		});
	
	$('.numPara').css("background-color", $couleurTitrePartie);
	$('.numPara').css("color", $couleurNumPara);
	$('.numSubPara').css("background-color", $couleurTitrePartie);
	$('.numSubPara').css("color", $couleurNumPara);
	
	
	
	// Fin balises en anglais
	
	
	$('.clicGauche').remove();
	$('.clicDroit').remove();
}




