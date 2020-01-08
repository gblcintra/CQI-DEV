"use strict";

//Carousel dos produtos

var products = [];
var isFetching = false;

function getProducts(corouselSize) {
    var url = "https://www.clickqi.com.br/api/dataentities/CG/search?_fields=productName,productRating,productListPrice,productBestPrice,productInstallments,productInstallmentsValue,productImage&_sort=productName%20DESC";
    if (isFetching) return;
    isFetching = true;
    fetch(url)
        .then(
            function(resp) {
                return resp.json();
            }
        )
        .then(
            function(resp)  {
                products = resp;
                var el = document.getElementById("carousel");
                el.innerHTML = makeCarousel(corouselSize, products);
                isFetching = false;
            }
        )
        .catch(
            function(error) {
                console.log(error);
                isFetching = false;
            }
        );
}

function makeCarousel(corouselSize, products) {
    var carouselItems = products.length;
    var carouselViews = Math.round(carouselItems / corouselSize);

    var prodIndex = 0;

    var html = "";

    for(var view = 1; view <= carouselViews; view++) {
        var vieweActive = "";
        if (view == 1) {
            vieweActive = "active";
        }
        html +=  "<div class='item carousel-item " + vieweActive + "'>";
        html +=  "  <div class='row'>"; 

        for (var index = 1; index <= corouselSize; index++) {
            html +=  "  " + makeItem(products[prodIndex]);
            prodIndex++;
            if (prodIndex >= carouselItems) {
                break;
            }
        }

        html += "   </div>";
        html += "</div>";
    }

    document.getElementById('indicators').innerHTML = makeCarouselIndicators(carouselViews);

    return html;
}


//Indicadores do carousel
function makeCarouselIndicators(carouselViews) {
    var html = "";

    for (var view = 1; view <= carouselViews; view++) {
        var vieweActive = "";
        if (view == 1) {
            vieweActive = "active";
        }
        html += "  <li data-target='#myCarousel' data-slide-to='" + (view - 1) + "' class='" + vieweActive + "'></li>"; 
    }

    return html;
}

//Listagem de produtos
function makeItem(product) {
    var html = "";
    html += "    <div class='col-sm-3'>";
    html += "      <div class='thumb-wrapper'>";
    html += "      " + makeDivImage(product.productImage);
    html += "      </div>";
    html += "      <div class='thumb - content e'>";
    html += "        <h4>" + product.productName + "</h4>";
    html += "      " + makeDivRating(product.productRating);
    html += "      " + makeDivPrice(product.productListPrice, product.productBestPrice, product.productInstallments, product.productInstallmentsValue);
    html += "        <a href='#'><button class='btn btn-outline-dark'>Comprar</button></a>";
    html += "      </div>";
    html += "    </div>";
    return html;
}

//Pegar imagem do produto
function makeDivImage(image) {
    var html = "";
    html += "        <div class='img-box'>"
    html += "          <img src='" + image + "' class='img - responsive img - fluid' alt=''>"
    html += "        </div>";
    return html;
}


//Pegar avaliação do produto
function makeDivRating(rating) {
    var starts = parseInt(rating / 10);
    var html = "";
    html += "<div class='star-rating'>";
    html += "  <ul class='list-inline'>";
    for(var i = 1; i <= starts; i++) {
        html += "    <li class='list-inline-item'><i class='fa fa-star'></i></li>";
    }
    for(var i = 1; i <= (5 - starts); i++) {
        html += "    <li class='list-inline-item'><i class='fa fa-star-o'></i></li>";
    }
    html += "  </ul>";
    html += "</div>";
    return html;
}


//Pegar preço, melhor preço, parcelas e valores das parcelas do produto
function makeDivPrice(listPrice, bestPrice, installments, installmentsValue) {
    var html = "";
    html +=  "<p class='item-price'>"
    if (listPrice != '0') {
        html += "    <strike>R$ " + (listPrice / 100).toFixed(2) + "</strike>"
    }
    html += "    <span>R$ " + (bestPrice / 100).toFixed(2) +"</span>"
    html += "</p>";
    if (installments != '0') {
        html += "<p>ou em <span>" + installments + "</span>x de R$ <span>" + (installmentsValue / 100).toFixed(2) +"</span></p>"
    }
    return html;
}



//Arrumar resolução da tela para carousel de produtos
window.onload = function() {
    calcCarouselSize()
}

window.onresize = function() {
    calcCarouselSize()
}

function calcCarouselSize() {
    var width = window.innerWidth;
    if (width <= 575) {
        getProducts(1);
    } else if (width < 768) {
        getProducts(3);
    } else {
        getProducts(4);
    }
}