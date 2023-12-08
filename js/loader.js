const loader = document.querySelector('.loader');
const loaderTitle = document.getElementById('loaderTitle'); // Modification de l'ID pour correspondre à celui dans le HTML

window.addEventListener('load', () => {
    setTimeout(() => {
        loader.classList.add('hidden');
        loaderTitle.classList.remove('hidden');
        setTimeout(() => {}, 1000);
    }, 1500);
});

document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'z' || key === 'q' || key === 'd') {
        loader.classList.add('hidden'); // Ajout de la classe hidden seulement au loader, pas au titre
    }
});
