

Mathpad is a javascript library for creating maths web contents.

The officials links are :


<link rel="stylesheet" type="text/css" href="https://sarmate.xyz/mathpad/mathpad.css" />
<script type="text/javascript" src="https://sarmate.xyz/mathpad/mathpad.js"></script>


But you need in your document to add before these links :

<!-- JQuery -->
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>


<!-- MathJax-->
<script type="text/x-mathjax-config">
  MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}});
</script>
<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-MML-AM_CHTML">
</script>



<!-- Python with Skulp -->
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js" type="text/javascript"></script> 
<script src="http://www.skulpt.org/static/skulpt.min.js" type="text/javascript"></script> 
<script src="http://www.skulpt.org/static/skulpt-stdlib.js" type="text/javascript"></script> 




We recommend to use JSX Graph too :

<!-- JSX Graph-->
<link rel="stylesheet" type="text/css" href="https://jsxgraph.uni-bayreuth.de/distrib/jsxgraph.css" />
<script type="text/javascript" src="https://jsxgraph.uni-bayreuth.de/distrib/jsxgraphcore.js"></script>




A minimun code page is :



<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title></title>

<!-- JSX Graph-->
<link rel="stylesheet" type="text/css" href="https://jsxgraph.uni-bayreuth.de/distrib/jsxgraph.css" />
<script type="text/javascript" src="https://jsxgraph.uni-bayreuth.de/distrib/jsxgraphcore.js"></script>


<!-- JQuery -->
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>


<!-- MathJax-->
<script type="text/x-mathjax-config">
  MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}});
</script>
<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-MML-AM_CHTML">
</script>



<!-- Python with Skulp -->
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js" type="text/javascript"></script> 
<script src="https://skulpt.org/static/skulpt.min.js" type="text/javascript"></script> 
<script src="https://skulpt.org/static/skulpt-stdlib.js" type="text/javascript"></script> 


<!-- MathPad -->
<link rel="stylesheet" type="text/css" href="https://sarmate.xyz/mathpad/mathpad.css" />
<script type="text/javascript" src="https://sarmate.xyz/mathpad/mathpad.js"></script>

<script>
var rouge = true;

</script>


</head>

<body>


</body>






List of mathpad tags :



Text :

- <rouge></rouge> to write in red

- <vert></vert> to write in green

- <bleu></bleu> to write in blue

- <souligne></souligne> to underline

- <gras></gras> to write in bold

- <italic></italic> to write in italic

- <centre></centre> to center your text

- <esp>1</esp> create one horizontal space

- <esp>n</esp> create n horizontals spaces


Structure :

- <cadre></cadre> create a box container

- <titre></titre> create a title box

- <exemple></exemple>




















