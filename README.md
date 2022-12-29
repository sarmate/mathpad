

Mathpad is a javascript library for creating maths web contents.

The officials links are :


<link rel="stylesheet" type="text/css" href="https://sarmate.xyz/mathpad/mathpad.css" />
<script type="text/javascript" src="https://sarmate.xyz/mathpad/mathpad.js"></script>


But you need in your document to add these librarys : JQuery, Skulpt, Mathjax or KaTeX, IPGrid and CodeMirror.

We recommend to use JSXGraph too.



A minimun code page is :


<pre>
&lt;!DOCTYPE html>
&lt;html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title></title>

<!-- JSX Graph-->
<link rel="stylesheet" type="text/css" href="https://jsxgraph.uni-bayreuth.de/distrib/jsxgraph.css" />
<script type="text/javascript" src="https://jsxgraph.uni-bayreuth.de/distrib/jsxgraphcore.js"></script>

<!-- JQuery -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>

<!-- Python with Skulpt -->
<script src="https://skulpt.org/js/skulpt.min.js" type="text/javascript"></script> 
<script src="https://skulpt.org/js/skulpt-stdlib.js" type="text/javascript"></script>

<!-- CodeMirror -->
<script src="https://www.sarmate.xyz/Cours/codemirror-5.58.3/lib/codemirror.js"></script>
<link rel="stylesheet" href="https://www.sarmate.xyz/Cours/codemirror-5.58.3/lib/codemirror.css">
<link rel="stylesheet" href="https://www.sarmate.xyz/Cours/codemirror-5.58.3/theme/abcdef.css">
<script src="https://www.sarmate.xyz/Cours/codemirror-5.58.3/mode/python/python.js"></script>
<script src="https://www.sarmate.xyz/Cours/codemirror-5.58.3/mode/xml/xml.js"></script>
<script src="https://www.sarmate.xyz/Cours/codemirror-5.58.3/mode/javascript/javascript.js"></script>

<!-- IP Grid -->
<script src="https://www.sarmate.xyz/ipgrid/scripts/jquery-ui-1.9.2.custom.min.js"></script>    
<script src="https://www.sarmate.xyz/ipgrid/scripts/ip.grid.js"></script>
<link href="https://www.sarmate.xyz/ipgrid/css/ip.grid.css" rel="stylesheet" />

<!-- MathPad -->
<link rel="stylesheet" type="text/css" href="https://www.sarmate.xyz/mathpad/mathpad.css" />
<script type="text/javascript" src="https://www.sarmate.xyz/mathpad/mathpad.js"></script>

<script>
var rouge = true;
</script>


</head>

<body>





<!-- Katex ------------------------------------------------------------------------>



<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/katex.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/katex.min.js" ></script>
<script src="https://cdn.jsdelivr.net/npm/katex@0.10.2/dist/contrib/auto-render.min.js" ></script>
<script>
renderMathInElement(
	document.body,
	{
		delimiters: [
			{left: "$$", right: "$$", display: true},
			{left: "$", right: "$", display: false}
		]
	}
);
</script>


</body>
</html>
</pre>












A tutorial can be find at https://www.sarmate.net




















