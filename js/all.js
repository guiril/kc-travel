var data;
var map;

// 目前的標記
var markers = [];
// 目前的地圖資訊
var currentInfoWindow = '';

var select = document.querySelector('#districtList');
var title = document.querySelector('h2');
var list = document.querySelector('.cardList');
var popular = document.querySelector('.popularArea');
var addMap = document.querySelector('#map');

// 將遠端資料存入 data
function getData() {
  var xhr = new XMLHttpRequest();
  xhr.open('get', 'https://ouiis.github.io/kc_travel/json/data.json', true);
  xhr.send(null);

  xhr.onload = function () {
    var get = JSON.parse(xhr.responseText);
    data = get.result.records;
    for (var i = 0; data.length > i; i++) {
      loadMarkers(data[i].Py, data[i].Px, data[i].Name);
    }
  }
};

// 載入地圖
function initMap() {
  map = new google.maps.Map(addMap, {
    center: { lat: 22.8498679, lng: 120.4883959 },
    zoom: 10
  });
};

// 更新景點資訊
function updateList(e) {
  var district = e.target.value;
  var str = '';
  var total = 0;

  // 清除原本的標記
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  };

  markers = [];
  infoWindows = [];

  // 載入景點
  for (var i = 0; i < data.length; i++) {
    if (district == data[i].Zone) {
      total += 1;
      str += '<li><div class="pic" style="background-image: url(' + data[i].Picture1 + ');"><h3>' + data[i].Name + '</h3><span>' + district + '</span></div><div class="txt"><p class="opentime"><span></span>' + data[i].Opentime + '</p><p class="address"><span></span>' + data[i].Add + '</p><p class="tel"><span></span>' + data[i].Tel + '</p><p class="ticket"><span></span>' + data[i].Ticketinfo + '</p></div></li >';
      loadMarkers(data[i].Py, data[i].Px, data[i].Name);
    }
  };

  title.textContent = district;
  list.innerHTML = str;

  if (total == 0) {
    title.textContent = '目前尚無資料';
  };
}

function loadMarkers(lat, lng, title) {
  // 地圖資訊
  var infowindow = new google.maps.InfoWindow({
    content: title
  });
  // 標記
  var marker = new google.maps.Marker({
    position: { lat: parseFloat(lat), lng: parseFloat(lng) },
    title: title,
    map: map
  });

  marker.addListener('click', function () {
    if (currentInfoWindow != '') {
      currentInfoWindow.close();
      currentInfoWindow = '';
    }
    infowindow.open(map, marker);
    currentInfoWindow = infowindow;
  });
  markers.push(marker);
}

getData();
select.addEventListener('change', updateList, false);
popular.addEventListener('click', updateList, false);