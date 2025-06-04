const symbols = ['🐯', '💰', '🍒', '🍀', '🔔'];

const spinBtn = document.getElementById('spin-btn');
const reels = [
  document.getElementById('reel1'),
  document.getElementById('reel2'),
  document.getElementById('reel3'),
];
const resultMessage = document.getElementById('result-message');

spinBtn.addEventListener('click', async () => {
  resultMessage.textContent = 'Girando...';

  try {
    const res = await fetch('http://localhost:5000/api/game/spin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ game: 'fortune-tiger' })
    });

    const data = await res.json();

    if (res.ok) {
      for (let i = 0; i < 3; i++) {
        reels[i].textContent = data.result[i];
      }

      if (data.win) {
        resultMessage.textContent = `🎉 Você ganhou R$${data.amount}!`;
      } else {
        resultMessage.textContent = `😿 Você não ganhou desta vez.`;
      }
    } else {
      resultMessage.textContent = data.msg || 'Erro ao girar.';
    }
  } catch (err) {
    resultMessage.textContent = 'Erro de conexão.';
    console.error(err);
  }
});
