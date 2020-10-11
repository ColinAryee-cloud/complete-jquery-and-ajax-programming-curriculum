var cart = 0;

function addItem(id, name,description,price,moreInfo){

    let html = '';
    html += '<div class="item" data-id" ' + id + '">';
    html += '<div class="name">' + name + '</div>';
    html += '<img src="assets/food.jpg"></img>';
    html += '<div class="description">' + description + '</div>';
    html += '<div class="price">' + price + '</div>';
    html += '<button class="item-add">Add to Cart</button>';
    html += '<button class="item-remove">Remove</button>';
    html += '<br/>';
    html += '<a class="more-info-link" href="#">more-info</a>';
    html += '<div class="more-info">' + moreInfo + '</div>';
    html += '</div>';

    $('#container').prepend(html);
}


$(document).ready(function (){
    $('#button-create-item').on('click',function(){
        let name = $('#input-create-item').val();
        $('#input-create-item').val('');

        let html = '';
        html += '<div class="item">';
        html += '<div class="name">' + name + '</div>';
        html += '<img src="assets/food.jpg"></img>';
        html += '<div class="description">Check this out!!!</div>';
        html += '<div class="price">$10</div>';
        html += ' <button class="item-add">Add to Cart</button>';
        html += '<button class="item-remove">Remove</button>';
        html += '<br/>';
        html += '<a class="more-info-link" href="#">more-info</a>';
        html += '<div class="more-info">Promo!!!</div>';
        html += '</div>';

        $('#container').prepend(html);
    });

    $('#container ').on('click','.more-info-link',function(event){
        event.preventDefault();

        $(this).parent().find('.more-info').fadeToggle(500);

        $(this).animate({"margin-left":10},100)
            .animate({"margin-left":0},100);
    });
    
    $('#container').on('click','.item-remove',function(){
        $(this).parent().remove();
    });

    $.ajax('data/item.json',{
        dataType: 'json',
        contentType: 'application/json',
        cache: false
    })
    .done(function(response){
        let items = response.items;
        items.forEach(function(item){
            addItem(item.id, item.name, item.description, item.price, item.moreInfo);
        })
        console.log(items);
    })
    .fail(function(request,errorType,errorMessage){
        console.log(errorMessage);
    })
    .always(function(){

    });
    $('#container').on('click','.item-add',function(){
        let id = $(this).parent().data('id');
        $.ajax('data/addToCart.json',{
            type: 'post',
            data: { id: id },
            dataType: 'json',
            contentType: 'application/json',
        })
        .done(function(response) {
            if(response.message === 'success') {
                let price = response.price;

                cart += price;

            $('#cart-container').text('$' + cart);
            }
        });
    });
    
    $('#newsletter-checkbox').on('change',function(){
        if ($(this).is(':checked')){
            $('#newsletter-frequency').fadeIn();
        }else{
            $('#newsletter-frequency').fadeOut();
        }
    });
    $('#newletter-checkbox').trigger('change');

    $('#cart-form').on('submit',function(event){
        event.preventDefault();

        let data = { form: $(this).serialize(),
            price: cart};

        $.ajax($(this).attr('action'),{
            type: 'POST',
            data: data
        })
        .done(function(response){
            alert('#feedback-message').text(response.message);
            
        });
    });
});