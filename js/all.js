var select = document.querySelector('#districtList');
var title = document.querySelector('h2');
var list = document.querySelector('.cardList');
var popular = document.querySelector('.popularArea');
var data;

var xhr = new XMLHttpRequest();
xhr.open('get', 'https://ouiis.github.io/kc_travel/json/data.json', true);
xhr.send(null);
xhr.onload = function () {
  var getData = JSON.parse(xhr.responseText);
  data = getData.result.records;
}

function updateList(e) {
  var district = e.target.value;
  var str = '';
  var total = 0;

  for (var i = 0; i < data.length; i++) {
    if (district == data[i].Zone) {
      total += 1;
      str += '<li><div class="pic" style="background-image: url(' + data[i].Picture1 + ');"><h3>' + data[i].Name + '</h3><span>' + district + '</span></div><div class="txt"><p class="opentime"><span></span>' + data[i].Opentime + '</p><p class="address"><span></span>' + data[i].Add + '</p><p class="tel"><span></span>' + data[i].Tel + '</p><p class="ticket"><span></span>' + data[i].Ticketinfo + '</p></div></li >';
    }
  }

  title.textContent = district;
  list.innerHTML = str;

  if (total == 0) {
    title.textContent = '目前尚無資料';
  }
}

select.addEventListener('change', updateList, false);
popular.addEventListener('click', updateList, false);