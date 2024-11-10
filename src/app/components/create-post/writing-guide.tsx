interface WritingGuideProps {
  type: 'title' | 'content'
}

export const WritingGuide = ({ type }: WritingGuideProps) => {
  if (type === 'title') {
    return (
      <div className="mt-2 p-4 bg-blue-100 text-sm text-gray-700 rounded-lg">
        <h3 className="font-semibold mb-2">Tiêu đề tốt nên có:</h3>
        <p>Loại sản phẩm + Thương hiệu + Model + Kích thước/Dung tích + Màu sắc + Tình trạng</p>
        <p className="mt-2">Ví dụ:</p>
        <ul className="list-disc list-inside">
          <li>- Macbook Pro M1 8GB 256GB 13.3" Retina mới 100%</li>
          <li>- HP Elitebook 8570p i5/8GB/128GB SSD + 256GB HDD mới 95%</li>
        </ul>
      </div>
    )
  }

  return (
    <div className="mt-2 p-4 bg-blue-100 text-sm text-gray-700 rounded-lg">
      <h3 className="font-semibold mb-2">Không cho phép:</h3>
      <ul className="list-disc list-inside">
        <li>- Sản phẩm cấm, hạn chế hoặc giả/nhái</li>
        <li>- Thông tin trùng lặp với tin cũ</li>
        <li>- Sử dụng từ ngữ không phù hợp</li>
      </ul>
    </div>
  )
}