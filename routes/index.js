const express = require('express'); // Express 모듈 가져오기 (Import Express module)
const router = express.Router(); // 라우터 객체 생성 (Create router object)

// 1. 홈 페이지 라우트 (Home page route)
router.get('/', (req, res) => {
  res.render('home', { title: 'Home' }); // home.ejs 파일 렌더링 (Render home.ejs file)
});

// 2. 회원가입 라우트 (Sign-up route)
router.post('/signup', (req, res) => {
  const { username, password } = req.body; // 요청 본문에서 사용자 이름과 비밀번호 가져오기 (Get username and password from request body)

  const query = 'SELECT * FROM dux_user_info WHERE user_id = ?'; // 사용자 아이디 중복 확인 쿼리 (Query to check for duplicate user ID)
  req.db.query(query, [username], (err, results) => {
    if (err) throw err; // 에러 처리 (Error handling)
    if (results.length > 0) {
      res.json({ message: '아이디가 중복되었습니다.' }); // 아이디 중복 메시지 (Duplicate ID message)
    } else {
      const insertQuery = 'INSERT INTO dux_user_info (user_id, user_pw) VALUES (?, ?)'; // 사용자 정보 삽입 쿼리 (Query to insert user info)
      req.db.query(insertQuery, [username, password], (err, result) => {
        if (err) throw err; // 에러 처리 (Error handling)
        res.json({ message: '회원가입 성공' }); // 회원가입 성공 메시지 (Sign-up success message)
      });
    }
  });
});

// 3. 로그인 라우트 (Login route)
router.post('/login', (req, res) => {
  const { username, password } = req.body; // 요청 본문에서 사용자 이름과 비밀번호 가져오기 (Get username and password from request body)

  const query = 'SELECT * FROM dux_user_info WHERE user_id = ?'; // 사용자 아이디 확인 쿼리 (Query to check user ID)
  req.db.query(query, [username], (err, results) => {
    if (err) throw err; // 에러 처리 (Error handling)
    if (results.length > 0 && results[0].user_pw === password) {
      res.json({ message: '로그인 성공' }); // 로그인 성공 메시지 (Login success message)
    } else {
      res.json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' }); // 로그인 실패 메시지 (Login failure message)
    }
  });
});

// 4. 정보 저장 라우트 (Save info route)
router.post('/saveInfo', (req, res) => {
  const { title, detail, info } = req.body; // 요청 본문에서 제목, 세부정보, 정보 가져오기 (Get title, detail, and info from request body)

  // registered_info 테이블에 데이터 삽입 (Insert data into registered_info table)
  const insertQuery = 'INSERT INTO registered_info (title, detail, info) VALUES (?, ?, ?)';
  req.db.query(insertQuery, [title, detail, info], (err, result) => {
    if (err) {
      console.error('Error inserting data into registered_info:', err); // 에러 처리 (Error handling)
      res.status(500).json({ message: '정보 저장 중 오류가 발생했습니다.' }); // 저장 중 오류 메시지 (Error during save message)
      return;
    }
    res.json({ message: '정보 저장 성공' }); // 저장 성공 메시지 (Save success message)
  });
});

// 5. 등록된 정보 조회 라우트 (Fetch registered info route)
router.get('/registered_info', (req, res) => {
  const query = 'SELECT title, detail, info FROM registered_info'; // 필요한 필드 선택 (Select required fields)
  req.db.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching registered info:', err); // 에러 처리 (Error handling)
          return res.status(500).json({ message: 'Database query failed' }); // 데이터베이스 쿼리 실패 메시지 (Database query failed message)
      }
      res.json(results); // 결과를 JSON 형태로 클라이언트에 전송 (Send results to client in JSON format)
  });
});

module.exports = router; // 라우터 모듈 내보내기 (Export router module)
