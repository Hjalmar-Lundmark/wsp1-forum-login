const button = document.querySelector('.navbar__button');

button.addEventListener('click', function(event) {
    const menu = document.querySelector('.navbar__collapse');
    menu.classList.toggle('navbar__collapse--show');
});