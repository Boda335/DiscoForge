const boxen = require('boxen').default;
const gradient = require('gradient-string').default;
const chalk = require('chalk');

const coolGradient = gradient(['#00fffe', '#f30dff']);
async function intro() {
  const asciiArt = `
██████╗ ██╗███████╗ ██████╗ ██████╗     ███████╗ ██████╗ ██████╗  ██████╗ ███████╗
██╔══██╗██║██╔════╝██╔════╝██╔═══██╗    ██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝
██║  ██║██║███████╗██║     ██║   ██║    █████╗  ██║   ██║██████╔╝██║  ███╗█████╗  
██║  ██║██║╚════██║██║     ██║   ██║    ██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝  
██████╔╝██║███████║╚██████╗╚██████╔╝    ██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗
╚═════╝ ╚═╝╚══════╝ ╚═════╝ ╚═════╝     ╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝
`;

  const footerText = chalk.bold('DiscoForge v2.5.0 | The Ultimate Discord Bot toolkit!');

  const message = `${coolGradient.multiline(asciiArt)}\n${footerText}`;

  console.log(
    boxen(message, {
      padding: 1,
      margin: 1,
      borderStyle: 'doubleSingle',
      borderColor: 'green',
      textAlignment: 'center',
    })
  );
}

module.exports =  intro ;