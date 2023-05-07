let cros = /(CrOS)/.test(navigator.userAgent);
let iframe = null;

function send_message(data) {
  return new Promise((resolve, reject)=>{
    let message_listener = function(event) {
      resolve(event.data);
      removeEventListener("message", message_listener);
    }
    window.addEventListener("message", message_listener);

    iframe.contentWindow.postMessage(data, "chrome-extension://kddnkjkcjddckihglkfcickdhbmaodcn");
  });
}

async function create_prompt(message, service_id=null) {
  if (!service_id) {
    service_id = ""+Math.random(); 
  }
  
  let data = {
    origin: "https://www.google.com/chromebook/perks/",
    serviceId: service_id,
    serviceName: message,
    requestNonce: ""+Math.random(),
    isGroupType: false,
    isDebugMode: false,
    otcCode: true
  }

  return await send_message(data);  
}

async function get_offers() {
  let data = {
    cmd: "getOfferInfo"
  }
  return await send_message(data);
}

async function populate_offers() {
  let offers = await get_offers();
  from_id("cros_board").innerHTML = offers.deviceFamily;
  from_id("last_id").innerHTML = offers.last_service_id;
  for (let service in offers.services) {
    let service_detail = offers.services[service];
    let item = document.createElement("li");
    item.innerHTML = `${service} - <code>${JSON.stringify(service_detail)}</code>`
    from_id("offers_list").append(item);

    if (service_detail.promo_code) {
      let promo_item = document.createElement("li");
      promo_item.innerHTML = `${service} - <code>${service_detail.promo_code}</code>`
      from_id("promos_list").append(promo_item);
    }
  }
}

function button_callback() {
  create_prompt(from_id("prompt_message").value);
}

function iframe_onload() {
  from_id("prompts_button").onclick = button_callback;
  populate_offers()
}

window.onload = () => {
  if (!cros) {
    alert("This only works on Chrome OS!");
    return;
  }
  iframe = document.createElement("iframe");
  iframe.src = "chrome-extension://kddnkjkcjddckihglkfcickdhbmaodcn/broker.html";
  iframe.style.display = "none";
  iframe.onload = iframe_onload;
  document.body.append(iframe);
}