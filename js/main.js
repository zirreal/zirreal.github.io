document.addEventListener("DOMContentLoaded", () => {


  // description message
  const msgContainer = document.querySelector('.description');

  // select with chips
  const chips = document.querySelector('select[name="chip"]');

  // select with firmware 
  const firmware = document.querySelector('select[name="firmware"]');



  firmware.addEventListener("change", (e) => {
    const button = document.querySelector('.select-wrapper').querySelector('esp-web-install-button');
    button.manifest = `manifest/${e.target.value}.manifest.json`;
    addManifestInfo(e.target.value)
  });

  chips.addEventListener("change", (e) => {
    const button = document.querySelector('.select-wrapper').querySelector('esp-web-install-button');
    button.classList.add('ready');
  });


  // displaying all needed information
  const addManifestInfo = async (manifest) => {

    const manifestJSON = await fetch(`../manifest/${manifest}.manifest.json`)
    const manifestResult = await manifestJSON.json();
    const msg = document.querySelector('.msg');

    chips.innerHTML = `<option class="placeholder" value="" disabled selected>Select chip</option>`;
    chips.style.display="block"
    document.querySelector('.select-wrapper').querySelector('esp-web-install-button').classList.remove('ready')

    // adding chip options
    const options = manifestResult.builds;
    if(options.length) {
      options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.chipFamily;
        opt.innerHTML = option.chipFamily;
        chips.appendChild(opt);
      })
    } else {
      document.querySelector('.select-wrapper').querySelector('esp-web-install-button').classList.add('ready')
      chips.style.display="none";
    }

    // display information above selects
    const descr = manifestResult.description;
    const text = manifestResult.text;
    const btn = msg.querySelector('esp-web-install-button');
    const btnAttrs = btn.getAttributeNames();

    let unsupported = false;

    msg.classList.remove('invisible');


    btnAttrs.map(attr => {
     if(attr === 'install-unsupported') {
      unsupported = true;
     }
    })


    if(!unsupported) {
      if(text) {
        msgContainer.innerText = descr;
  
        const span = document.createElement('span');
        span.innerText = text;
        msgContainer.append(span)
      } else {
        msgContainer.innerText = descr;
      }
    } else {
      chips.setAttribute('disabled', true)
      firmware.setAttribute('disabled', true)
      msg.classList.add('unsupported')
      btn.classList.remove('invisible');
      document.querySelector('.btn-unsupported').style.display = 'block';
    }
 
  }


  // custom scroll bar initialization
  new SimpleBar(document.getElementById('customBar'), {
    autoHide: false,
  });

})