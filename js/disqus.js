/**
    *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
    *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables    */

var disqus_config = function () {
    var PAGE_URL = 'https://santoslopez.github.io';
    var PAGE_IDENTIFIER = PAGE_URL;
    this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
    this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
};
        
(function() { // DON'T EDIT BELOW THIS LINE
    var $d = document, 
    $s = $d.createElement('script');
                  
    //page create in disqus 
    $s.src = 'https://santoslopez.disqus.com/embed.js';
    $s.setAttribute('data-timestamp', +new Date());
    ($d.head || $d.body).appendChild($s);
})();

/**
 * Por alguna razon la version que presenta Disqus al dia 30 de diciembre de 2021, en la funcion
 * no tiene los simbolos de dolar, sin embargo con esa configuracion no funciona.
 * 
 * Disqus no carga si se tiene colocado con la opcion de load de javascript para cargar otra pagina externa
 */
        
