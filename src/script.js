const systemInfo = require('systeminformation');

/* -------------------------------------------- */
const CPUTemp = document.querySelector('#cpu_temp');
const CPUUsage = document.querySelector('#cpu_usage');
const GPUTemp = document.querySelector('#gpu_temp');
const GPUUsage = document.querySelector('#gpu_usage');
const GPUFan = document.querySelector('#gpu_fan');

systemInfo.powerShellStart();

const updateGpuTemp = () => {
  systemInfo.graphics().then((tmp) => {
    GPUTemp.textContent = tmp.controllers[0].temperatureGpu + '°';
    GPUFan.textContent = tmp.controllers[0].fanSpeed + '%';
    GPUUsage.textContent = tmp.controllers[0].utilizationGpu + '%';
    // console.log(tmp);
  });
  setTimeout(updateGpuTemp, 1000);
};
updateGpuTemp();

const updateCpuTemp = () => {
    systemInfo.cpuTemperature().then((tmp) => {
      CPUTemp.textContent = Math.round(tmp.main) + '°';
      // console.log(tmp);
    });
    // setTimeout(updateCpuTemp, 1000);
}
updateCpuTemp();

const updateCpuUsage = () => {
  systemInfo.currentLoad().then((tmp) => {
    CPUUsage.textContent = Math.trunc(tmp.currentLoad) + '%';
    console.log(tmp);
  });
  // setTimeout(updateCpuTemp, 1000);
}
updateCpuUsage();

// systemInfo.powerShellRelease();

// systemInfo.cpuTemperature().then(data => console.log(data)).catch(err => console.error(err));
// systemInfo.graphics().then(data => console.log(data)).catch(err => console.error(err));
