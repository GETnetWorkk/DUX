let map; // 지도 객체 (Naver Map API 사용) / Map object (using Naver Map API)
let markers = []; // 마커 배열 / Array of markers
let polyline; // 폴리라인 객체 / Polyline object
let infoWindow; // 인포 윈도우 객체 / Info window object
let markersVisible = true; // 마커 가시성 상태 / Visibility status of markers
let polylineVisible = true; // 폴리라인 가시성 상태 / Visibility status of polyline

function initMap() {
    map = new naver.maps.Map('map', { // 네이버 지도를 특정 위치에 생성 / Creates a Naver map at a specific location
        center: new naver.maps.LatLng(37.3595704, 127.105399), // 지도의 초기 중심점 / Initial center of the map
        zoom: 10 // 초기 줌 레벨 설정 / Initial zoom level
    });

    // 폴리라인 초기화 / Initialize polyline
    polyline = new naver.maps.Polyline({
        map: map, // 폴리라인이 표시될 지도 / Map on which the polyline will be displayed
        path: [], // 폴리라인의 경로 (초기값: 빈 배열) / Path of the polyline (initially empty)
        strokeColor: '#5347AA', // 폴리라인 색상 / Color of the polyline
        strokeWeight: 3 // 폴리라인 두께 / Thickness of the polyline
    });

    // 인포 윈도우 초기화 / Initialize info window
    infoWindow = new naver.maps.InfoWindow({
        content: '', // 초기 내용은 비어 있음 / Initial content is empty
        maxWidth: 200 // 인포 윈도우의 최대 너비 / Maximum width of the info window
    });
}

// 페이지 로드 시 지도 초기화 / Initialize map on page load
initMap();

function initPolyline() {
    polyline = new naver.maps.Polyline({
        map: map, // 폴리라인이 표시될 지도 / Map to display the polyline
        path: [], // 초기 경로 설정 / Initial path (empty array)
        strokeColor: '#FF0000', // 폴리라인 색상 (빨강) / Polyline color (red)
        strokeWeight: 3 // 폴리라인 두께 설정 / Set polyline thickness
    });
}

function updatePolyline() {
    const path = markers.map(marker => marker.getPosition()); 
    // 각 마커의 위치를 배열로 추출 / Extract marker positions as an array

    // 폴리라인이 보이지 않을 때 보이도록 설정 / Show polyline if it's hidden
    if (!polylineVisible) {
        polyline.setMap(map); // 폴리라인을 지도에 추가 / Add polyline to the map
        polylineVisible = true; // 가시성 상태 업데이트 / Update visibility status
    }

    polyline.setPath(path); // 폴리라인 경로 업데이트 / Update polyline path
}

// 페이지 로드 시 폴리라인 초기화 / Initialize polyline on page load
window.onload = function() {
    initPolyline();
};

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar'); // 사이드바 요소 가져오기 / Get sidebar element
    const toggleButton = document.getElementById('toggleButton'); // 토글 버튼 가져오기 / Get toggle button

    if (sidebar.style.display === "none") { 
        // 사이드바가 숨겨져 있으면 표시 / Show sidebar if hidden
        sidebar.style.display = "block"; 
        setTimeout(() => {
            sidebar.classList.add('active'); // 활성 클래스 추가 / Add 'active' class
        }, 10);
        toggleButton.classList.add('hidden'); // 토글 버튼 숨기기 / Hide toggle button
    } else { 
        // 사이드바가 보이면 숨기기 / Hide sidebar if visible
        sidebar.classList.remove('active'); 
        setTimeout(() => {
            sidebar.style.display = "none"; // 사이드바 비활성화 / Deactivate sidebar
        }, 300);
        toggleButton.classList.remove('hidden'); // 토글 버튼 표시 / Show toggle button
    }
}

function showTravelInfo() {
    // 모든 요소 비활성화 / Disable all elements
    document.getElementById('functionContainer').style.display = 'none';
    document.getElementById('searchContainer').style.display = 'block'; // 검색 기능 활성화 / Enable search feature

    // 검색 버튼과 검색 텍스트 입력 상자를 다시 보이게 함 / Make search input and button visible
    document.getElementById('searchInput').style.display = 'block'; 
    const searchButton = document.querySelector('.search-input-container button');
    if (searchButton) {
        searchButton.style.display = 'block'; // 검색 버튼 보이기 / Display search button
    }

    // 검색 결과 영역 초기화 / Clear previous search results
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = ''; 
}

function showUserInfo() {
    const userInfoBox = document.getElementById('userInfoBox');
    const userInfo = document.getElementById('userInfo');

    // 사용자 정보 가져오기 (예시로 하드코딩) / Retrieve user info (hardcoded as example)
    const username = "사용자 아이디"; 
    const password = "비밀번호"; 

    userInfo.textContent = `아이디: ${username}, 비밀번호: ${password}`;
    userInfoBox.style.display = "block"; // 사용자 정보 박스 보이기 / Display user info box
}

