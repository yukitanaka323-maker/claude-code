// カードリーダーの認証番号と社員情報のマッピング
// authNumber: カードリーダーが出力する番号・文字列
// isAdmin: true にすると管理者メニューに誘導（将来の拡張用。現状は注文フローのみ）
export default [
  { authNumber: 'EMP001', name: '山田太郎',   department: '製造1課', isAdmin: false },
  { authNumber: 'EMP002', name: '佐藤花子',   department: '製造2課', isAdmin: false },
  { authNumber: 'EMP003', name: '鈴木一郎',   department: '品質管理', isAdmin: false },
  { authNumber: 'ADMIN01', name: '田中総務',  department: '総務部',  isAdmin: true  },
  // ↑ 実際の社員データに書き換えてください
];
