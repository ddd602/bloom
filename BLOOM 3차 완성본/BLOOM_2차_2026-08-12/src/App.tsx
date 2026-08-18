import { Routes, Route, Navigate } from 'react-router-dom'

import Layout from './components/Layout'

import Manage from './pages/Manage'
import Calendar from './pages/Calender'
import Home from './pages/Home'
import AiChat from './pages/AiChat'
import MyPage from './pages/MyPage'
import NotFound from './pages/NotFound'

import DailyDetailMeal from './components/Meal/DailyMealDetail'
import WeeklyCalendar from './components/calender/WeeklyCalendar'

import ConditionDetail from './pages/ConditionDetail'
import PeriodDetail from './pages/PeriodDetail'

import ProfileSettings from './pages/ProfileSettings'

import Exercise from './pages/exercise/Exercise'
import RoutineCreate from './pages/exercise/RoutineCreate'
import RoutineCreated from './pages/exercise/RoutineCreated'
import ExerciseTimer from './pages/exercise/ExerciseTimer'
import ExerciseComplete from './pages/exercise/ExerciseComplete'

import NudeBodyGalleryPage from './pages/manager/NudeBodyGalleryPage'

import PlaceholderScreen from './pages/PlaceholderScreen'
import MealInput from './pages/MealInput'
import ActivityDetail from './pages/ActivityDetail'
import CharacterSetting from './pages/CharacterSetting'
import StoreScreen from './pages/StoreScreen'
import AiReport from './pages/AiReport'
import NudeBodyDetail from './pages/NudeBodyDetail'

import Splash from './pages/Splash'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Onboarding from './pages/Onboarding'

import {
  getAccessToken,
} from './components/api/AuthApi'

// 로그인 안 했으면 웰컴 화면으로
function ProtectedLayout() {
  return getAccessToken()
    ? <Layout />
    : <Navigate to="/welcome" replace />
}

export default function App() {
  return (
    <Routes>
      {/* 인증 전 화면 (하단바 없음) */}
      <Route
        path="/"
        element={<Splash />}
      />

      <Route
        path="/welcome"
        element={<Welcome />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        path="/onboarding"
        element={<Onboarding />}
      />

      {/* 앱 화면 (로그인 필요) */}
      <Route element={<ProtectedLayout />}>
        <Route
          path="/manage"
          element={<Manage />}
        />

        <Route
          path="/manage/gallery"
          element={<NudeBodyGalleryPage />}
        />

        <Route
          path="/manage/nudebody"
          element={<NudeBodyDetail />}
        />

        <Route
          path="/calendar"
          element={<Calendar />}
        />

        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/home/report"
          element={<AiReport />}
        />

        <Route
          path="/ai-chat"
          element={<AiChat />}
        />

        <Route
          path="/my-page"
          element={<MyPage />}
        />

        <Route
          path="/my-page/membership"
          element={
            <PlaceholderScreen title="멤버십 가입" />
          }
        />

        {/* 추가 */}
        <Route
          path="/my-page/profile-settings"
          element={<ProfileSettings />}
        />

        <Route
          path="/my-page/treatments"
          element={
            <PlaceholderScreen title="시술 내역" />
          }
        />

        <Route
          path="/my-page/purchases"
          element={
            <PlaceholderScreen title="구매 내역" />
          }
        />

        <Route
          path="/my-page/points"
          element={
            <PlaceholderScreen title="포인트" />
          }
        />

        <Route
          path="/my-page/notice"
          element={
            <PlaceholderScreen title="공지/이벤트" />
          }
        />

        <Route
          path="/my-page/notifications"
          element={
            <PlaceholderScreen title="알림" />
          }
        />

        <Route
          path="/my-page/store"
          element={<StoreScreen />}
        />

        <Route
          path="/my-page/store/products"
          element={
            <PlaceholderScreen title="맞춤 제품 추천" />
          }
        />

        <Route
          path="/my-page/store/procedures"
          element={
            <PlaceholderScreen title="맞춤 시술 추천" />
          }
        />

        {/* 두 번째 코드에 원래 있던 거 유지 */}
        <Route
          path="/my-page/store/ranking"
          element={
            <PlaceholderScreen title="실시간 랭킹" />
          }
        />

        <Route
          path="/my-page/ai-style"
          element={
            <PlaceholderScreen title="AI 대화체 설정" />
          }
        />

        <Route
          path="/my-page/character"
          element={<CharacterSetting />}
        />

        <Route
          path="/my-page/support"
          element={
            <PlaceholderScreen title="고객센터" />
          }
        />

        <Route
          path="/my-page/faq"
          element={
            <PlaceholderScreen title="자주 묻는 질문" />
          }
        />

        <Route
          path="/my-page/inquiry"
          element={
            <PlaceholderScreen title="1:1 문의" />
          }
        />

        <Route
          path="/my-page/terms"
          element={
            <PlaceholderScreen title="약관 및 정책" />
          }
        />

        <Route
          path="/DailyMealDetail"
          element={<DailyDetailMeal />}
        />

        <Route
          path="/meal-input/:type"
          element={<MealInput />}
        />

        <Route
          path="/activity"
          element={<ActivityDetail />}
        />

        <Route
          path="/weeklyCalendar"
          element={<WeeklyCalendar />}
        />

        <Route
          path="/conditionDetail"
          element={<ConditionDetail />}
        />

        {/* 추가 */}
        <Route
          path="/periodDetail"
          element={<PeriodDetail />}
        />


        <Route
          path="/manage/exercise"
          element={<Exercise />}
        />

        <Route
          path="/manage/exercise/new"
          element={<RoutineCreate />}
        />

        <Route
          path="/manage/exercise/new/done"
          element={<RoutineCreated />}
        />

        <Route
          path="/manage/exercise/:id"
          element={<ExerciseTimer />}
        />

        <Route
          path="/manage/exercise/complete"
          element={<ExerciseComplete />}
        />

        <Route
          path="*"
          element={<NotFound />}
        />
      </Route>
    </Routes>
  )
}