import ScreenHeader from '../components/ScreenHeader'

// 아직 내용이 없는 화면 공통 틀 (뒤로가기 + 제목 + 준비 중 안내)
type Props = { title: string }

function PlaceholderScreen({ title }: Props) {
  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title={title} />
      <div className="flex flex-1 items-center justify-center px-6">
        <p className="text-sm text-gray-400">화면 준비 중입니다.</p>
      </div>
    </div>
  )
}

export default PlaceholderScreen
