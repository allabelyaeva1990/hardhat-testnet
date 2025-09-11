const { spawn } = require('child_process');
const path = require('path');

console.log('Запуск Hardhat node...');

// Определяем порт (Railway устанавливает переменную PORT)
const port = process.env.PORT || 8545;

// Запускаем Hardhat node
const hardhat = spawn('npx', [
  'hardhat', 
  'node', 
  '--hostname', '0.0.0.0', 
  '--port', port.toString()
], {
  stdio: 'inherit',
  cwd: __dirname
});

hardhat.on('close', (code) => {
  console.log(`Hardhat node завершился с кодом ${code}`);
  process.exit(code);
});

hardhat.on('error', (err) => {
  console.error('Ошибка запуска Hardhat:', err);
  process.exit(1);
});

// Обработка сигналов завершения
process.on('SIGTERM', () => {
  console.log('Получен SIGTERM, завершаем работу...');
  hardhat.kill();
});

process.on('SIGINT', () => {
  console.log('Получен SIGINT, завершаем работу...');
  hardhat.kill();
});