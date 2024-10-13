document.addEventListener("DOMContentLoaded", function() { // DOMContentLoaded 이벤트 리스너 추가 (Add event listener for DOMContentLoaded)
    const loginButton = document.getElementById('login-button'); // 로그인 버튼 요소 가져오기 (Get login button element)
    const toggleSignupButton = document.getElementById('toggle-signup-button'); // 회원가입 토글 버튼 요소 가져오기 (Get toggle sign-up button element)
    const signupExtraFields = document.getElementById('signup-extra-fields'); // 추가 회원가입 필드 요소 가져오기 (Get extra sign-up fields element)
    let isSignupMode = false; // 현재 모드 변수 초기화 (Initialize current mode variable)

    // 회원가입 모드 전환 버튼 클릭 이벤트 리스너 (Event listener for toggle sign-up button)
    toggleSignupButton.addEventListener('click', function() {
        if (isSignupMode) {
            clearFields(); // 필드 초기화 (Clear fields)
            switchToLoginMode(); // 로그인 모드로 전환 (Switch to login mode)
        } else {
            switchToSignupMode(); // 회원가입 모드로 전환 (Switch to sign-up mode)
        }
    });

    // 로그인 버튼 클릭 이벤트 리스너 (Event listener for login button)
    loginButton.addEventListener('click', function() {
        if (isSignupMode) {
            signup(); // 회원가입 함수 호출 (Call signup function)
        } else {
            login(); // 로그인 함수 호출 (Call login function)
        }
    });

    // 로그인 함수 (Login function)
    function login() {
        const username = document.getElementById('login-username').value; // 사용자 이름 가져오기 (Get username)
        const password = document.getElementById('login-password').value; // 비밀번호 가져오기 (Get password)
    
        if (username && password) { // 사용자 이름과 비밀번호가 있는지 확인 (Check if username and password are provided)
            console.log(`로그인 시도: 아이디 = ${username}, 비밀번호 = ${password}`); // 로그인 시도 로그 (Log login attempt)
    
            // AJAX 요청 (AJAX request)
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password }) // 사용자 이름과 비밀번호를 JSON 형태로 전송 (Send username and password as JSON)
            })
            .then(response => response.json()) // 응답을 JSON으로 변환 (Convert response to JSON)
            .then(data => {
                if (data.message === '로그인 성공') {
                    alert('로그인 성공'); // 로그인 성공 알림 (Alert for successful login)
                    window.location.href = '/map'; // 로그인 성공 시 /map으로 이동 (Redirect to /map on successful login)
                } else {
                    alert(data.message); // 실패 메시지 알림 (Alert failure message)
                }
            })
            .catch(error => {
                console.error('로그인 요청 오류:', error); // 요청 오류 로그 (Log request error)
                alert('로그인 요청 중 오류가 발생했습니다.'); // 요청 중 오류 알림 (Alert for request error)
            });
        } else {
            alert('사용자 이름과 비밀번호를 입력하세요.'); // 입력 확인 알림 (Alert to check input)
        }
    }
    
    // 회원가입 함수 (Sign-up function)
    function signup() {
        const username = document.getElementById('login-username').value; // 사용자 이름 가져오기 (Get username)
        const password = document.getElementById('login-password').value; // 비밀번호 가져오기 (Get password)
        const confirmPassword = document.getElementById('signup-confirm-password').value; // 비밀번호 확인 가져오기 (Get confirm password)
    
        if (username && password && confirmPassword) { // 모든 필드가 입력되었는지 확인 (Check if all fields are filled)
            if (password === confirmPassword) { // 비밀번호 일치 확인 (Check if passwords match)
                console.log(`회원가입 시도: 아이디 = ${username}, 비밀번호 = ${password}`); // 회원가입 시도 로그 (Log sign-up attempt)
    
                // AJAX 요청 (AJAX request)
                fetch('/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password }) // 사용자 이름과 비밀번호를 JSON 형태로 전송 (Send username and password as JSON)
                })
                .then(response => response.json()) // 응답을 JSON으로 변환 (Convert response to JSON)
                .then(data => {
                    alert(data.message); // 응답 메시지 알림 (Alert response message)
                    if (data.message === '회원가입 성공') {
                        clearFields(); // 필드 초기화 (Clear fields)
                        switchToLoginMode(); // 로그인 모드로 전환 (Switch to login mode)
                    }
                })
                .catch(error => {
                    console.error('회원가입 요청 오류:', error); // 요청 오류 로그 (Log request error)
                    alert('회원가입 요청 중 오류가 발생했습니다.'); // 요청 중 오류 알림 (Alert for request error)
                });
            } else {
                alert('비밀번호가 일치하지 않습니다.'); // 비밀번호 불일치 알림 (Alert for password mismatch)
            }
        } else {
            alert('모든 필드를 입력하세요.'); // 모든 필드 입력 확인 알림 (Alert to check if all fields are filled)
        }
    }

    // 필드 초기화 함수 (Clear fields function)
    function clearFields() {
        document.getElementById('login-username').value = ''; // 사용자 이름 필드 초기화 (Clear username field)
        document.getElementById('login-password').value = ''; // 비밀번호 필드 초기화 (Clear password field)
        document.getElementById('signup-confirm-password').value = ''; // 비밀번호 확인 필드 초기화 (Clear confirm password field)
    }

    // 회원가입 모드로 전환하는 함수 (Function to switch to sign-up mode)
    function switchToSignupMode() {
        clearFields(); // 필드 초기화 (Clear fields)
        signupExtraFields.style.display = 'block'; // 추가 필드 표시 (Show extra fields)
        loginButton.textContent = '회원가입 완료'; // 버튼 텍스트 변경 (Change button text)
        toggleSignupButton.textContent = '취소'; // 토글 버튼 텍스트 변경 (Change toggle button text)
        isSignupMode = true; // 현재 모드 업데이트 (Update current mode)
    }

    // 로그인 모드로 전환하는 함수 (Function to switch to login mode)
    function switchToLoginMode() {
        signupExtraFields.style.display = 'none'; // 추가 필드 숨기기 (Hide extra fields)
        loginButton.textContent = '로그인'; // 버튼 텍스트 변경 (Change button text)
        toggleSignupButton.textContent = '회원가입'; // 토글 버튼 텍스트 변경 (Change toggle button text)
        isSignupMode = false; // 현재 모드 업데이트 (Update current mode)
    }
});