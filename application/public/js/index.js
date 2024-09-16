var url = 'https://jsonplaceholder.typicode.com/albums/2/photos';
async function fetchWithString() {
    try {
        var respone = await fetch(url);
        var data = await respone.json();
        var htmlString = data.reduce(function (prev, product) {
            return (
                prev +
                `<div class="product-card">
                    <img class="product-img" src="${product.thumbnailUrl}"/>
                    <div class="product-info">
                        <p class="product-title">"${product.title}"</p>
                    </div>
                </div>`
            );
        }, "");
        document.getElementById("product-list").innerHTML = htmlString
        updatePhotoCount(data.length);
    } catch (error) {
        console.log(error);
    }
}


function updatePhotoCount(count) {
    const photoCount = document.getElementById("photo-count");
    photoCount.textContent = "Number of Photos: " + count;

}

function fadeOut(element) {
    element.style.opacity = 0;
    element.style.transition = "opacity 0.2s ease-out";
    element.addEventListener('transitionend', function () {
        element.parentNode.removeChild(element);
        updatePhotoCount(document.getElementsByClassName('product-card').length);
    }, { once: true });
}


fetchWithString();

