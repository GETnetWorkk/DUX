// 1. 필요한 모듈 가져오기 (Import necessary modules)
require('dotenv').config(); // .env 파일에서 환경 변수 로드 (Load environment variables from .env file)
const express = require('express'); // Express 모듈 가져오기 (Import Express module)
const path = require('path'); // 경로 관련 모듈 (Module for handling file and directory paths)
const mysql = require('mysql'); // MySQL 모듈 (Import MySQL module)
const indexRouter = require('./routes/index'); // 라우터 모듈 (Import router module)

const app = express(); // Express 애플리케이션 생성 (Create Express application)

// 2. MySQL 데이터베이스 연결 설정 (Configure MySQL database connection)
const db = mysql.createConnection({
    host: '192.168.0.17', // MySQL 호스트 (MySQL host)
    user: 'morningbread', // 사용자 이름 (Username)
    password: '0510wlstn', // 비밀번호 (Password)
    database: 'dux' // 사용할 데이터베이스 (Database to use)
});

// 3. 데이터베이스 연결 (Connect to the database)
db.connect((err) => {
    if (err) {
        console.error('데이터베이스 연결 실패:', err); // 데이터베이스 연결 실패 메시지 (Database connection failed message)
        return;
    }
    console.log('데이터베이스에 연결되었습니다.'); // 데이터베이스 연결 성공 메시지 (Database connected successfully message)
});

// 4. Body-parser 설정 (Configure body-parser)
app.use(express.json()); // JSON 요청 파싱 (Parse JSON requests)
app.use(express.urlencoded({ extended: true })); // URL-encoded 요청 파싱 (Parse URL-encoded requests)

// 5. 뷰 엔진 설정 (Set view engine)
app.set('views', path.join(__dirname, 'views')); // 뷰 파일 경로 설정 (Set view files path)
app.set('view engine', 'ejs'); // 뷰 엔진으로 EJS 사용 (Use EJS as view engine)

// 6. 정적 파일 제공 (Serve static files)
app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 경로 설정 (Set static files path)

// 7. MySQL 데이터베이스 객체를 모든 요청에 추가 (Add MySQL database object to all requests)
app.use((req, res, next) => {
    req.db = db; // 요청 객체에 db 추가 (Add db to request object)
    next(); // 다음 미들웨어로 이동 (Move to the next middleware)
});

// 8. 라우트 설정 (Configure routes)
app.use('/', indexRouter); // 기본 라우트 설정 (Set default route)

// 9. 지도 페이지 라우트 (Map page route)
app.get('/map', (req, res) => {
    res.render('Map', { title: 'Map' }); // Map.ejs 파일 렌더링 (Render Map.ejs file)
});

// 10. Naver API 라우트 (Naver API route)
app.get('/search', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const query = req.query.query;

        console.log(`Received search query: ${query}`);

        // display 파라미터를 10으로 설정하여 최대 10개의 결과 요청 (Set display parameter to 10 to request up to 10 results)
        const response = await fetch(`https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=10`, {
            headers: {
                'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching data:', errorData);
            return res.status(response.status).json({ message: errorData.message || 'Internal Server Error' });
        }

        const data = await response.json();
        console.log('Response data:', data);
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// 11. 서버 시작 (Start the server)
const PORT = process.env.PORT || 3001; // 포트 설정 (Set port)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // 서버 시작 메시지 (Server start message)
});

module.exports = app; // 모듈 내보내기 (Export module)