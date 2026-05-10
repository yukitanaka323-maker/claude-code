// 作業服商品カタログ（実際の商品に合わせて編集してください）
const STANDARD_SIZES = ['S', 'M', 'L', 'XL', 'LL', '3L'];
const SHOE_SIZES = ['23.5', '24.0', '24.5', '25.0', '25.5', '26.0', '26.5', '27.0', '27.5', '28.0', '28.5', '29.0'];

export default [
  {
    id: 'hat',
    categoryName: '帽子',
    products: [
      { id: 'hat-001', name: 'メッシュ帽子（緑）',         sizes: ['フリーサイズ'] },
      { id: 'hat-002', name: 'メッシュ帽子（紺）',         sizes: ['フリーサイズ'] },
      { id: 'hat-003', name: 'ヘルメット用インナーキャップ', sizes: ['フリーサイズ'] },
    ],
  },
  {
    id: 'jacket',
    categoryName: '上着',
    products: [
      { id: 'jkt-001', name: '作業シャツ（青）長袖', sizes: STANDARD_SIZES },
      { id: 'jkt-002', name: '作業シャツ（青）半袖', sizes: STANDARD_SIZES },
      { id: 'jkt-003', name: '作業ジャンパー（紺）', sizes: STANDARD_SIZES },
    ],
  },
  {
    id: 'polo',
    categoryName: '上着（ポロ）',
    products: [
      { id: 'polo-001', name: 'ポロシャツ（白）',       sizes: STANDARD_SIZES },
      { id: 'polo-002', name: 'ポロシャツ（水色）',     sizes: STANDARD_SIZES },
      { id: 'polo-003', name: 'ドライポロシャツ（グレー）', sizes: STANDARD_SIZES },
    ],
  },
  {
    id: 'winter',
    categoryName: '上着（防寒）',
    products: [
      { id: 'wtr-001', name: '防寒ジャンパー（紺）', sizes: STANDARD_SIZES },
      { id: 'wtr-002', name: '防寒ベスト',           sizes: STANDARD_SIZES },
      { id: 'wtr-003', name: '防寒インナー上',       sizes: STANDARD_SIZES },
    ],
  },
  {
    id: 'shoes',
    categoryName: '靴',
    products: [
      { id: 'sho-001', name: '安全靴（黒）紐タイプ',      sizes: SHOE_SIZES },
      { id: 'sho-002', name: '安全靴（黒）マジックタイプ', sizes: SHOE_SIZES },
      { id: 'sho-003', name: '安全長靴（黒）',            sizes: SHOE_SIZES },
    ],
  },
];
