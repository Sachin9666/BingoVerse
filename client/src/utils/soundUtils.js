export function playAudio(type) {
  if (!window.AudioContext && !window.webkitAudioContext) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.connect(gain);
  gain.connect(context.destination);
  gain.gain.setValueAtTime(0.05, context.currentTime);

  if (type === 'tap') oscillator.frequency.value = 420;
  if (type === 'select') oscillator.frequency.value = 520;
  if (type === 'win') oscillator.frequency.value = 720;
  if (type === 'lose') oscillator.frequency.value = 180;
  if (type === 'opponent') oscillator.frequency.value = 280;
  if (type === 'disconnect') oscillator.frequency.value = 220;

  oscillator.type = 'triangle';
  oscillator.start();
  oscillator.stop(context.currentTime + 0.1);
  setTimeout(() => context.close(), 150);
}

export function vibrateTap() {
  if (navigator.vibrate) {
    navigator.vibrate(20);
  }
}