function goBack() {
    // 검색 기능 숨기기 / Hide search feature
    document.getElementById('searchContainer').style.display = 'none';
    // 기능 컨테이너 다시 활성화 / Reactivate function container
    document.getElementById('functionContainer').style.display = 'block';
}

function logout() {
    // 로그아웃 처리 / Handle logout (e.g., session termination)
    window.location.href = '/'; // 초기 화면으로 돌아가기 / Redirect to home page
}

function toggleChatBox() {
    const chatBox = document.getElementById('chatBox');
    const chatIcon = document.getElementById('chatIcon');

    if (chatBox.style.display === "none") {
        chatBox.style.display = "flex"; // 채팅 상자 열기 / Open chat box
        chatIcon.style.display = "none"; // 아이콘 숨기기 / Hide icon
    } else {
        chatBox.style.display = "none"; // 채팅 상자 닫기 / Close chat box
        chatIcon.style.display = "flex"; // 아이콘 보이기 / Show icon
    }
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatContent = document.getElementById('chatContent');
    const message = chatInput.value;

    if (message.trim() !== "") {
        const newMessage = document.createElement('div');
        newMessage.textContent = message; // 새로운 메시지 추가 / Add new message
        chatContent.appendChild(newMessage);
        chatInput.value = ""; // 입력 초기화 / Clear input
    }
}

