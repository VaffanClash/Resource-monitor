const { ipcRenderer } = require('electron');

const systemInfo = require('systeminformation');
const fs = require('fs');
const path = require('path');

// temporary
const version = '1.1.0';

/* -------------------------------------------- */
const settingsBtn = document.querySelector('#settingsBtn');

const CPUTemp = document.querySelector('#cpu_temp');
const CPUUsage = document.querySelector('#cpu_usage');
const GPUTemp = document.querySelector('#gpu_temp');
const GPUUsage = document.querySelector('#gpu_usage');
const GPUFan = document.querySelector('#gpu_fan');

const selectGpu = document.getElementsByName('selectGpu')[0];
console.log('selectGpu: ', selectGpu);

systemInfo.powerShellStart();

//* read settings file
let settings = JSON.parse(fs.readFileSync('./settings.json', 'utf8'));
console.log('settings: ', settings.dedicatedGpu);

//* receive message to know when to update settings
ipcRenderer.on('updateSettings', (event, message) => {
  console.log('message received');
  settings = JSON.parse(fs.readFileSync('./settings.json', 'utf8'));
  console.log(settings);
})

//* open settings page when clicking settings button
settingsBtn.addEventListener('click', () => {
  console.log('clicked');
  
  // Send a message to the main process to open the second window
  ipcRenderer.send('openSecondWindow');
});

/**--------------------------------------------
 *        MAIN RESOURCE MONITOR FUNCTIONING
 *---------------------------------------------**/

const updateGpuTemp = () => {
  systemInfo.graphics().then((tmp) => {
    const data = tmp.controllers[settings.dedicatedGpu];

    // set temperature
    GPUTemp.textContent = data.temperatureGpu + '°';

    // set fanspeed
    // sometimes fanSpeed returns undefined so here is a little check for that (: undefined whill just do nothing if fanSpeed is undefined)
    data.fanSpeed !== undefined ? (GPUFan.textContent = data.fanSpeed + '%') : undefined;

    // set usage
    GPUUsage.textContent = data.utilizationGpu + '%';
  });
  setTimeout(updateGpuTemp, 1000);
};
updateGpuTemp();

const updateCpuTemp = () => {
    systemInfo.cpuTemperature().then((tmp) => {
      CPUTemp.textContent = Math.round(tmp.main) + '°';
      // console.log(tmp.main);
    });
    setTimeout(updateCpuTemp, 1000);
}
updateCpuTemp();

const updateCpuUsage = () => {
  systemInfo.currentLoad().then((tmp) => {
    CPUUsage.textContent = Math.trunc(tmp.currentLoad) + '%';
    // console.log(tmp);
  });
  setTimeout(updateCpuUsage, 1000);
}
updateCpuUsage();

// const update = (apiFunc, component, callback, symbol) => {
//   apiFunc.then((response) => {
//     const value = callback(response);
//     component.textContent = Math.round(value) + symbol;
//   });
// }

// setInterval(function() {
//   update(systemInfo.cpuTemperature(), CPUTemp, response => response.main, '°');
//   update(systemInfo.currentLoad(), CPUUsage, response => response.currentLoad, '%');
//   update(systemInfo.graphics(), GPUTemp, response => response.controllers[settings.dedicatedGpu].temperatureGpu, '°');
//   update(systemInfo.graphics(), GPUFan, response => response.controllers[settings.dedicatedGpu].fanSpeed, '%');
//   update(systemInfo.graphics(), GPUUsage, response => response.controllers[settings.dedicatedGpu].utilizationGpu, '%');
// }, 1000);

// systemInfo.powerShellRelease();
