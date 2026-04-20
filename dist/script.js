let hits = 0;
let gameActive = false;
let ammoImageBase64 = ''; 
let targetAnim, shooterAnim;

const target = document.getElementById('target');
const shooter = document.getElementById('shooter');

function moveElement(element, type, duration) {
    let start = null;
    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = (timestamp - start) / duration;
        const width = window.innerWidth - element.offsetWidth;
        const x = (Math.sin(progress * Math.PI * 2 - Math.PI / 2) + 1) / 2 * width;
        element.style.left = x + 'px';
        if (type === 'target') targetAnim = requestAnimationFrame(step);
        else shooterAnim = requestAnimationFrame(step);
    }
    if (type === 'target') targetAnim = requestAnimationFrame(step);
    else shooterAnim = requestAnimationFrame(step);
}

function refreshSettings() {
    cancelAnimationFrame(targetAnim);
    cancelAnimationFrame(shooterAnim);
    target.style.width = target.style.height = document.getElementById('target-size-input').value + 'px';
    shooter.style.width = shooter.style.height = document.getElementById('shooter-size-input').value + 'px';
    moveElement(target, 'target', parseInt(document.getElementById('target-speed-input').value));
    moveElement(shooter, 'shooter', parseInt(document.getElementById('shooter-speed-input').value));
}

document.getElementById('start-btn').onclick = () => {
    hits = 0;
    gameActive = true;
    let timeLeft = parseInt(document.getElementById('input-time').value) || 60;
    document.getElementById('current-hits').innerText = "0";
    document.getElementById('goal-total').innerText = document.getElementById('input-goal').value;
    document.getElementById('time-left').innerText = timeLeft;
    document.getElementById('win-msg').style.display = 'none';
    document.getElementById('game-over-msg').style.display = 'none';

    const timerInterval = setInterval(() => {
        if (!gameActive) { clearInterval(timerInterval); return; }
        timeLeft--;
        document.getElementById('time-left').innerText = timeLeft;
        if (timeLeft <= 0) { gameActive = false; document.getElementById('game-over-msg').style.display = 'block'; }
    }, 1000);
};

function shoot(user, emoteUrl) {
    const ammoSize = document.getElementById('ammo-size-input').value;
    const ammoSpeed = parseInt(document.getElementById('ammo-speed-input').value);
    const ammo = document.createElement('div');
    ammo.className = 'ammo';
    ammo.style.left = (shooter.offsetLeft + (shooter.offsetWidth / 2) - (ammoSize / 2)) + 'px';
    ammo.style.bottom = '80px';
    ammo.style.width = ammo.style.height = ammoSize + 'px';

    if (emoteUrl) { 
        ammo.style.backgroundImage = `url(${emoteUrl})`; 
        ammo.style.backgroundColor = 'transparent'; 
    } else if (ammoImageBase64) { 
        ammo.style.backgroundImage = `url(${ammoImageBase64})`; 
        ammo.style.backgroundColor = 'transparent'; 
    }

    document.body.appendChild(ammo);

    let start = null;
    const endBottom = window.innerHeight - target.offsetTop - (target.offsetHeight / 2);
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / ammoSpeed, 1);
        ammo.style.bottom = (80 + (endBottom * progress)) + 'px';
        if (progress < 1) { requestAnimationFrame(animate); } else {
            const aR = ammo.getBoundingClientRect();
            const tR = target.getBoundingClientRect();
            if (!(aR.right < tR.left || aR.left > tR.right)) {
                hits++;
                document.getElementById('current-hits').innerText = hits;
                target.style.animation = 'hit-shake 0.2s ease';
                setTimeout(() => target.style.animation = '', 200);
                if (hits >= parseInt(document.getElementById('goal-total').innerText)) {
                    gameActive = false;
                    document.getElementById('win-msg').style.display = 'block';
                }
            }
            ammo.remove();
        }
    }
    requestAnimationFrame(animate);
}

document.getElementById('connect-btn').onclick = () => {
    const channel = document.getElementById('channel-input').value || "The_Lightling";
    ComfyJS.onCommand = (user, command, message, flags, extra) => {
        if (command === "shoot" && gameActive) {
            let url = extra.emotes ? `https://static-cdn.jtvnw.net/emoticons/v2/${Object.keys(extra.emotes)[0]}/default/dark/3.0` : null;
            shoot(user, url);
        }
    };
    ComfyJS.onChat = (user, message, flags, self, extra) => {
        if (gameActive && document.getElementById('emote-trigger-check').checked && extra.emotes) {
            let url = `https://static-cdn.jtvnw.net/emoticons/v2/${Object.keys(extra.emotes)[0]}/default/dark/3.0`;
            shoot(user, url);
        }
    };
    ComfyJS.Init(channel);
    document.getElementById('status').innerText = "Connected!";
};

document.getElementById('target-upload').onchange = (e) => {
    const reader = new FileReader();
    reader.onload = (ev) => { target.style.backgroundImage = `url(${ev.target.result})`; target.style.backgroundColor="transparent"; };
    reader.readAsDataURL(e.target.files[0]);
};
document.getElementById('shooter-upload').onchange = (e) => {
    const reader = new FileReader();
    reader.onload = (ev) => { shooter.style.backgroundImage = `url(${ev.target.result})`; shooter.style.backgroundColor="transparent"; };
    reader.readAsDataURL(e.target.files[0]);
};
document.getElementById('ammo-upload').onchange = (e) => {
    const reader = new FileReader();
    reader.onload = (ev) => { ammoImageBase64 = ev.target.result; };
    reader.readAsDataURL(e.target.files[0]);
};

document.querySelector('.toggle-controls').onclick = () => {
    const c = document.querySelector('.controls');
    c.style.display = c.style.display === 'block' ? 'none' : 'block';
};

document.querySelectorAll('input[type="number"]').forEach(i => i.onchange = refreshSettings);
refreshSettings();