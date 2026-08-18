import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="px-5 pt-10 text-center">
      <h1 className="text-2xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-sm text-gray-500">페이지를 찾을 수 없습니다.</p>
      <Link to="/home" className="mt-4 inline-block text-sm text-blue-500 underline">
        홈으로 돌아가기
      </Link>
    </section>
  )
}

export default NotFound