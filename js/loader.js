const loader = document.querySelector('.loader');

window.addEventListener('load', () => {
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1500);
});
