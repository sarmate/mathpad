

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
&lt;head>
&lt;meta charset="utf-8" />
&lt;meta name="viewport" content="width=device-width, initial-scale=1.0">

&lt;title>&lt;/title>

&lt;!-- JSX Graph-->
&lt;link rel="stylesheet" type="text/css" href="https://jsxgraph.uni-bayreuth.de/distrib/jsxgraph.css" />
&lt;script type="text/javascript" src="https://jsxgraph.uni-bayreuth.de/distrib/jsxgraphcore.js"></script>

&lt;!-- JQuery -->
&lt;script src="https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>

&lt;!-- Python with Skulpt -->
&lt;script src="https://skulpt.org/js/skulpt.min.js" type="text/javascript"></script> 
&lt;script src="https://skulpt.org/js/skulpt-stdlib.js" type="text/javascript"></script>

&lt;!-- CodeMirror -->
&lt;script src="https://www.sarmate.xyz/Cours/codemirror-5.58.3/lib/codemirror.js"></script>
&lt;link rel="stylesheet" href="https://www.sarmate.xyz/Cours/codemirror-5.58.3/lib/codemirror.css">
&lt;link rel="stylesheet" href="https://www.sarmate.xyz/Cours/codemirror-5.58.3/theme/abcdef.css">
&lt;script src="https://www.sarmate.xyz/Cours/codemirror-5.58.3/mode/python/python.js"></script>
&lt;script src="https://www.sarmate.xyz/Cours/codemirror-5.58.3/mode/xml/xml.js"></script>
&lt;script src="https://www.sarmate.xyz/Cours/codemirror-5.58.3/mode/javascript/javascript.js"></script>

&lt;!-- IP Grid -->
&lt;script src="https://www.sarmate.xyz/ipgrid/scripts/jquery-ui-1.9.2.custom.min.js"></script>    
&lt;script src="https://www.sarmate.xyz/ipgrid/scripts/ip.grid.js"></script>
&lt;link href="https://www.sarmate.xyz/ipgrid/css/ip.grid.css" rel="stylesheet" />

&lt;!-- MathPad -->
&lt;link rel="stylesheet" type="text/css" href="https://www.sarmate.xyz/mathpad/mathpad.css" />
&lt;script type="text/javascript" src="https://www.sarmate.xyz/mathpad/mathpad.js"></script>

&lt;script>
var rouge = true;
&lt;/script>


&lt;/head>

&lt;body>





&lt;!-- Katex ------------------------------------------------------------------------>



&lt;link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/katex.min.css">
&lt;script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/katex.min.js" ></script>
&lt;script src="https://cdn.jsdelivr.net/npm/katex@0.10.2/dist/contrib/auto-render.min.js" ></script>
&lt;script>
renderMathInElement(
	document.body,
	{
		delimiters: [
			{left: "$$", right: "$$", display: true},
			{left: "$", right: "$", display: false}
		]
	}
);
&lt;/script>


&lt;/body>
&lt;/html>
</pre>












A tutorial can be find at https://www.sarmate.net




















