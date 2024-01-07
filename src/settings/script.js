const { ipcRenderer } = require('electron');

const systemInfo = require('systeminformation');

const fs = require('fs');

let settings = {};

/**--------------------------------------------
 *               SELECT GPU
 *---------------------------------------------**/

const selectGpu = document.getElementsByName('selectGpu')[0];
console.log('selectGpu: ', selectGpu);

const getGpus = () => {
    systemInfo.graphics().then((tmp) => {
        console.log(tmp);

        tmp.controllers.forEach((el, i) => {
            //* set all the options
            const option = document.createElement('option');
            option.value = i;
            option.text = el.model;

            selectGpu.appendChild(option);
            console.log(selectGpu.value);

            // this is cause if the gpu will not be changed, it will not send anything to the settings.json. This makes sure something will be sent.
            settings.dedicatedGpu = selectGpu.value;
        })
    })
}
getGpus();

/**--------------------------------------------
 *               SAVE SETTINGS
 *---------------------------------------------**/
const doneBtn = document.querySelector('#done');

// change settings in the object when an option has been selected in the select element
selectGpu.addEventListener('change', () => {
    console.log('change triggered');
    settings.dedicatedGpu = selectGpu.value;
    console.log(settings);
}) 

const saveSettings = function() {
    console.log('save settings function');
    console.log(JSON.stringify(settings));
    fs.writeFileSync('settings.json', JSON.stringify(settings));
}

doneBtn.addEventListener("click", () => {
  console.log("doneBtn clicked");

  //   send a message to the main.js that will then be send to the main page to update the settings
  ipcRenderer.send("updateSettings");

  // save the settings
  saveSettings();

  window.close();
});

module.exports = { saveSettings };