async function fetchNaverData(query) {
    console.log(`Searching for: ${query}`); // 요청 직전 로그 / Log before request
    try {
        const response = await fetch(`/search?query=${encodeURIComponent(query)}`);
        console.log(`Response status: ${response.status}`); // 응답 상태 로그 / Log response status
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Data received:', data); // 반환된 데이터 로그 / Log received data
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function searchLocations() {
    const query = document.getElementById('searchInput').value;
    const results = await fetchNaverData(query);

    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = ''; // 이전 결과 초기화 / Clear previous results

    if (results.items) {
        results.items.forEach(item => {
            const resultDiv = document.createElement('div');
            resultDiv.classList.add('result-item'); // 클래스 추가 / Add class
            resultDiv.innerHTML = `
                <strong>${item.title}</strong><br>
                <span>${item.description || ''}</span><br>
                <span>${item.address || ''}</span><br>
                <button onclick="goToLocation(${item.mapx}, ${item.mapy}, '${item.title}', '${item.address || ''}', '${item.category || ''}')">위치로 가기</button>
                <button onclick="registerInfo('${item.title}', '${item.description || ''}', '${item.address || ''}', ${item.mapx}, ${item.mapy}, '${item.category || ''}')">정보 등록</button>
            `;
            resultsContainer.appendChild(resultDiv);
        });
    }
}

// 위치로 이동하는 함수
// Function to navigate to a specific location on the map
function goToLocation(mapx, mapy, title, address, category) {
    const longitude = parseFloat(mapx) / 10000000; // mapx 값을 10,000,000으로 나눠 경도로 변환
    const latitude = parseFloat(mapy) / 10000000; // mapy 값을 10,000,000으로 나눠 위도로 변환

    const location = new naver.maps.LatLng(latitude, longitude); // 위도와 경도를 사용해 LatLng 객체 생성

    // 기존의 모든 마커를 지도에서 제거합니다.
    // Remove all existing markers from the map
    markers.forEach(marker => marker.setMap(null));
    markers = []; // 마커 배열 초기화

    // 새로운 마커 생성 및 지도에 추가
    // Create a new marker and add it to the map
    const marker = new naver.maps.Marker({
        position: location, // 마커 위치 설정
        map: map,           // 마커를 표시할 지도
        title: title        // 마커의 제목 설정
    });

    markers.push(marker); // 새 마커를 마커 배열에 추가

    // 마커에 마우스를 올릴 때 정보창 표시 이벤트 추가
    // Add a 'mouseover' event to display an info window
    marker.addListener('mouseover', () => {
        infoWindow.setContent(`
            <div class="info-window-content" style="font-size: 13.5px;">
                <strong>${title}</strong><br>
                <span>주소: ${address}</span><br>
                <span>카테고리: ${category}</span><br>
            </div>
        `);
        infoWindow.open(map, marker.getPosition()); // 인포윈도우를 마커 위치에 열기
    });

    // 마우스를 떼면 정보창 닫기
    // Close the info window on 'mouseout'
    marker.addListener('mouseout', () => {
        infoWindow.close();
    });

    // 지도 중심을 해당 위치로 이동하고 줌 레벨을 설정합니다.
    // Move the map center to the new location and adjust zoom level
    map.setCenter(location);
    map.setZoom(16);

    updatePolyline(); // 경로를 업데이트합니다.
}

// 등록된 정보를 추가하는 함수
// Function to register new information
function registerInfo(title, description, address, mapx, mapy, category) {
    console.log("정보 등록:", title, description, address, mapx, mapy); // 등록 로그 출력

    const registeredInfoContainer = document.getElementById('registeredInfoContainer');
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('registered-info'); // 등록된 정보에 CSS 클래스 추가

    // 고유한 정보 ID 생성
    // Generate a unique ID for the info
    const infoId = `info-${Date.now()}`;
    infoDiv.id = infoId;

    // 정보의 속성 설정 (data-* 속성 사용)
    // Set attributes using data-* for storing extra information
    infoDiv.setAttribute('data-mapx', mapx);
    infoDiv.setAttribute('data-mapy', mapy);
    infoDiv.setAttribute('data-category', category);

    // 등록된 정보의 HTML 내용 구성
    // Construct the HTML structure for the registered info
    infoDiv.innerHTML = `
        <strong>${title}</strong><br>
        <span>${description}</span><br>
        <span>${address}</span><br>
        <button onclick="goToLocation(${mapx}, ${mapy}, '${title}', '${address}', '${category}')">위치로 가기</button>
        <button onclick="deleteInfo('${infoId}')">삭제</button>
    `;

    registeredInfoContainer.appendChild(infoDiv); // DOM에 추가

    // 새로운 마커 생성
    // Create a new marker for the location
    const longitude = parseFloat(mapx) / 10000000;
    const latitude = parseFloat(mapy) / 10000000;
    const location = new naver.maps.LatLng(latitude, longitude);

    const marker = new naver.maps.Marker({
        position: location,
        map: map,
        title: title,
        infoId: infoId // 마커에 고유 정보 ID 저장
    });

    markers.push(marker); // 마커 배열에 추가

    // 마커에 마우스 오버/아웃 이벤트 추가
    // Add mouseover and mouseout events to the marker
    marker.addListener('mouseover', () => {
        infoWindow.setContent(`
            <div class="info-window-content" style="font-size: 12px;">
                <strong>${title}</strong><br>
                <span>주소: ${address}</span><br>
                <span>카테고리: ${category}</span><br>
            </div>
        `);
        infoWindow.open(map, marker.getPosition());
    });

    marker.addListener('mouseout', () => {
        infoWindow.close();
    });

    updatePolyline(); // 경로 업데이트

    // 사이드바 열기
    // Open the extended sidebar if it's not already open
    const extendedSidebar = document.getElementById('extendedSidebar');
    if (extendedSidebar.style.display === "none" || extendedSidebar.style.display === "") {
        toggleExtendedSidebar();
    }
}

// 삭제 기능 추가 / Delete registered information and marker
function deleteInfo(infoId) {
    const infoDiv = document.getElementById(infoId); // 정보 요소 찾기 / Find the info element
    if (infoDiv) {
        infoDiv.remove(); // DOM에서 정보 제거 / Remove the info from DOM

        // 마커 배열에서 해당 infoId를 가진 마커를 찾아 제거 / Find and remove the marker with matching infoId
        const markerIndex = markers.findIndex(marker => marker.infoId === infoId);
        if (markerIndex !== -1) {
            markers[markerIndex].setMap(null); // 지도에서 마커 제거 / Remove marker from the map
            markers.splice(markerIndex, 1); // 마커 배열에서 제거 / Remove marker from the array
        }

        updatePolyline(); // 남아있는 마커로 경로 업데이트 / Update route with remaining markers
    }
}

// 확장된 사이드바 열고 닫기 / Toggle extended sidebar visibility
function toggleExtendedSidebar() {
    const extendedSidebar = document.getElementById('extendedSidebar');
    const toggleExtendedButton = document.getElementById('toggleExtendedButton');

    if (extendedSidebar.style.display === "none") {
        extendedSidebar.style.display = "block"; // 사이드바 열기 / Show the sidebar
        setTimeout(() => {
            extendedSidebar.classList.add('active'); // 애니메이션 추가 / Add animation
        }, 10);
        toggleExtendedButton.style.display = "none"; // 버튼 숨기기 / Hide the button
    } else {
        extendedSidebar.classList.remove('active'); // 애니메이션 제거 / Remove animation
        setTimeout(() => {
            extendedSidebar.style.display = "none"; // 사이드바 닫기 / Hide the sidebar
            toggleExtendedButton.style.display = "block"; // 버튼 보이기 / Show the button
        }, 300);
    }
}

// 마커와 경로의 가시성 토글 / Toggle visibility of markers and route
function toggleMarkersAndRoute() {
    markersVisible = !markersVisible; // 현재 상태 반전 / Toggle the current state
    markers.forEach(marker => {
        marker.setMap(markersVisible ? map : null); // 마커 가시성 설정 / Set marker visibility
    });
    polyline.setMap(markersVisible ? map : null); // 경로 가시성 설정 / Set route visibility
}

// 마커 삭제 함수 / Clear all markers from the map
function clearMarkers() {
    markers.forEach(marker => marker.setMap(null)); // 지도에서 모든 마커 제거 / Remove all markers from the map
    markers = []; // 마커 배열 초기화 / Reset the markers array
}

// 경로 삭제 함수 / Clear all routes from the map
function clearRoutes() {
    routes.forEach(route => route.setMap(null)); // 지도에서 경로 제거 / Remove routes from the map
    routes = []; // 경로 배열 초기화 / Reset the routes array
}

// 서버에 등록된 정보를 저장하는 비동기 함수 / Asynchronous function to save registered info to the server
async function saveRegisteredInfo() {
    const title = document.getElementById('infoTitleInput').value; // 제목 입력값 가져오기 / Get the title input value
    const detail = document.getElementById('infoDetailsInput').value; // 세부 정보 입력값 가져오기 / Get the detail input value
    const registeredInfoContainer = document.getElementById('registeredInfoContainer'); // 등록된 정보 컨테이너 / Registered info container
    const infoDivs = registeredInfoContainer.getElementsByClassName('registered-info'); // 등록된 개별 정보들 / Individual registered info

    let info = ''; // 서버로 보낼 정보를 담을 변수 / Variable to store the info string
    for (let div of infoDivs) {
        const title = div.querySelector('strong').innerText; // 제목 가져오기 / Get the title
        const description = div.querySelector('span').innerText; // 설명 가져오기 / Get the description
        const address = div.querySelectorAll('span')[1].innerText; // 주소 가져오기 / Get the address
        const mapx = div.getAttribute('data-mapx'); // x 좌표 가져오기 / Get the x-coordinate
        const mapy = div.getAttribute('data-mapy'); // y 좌표 가져오기 / Get the y-coordinate
        const category = div.getAttribute('data-category'); // 카테고리 가져오기 / Get the category

        info += `${title}##${description}##${address}##${mapx}##${mapy}##${category}@@`; // 정보를 포맷팅 / Format the info string
    }

    // AJAX 요청으로 서버에 데이터 저장 / Send data to the server using an AJAX request
    try {
        const response = await fetch('/saveInfo', { // '/saveInfo'로 POST 요청 / POST request to '/saveInfo'
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // JSON 데이터 전송 / Sending JSON data
            },
            body: JSON.stringify({
                title: title, // 제목 / Title
                detail: detail, // 세부 정보 / Detail
                info: info // 등록된 정보 문자열 / Registered info string
            })
        });

        if (!response.ok) { // 응답이 실패한 경우 / If the response is not OK
            throw new Error('저장 실패 / Save failed');
        }

        alert('정보가 성공적으로 저장되었습니다. / Info saved successfully'); // 성공 알림 / Success alert

        resetMap(); // 지도를 초기화 / Reset the map
        registeredInfoContainer.innerHTML = ''; // 모든 등록된 정보 삭제 / Clear all registered info

        // 입력 필드 초기화 / Clear the input fields
        document.getElementById('infoTitleInput').value = '';
        document.getElementById('infoDetailsInput').value = '';
    } catch (error) {
        console.error('저장 중 오류 발생 / Error during saving:', error); // 오류 출력 / Log the error
        alert('정보 저장에 실패했습니다. / Failed to save the info'); // 실패 알림 / Failure alert
    }
}

// 지도와 관련된 요소를 초기화하는 함수 / Function to reset the map and markers
function resetMap() {
    markers.forEach(marker => marker.setMap(null)); // 모든 마커 제거 / Remove all markers
    markers = []; // 마커 배열 초기화 / Reset marker array

    polyline.setPath([]); // 폴리라인 경로 초기화 / Reset polyline path
    polyline.setMap(null); // 폴리라인 숨기기 / Hide polyline
    polylineVisible = false; // 폴리라인 가시성 초기화 / Reset polyline visibility

    // 지도 중심과 줌 레벨 초기화 / Reset map center and zoom level
    map.setCenter(new naver.maps.LatLng(37.3595704, 127.105399)); // 초기 위치 / Initial location
    map.setZoom(10); // 초기 줌 레벨 / Initial zoom level
}

// 페이지 로드 후 지도 초기화 / Initialize map after the page loads
document.addEventListener('DOMContentLoaded', initMap);

