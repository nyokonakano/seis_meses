// ======================================================
// REFERENCIAS
// ======================================================

const introScreen =
document.getElementById("introScreen");

const passwordScreen =
document.getElementById("passwordScreen");

const experience =
document.getElementById("experience");

const openLetterBtn =
document.getElementById("openLetterBtn");

const passwordBtn =
document.getElementById("passwordBtn");

const passwordInput =
document.getElementById("passwordInput");

const passwordMessage =
document.getElementById("passwordMessage");

const counterContent =
document.getElementById("counterContent");

const music =
document.getElementById("backgroundMusic");

const loveStars =
document.querySelectorAll(".love-star");

const loveMessage =
document.getElementById("loveMessage");

// ======================================================
// INTRO
// ======================================================

openLetterBtn.addEventListener("click", () => {

    introScreen.classList.remove("active");

    passwordScreen.classList.add("active");

});

// ======================================================
// PASSWORD
// ======================================================

const errorMessages = [

    "Mmm... esa no es nuestra fecha 😜",

    "Pista: fue el inicio de algo muy bonito ❤️",

    "La estadística dice que cada intento te acerca más 😂",

    "Creo que alguien olvidó una fecha importante 👀"

];

let errorIndex = 0;

passwordBtn.addEventListener("click", checkPassword);

passwordInput.addEventListener("keypress", (e) => {

    if(e.key === "Enter"){

        checkPassword();

    }

});

function checkPassword(){

    const password =
    passwordInput.value.trim();

    if(password === "08022026"){

        passwordScreen.classList.remove("active");

        experience.classList.add("active");

        startCounter();

        startMusic();

    }

    else{

        passwordMessage.textContent =
        errorMessages[
            errorIndex % errorMessages.length
        ];

        errorIndex++;

        passwordInput.value = "";

    }

}

// ======================================================
// CONTADOR
// ======================================================

function startCounter(){

    const startDate =
    new Date("2026-02-08T00:00:00");

    updateCounter();

    setInterval(updateCounter,1000);

    function updateCounter(){

        const now = new Date();

        const diff =
        now - startDate;

        const days =
        Math.floor(diff / 86400000);

        const hours =
        Math.floor(
            (diff % 86400000)
            / 3600000
        );

        const minutes =
        Math.floor(
            (diff % 3600000)
            / 60000
        );

        const seconds =
        Math.floor(
            (diff % 60000)
            / 1000
        );

        counterContent.innerHTML = `
            <strong>${days}</strong> días<br>
            <strong>${hours}</strong> horas<br>
            <strong>${minutes}</strong> minutos<br>
            <strong>${seconds}</strong> segundos
        `;

    }

}

// ======================================================
// MUSICA
// ======================================================

function startMusic(){

    if(!music) return;

    music.volume = 0.35;

    music.play().catch(() => {

        console.log(
            "El navegador bloqueó autoplay"
        );

    });

}

// ======================================================
// ESTRELLAS
// ======================================================

loveStars.forEach(star => {

    star.addEventListener("click", () => {

        const text =
        star.dataset.love;

        loveMessage.innerHTML = `

            <div class="thought-card">

                ${text}

            </div>

        `;

    });

});

// ======================================================
// CANVAS ESTRELLAS
// ======================================================

const canvas =
document.getElementById("starsCanvas");

if(canvas){

    const ctx =
    canvas.getContext("2d");

    let stars = [];

    resizeCanvas();

    window.addEventListener(
        "resize",
        resizeCanvas
    );

    function resizeCanvas(){

        canvas.width =
        window.innerWidth;

        canvas.height =
        window.innerHeight;

        createStars();

    }

    function createStars(){

        stars = [];

        for(let i = 0; i < 180; i++){

            stars.push({

                x:
                Math.random() *
                canvas.width,

                y:
                Math.random() *
                canvas.height,

                radius:
                Math.random() * 2,

                speed:
                Math.random() * 0.25

            });

        }

    }

    function animate(){

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        stars.forEach(star => {

            star.y += star.speed;

            if(
                star.y >
                canvas.height
            ){

                star.y = 0;

                star.x =
                Math.random() *
                canvas.width;

            }

            ctx.beginPath();

            ctx.arc(

                star.x,
                star.y,
                star.radius,
                0,
                Math.PI * 2

            );

            ctx.fillStyle =
            "white";

            ctx.fill();

        });

        requestAnimationFrame(
            animate
        );

    }

    animate();

}

// ======================================================
// FUTURAS MEJORAS
// ======================================================

// Libro animado
// Rompecabezas
// Cartas desplegables
// Constelaciones
// Modal de fotos
// Efectos cinematográficos
// Final con estrellas formando texto